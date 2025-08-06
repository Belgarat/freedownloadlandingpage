-- Test database structure
-- Check if anonymous_counters table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'anonymous_counters'
);

-- Check table structure if it exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'anonymous_counters' 
AND table_schema = 'public';

-- Check if there's any data
SELECT * FROM anonymous_counters LIMIT 5; 