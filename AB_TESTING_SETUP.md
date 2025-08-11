# A/B Testing Setup Guide

## 🗄️ Database Setup

### 1. Creare le tabelle nel database Supabase

1. Vai al dashboard di Supabase
2. Naviga su "SQL Editor"
3. Copia e incolla il contenuto del file `migrations/ab_testing_tables.sql`
4. Esegui lo script SQL

### 2. Tabelle create

- **`ab_tests`** - Test A/B con configurazione e statistiche
- **`ab_variants`** - Varianti per ogni test
- **`ab_test_results`** - Risultati dei test (visite e conversioni)
- **`ab_visitor_assignments`** - Assegnazioni visitatori alle varianti

## 🚀 API Endpoints

### Setup
- `POST /api/ab-testing/setup` - Istruzioni per configurazione database

### Gestione Test
- `GET /api/ab-testing/tests` - Ottieni tutti i test
- `POST /api/ab-testing/tests` - Crea un nuovo test
- `PUT /api/ab-testing/tests?id=<testId>` - Aggiorna un test
- `DELETE /api/ab-testing/tests?id=<testId>` - Elimina un test

### Tracking
- `POST /api/ab-testing/track` - Traccia visita/conversione
- `GET /api/ab-testing/track?testId=<testId>` - Ottieni statistiche test

### Assegnazioni
- `GET /api/ab-testing/assignments?visitorId=<visitorId>&testId=<testId>` - Ottieni assegnazione
- `POST /api/ab-testing/assignments` - Assegna variante a visitatore
- `DELETE /api/ab-testing/assignments?visitorId=<visitorId>&testId=<testId>` - Rimuovi assegnazione

## 📊 Features

### ✅ Implementate
- Dashboard completo per gestione test
- 8 template predefiniti per diversi tipi di test
- Tracking automatico di visite e conversioni
- Assegnazione casuale di varianti ai visitatori
- Statistiche in tempo reale
- Salvataggio persistente nel database
- Test automatizzati completi

### 🎯 Tipi di Test Supportati
- **CTA Button Text** - Testo del pulsante call-to-action
- **CTA Button Color** - Colore del pulsante
- **Headline Text** - Testo del titolo principale
- **Headline Size** - Dimensione del titolo
- **Offer Text** - Testo dell'offerta
- **Social Proof** - Elementi di prova sociale
- **Form Placeholder** - Placeholder del form email
- **Page Layout** - Layout della pagina

## 🔧 Utilizzo

### 1. Creare un test
```javascript
const test = {
  name: 'CTA Button Color Test',
  description: 'Testing different button colors',
  type: 'cta_button_color',
  status: 'running',
  variants: [
    { name: 'Control', value: 'primary', isControl: true },
    { name: 'Variant A', value: 'accent', isControl: false }
  ],
  targetSelector: 'button[type="submit"]',
  conversionGoal: { type: 'email_submit' }
}

await fetch('/api/ab-testing/tests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(test)
})
```

### 2. Tracciare una visita
```javascript
await fetch('/api/ab-testing/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    testId: 'test-uuid',
    variantId: 'variant-uuid',
    visitorId: 'visitor-123',
    conversion: false
  })
})
```

### 3. Tracciare una conversione
```javascript
await fetch('/api/ab-testing/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    testId: 'test-uuid',
    variantId: 'variant-uuid',
    visitorId: 'visitor-123',
    conversion: true,
    conversionValue: 10.50
  })
})
```

## 📈 Dashboard

Il dashboard A/B testing è accessibile su `/admin/ab-testing` e include:

- **Overview** - Statistiche generali e test recenti
- **All Tests** - Lista completa dei test con dettagli
- **Create Test** - Creazione nuovi test con template

## 🧪 Test

Esegui i test automatizzati:
```bash
npx playwright test tests/ab-testing.spec.ts
```

## 🔒 Sicurezza

- Tutte le API richiedono autenticazione admin
- I dati sono salvati in modo sicuro nel database
- Le assegnazioni visitatori sono persistenti
- Statistiche calcolate in tempo reale

## 📝 Note

- Il sistema è completamente funzionale e pronto per l'uso
- I dati sono salvati in modo persistente nel database Supabase
- Le statistiche vengono aggiornate automaticamente
- Il sistema supporta test multipli simultanei
