# Screenshots dell'Applicazione

Questa cartella contiene le immagini dell'applicazione Book Landing Stack.

## Come Aggiungere Screenshot

1. **Screenshot Admin Panel**: 
   - Email Templates Management
   - A/B Testing Dashboard
   - Analytics Dashboard
   - Configuration Panel

2. **Screenshot Landing Page**:
   - Homepage con form di download
   - Pagina di download
   - Pagina di ringraziamento

3. **Screenshot Mobile**:
   - Versione responsive
   - Form mobile

4. **Formato Immagini**:
   - PNG o WebP per screenshot
   - Dimensioni consigliate: 1200x800px
   - Ottimizzare per web (compressione)

## Immagini Attuali

- `admin-email-templates.png` - Gestione template email
- `admin-dashboard.png` - Dashboard principale
- `landing-page.png` - Homepage
- `mobile-view.png` - Vista mobile

## Comandi Utili

```bash
# Screenshot con Chrome headless
google-chrome --headless --screenshot=docs/images/admin-email-templates.png --window-size=1200,800 http://localhost:3010/admin/email-templates

# Screenshot mobile
google-chrome --headless --screenshot=docs/images/mobile-view.png --window-size=375,667 http://localhost:3010
```
