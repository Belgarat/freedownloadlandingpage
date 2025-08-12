-- A/B Testing Tables (Supabase/PostgreSQL)
-- Creazione tabella ab_tests
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  traffic_split INTEGER DEFAULT 50,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_element VARCHAR(255),
  target_selector TEXT,
  conversion_goal JSONB,
  statistical_significance DECIMAL(5,2) DEFAULT 0,
  total_visitors INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creazione tabella ab_variants
CREATE TABLE IF NOT EXISTS ab_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  value TEXT NOT NULL,
  css_class VARCHAR(255),
  css_style TEXT,
  visitors INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  is_control BOOLEAN DEFAULT FALSE,
  is_winner BOOLEAN DEFAULT FALSE,
  confidence_level DECIMAL(5,2),
  improvement DECIMAL(5,2),
  traffic_split DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creazione tabella ab_test_results
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES ab_variants(id) ON DELETE CASCADE,
  visitor_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversion BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creazione tabella ab_visitor_assignments
CREATE TABLE IF NOT EXISTS ab_visitor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(255) NOT NULL,
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES ab_variants(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(visitor_id, test_id)
);

-- Creazione indici per performance
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_visitor_id ON ab_test_results(visitor_id);
CREATE INDEX IF NOT EXISTS idx_ab_variants_test_id ON ab_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_visitor_assignments_visitor_id ON ab_visitor_assignments(visitor_id);
CREATE INDEX IF NOT EXISTS idx_ab_visitor_assignments_test_id ON ab_visitor_assignments(test_id);

-- Funzione per calcolare le statistiche dei test
CREATE OR REPLACE FUNCTION calculate_ab_test_stats(test_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_visitors', COUNT(*),
    'total_conversions', COUNT(*) FILTER (WHERE conversion = true),
    'overall_conversion_rate', 
      CASE 
        WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE conversion = true)::DECIMAL / COUNT(*)::DECIMAL) * 100
        ELSE 0 
      END,
    'variant_stats', (
      SELECT json_agg(
        json_build_object(
          'variant_id', v.id,
          'visits', COUNT(r.id),
          'conversions', COUNT(r.id) FILTER (WHERE r.conversion = true),
          'conversion_rate', 
            CASE 
              WHEN COUNT(r.id) > 0 THEN (COUNT(r.id) FILTER (WHERE r.conversion = true)::DECIMAL / COUNT(r.id)::DECIMAL) * 100
              ELSE 0 
            END
        )
      )
      FROM ab_variants v
      LEFT JOIN ab_test_results r ON v.id = r.variant_id
      WHERE v.test_id = calculate_ab_test_stats.test_id
      GROUP BY v.id
    )
  ) INTO result
  FROM ab_test_results
  WHERE test_id = calculate_ab_test_stats.test_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
