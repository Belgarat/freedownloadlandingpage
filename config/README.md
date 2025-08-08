# Book Landing Stack - Configuration Files

This directory contains all the JSON configuration files for the Book Landing Stack framework.

## File Structure

### `book.json`
Contains all book-specific information:
- Title, author, subtitle
- Cover image, rating, reviews
- Publication details (ISBN, date, format)
- Stories array with titles and descriptions
- Awards and rankings

### `marketing.json`
Contains all marketing and CTA configurations:
- Primary CTA (download button)
- Social media links
- Modal messages (success/error)
- Offer settings (end date, limited time)
- Social proof settings

### `content.json`
Contains WYSIWYG content areas:
- About the book (HTML content)
- Author bio (HTML content)
- Stories with extended content
- Testimonials
- Footer content

### `theme.json`
Contains visual and layout settings:
- Color scheme (primary, secondary, accent)
- Font settings
- Layout type and visibility toggles
- Spacing and animation settings
- Development flags (analytics disabled)

### `seo.json`
Contains SEO and meta information:
- Meta tags (title, description, keywords)
- Open Graph settings
- Twitter Card settings
- Structured data (JSON-LD)
- Sitemap settings

### `email.json`
Contains email configuration:
- Sender information
- Email templates (HTML and text)
- Template settings (expiry, retries)
- Tracking settings

## Development Mode

In development mode (`theme.json` → `development.analytics: false`):
- Analytics tracking is disabled
- Anonymous statistics are not collected
- Debug mode is enabled
- Hot reload is active

## Usage

These files are loaded by the framework and can be edited through:
1. **Direct file editing**: Modify JSON files directly
2. **Admin panel**: Web interface for editing (coming in v2.0.0)
3. **API endpoints**: REST API for programmatic access

## Validation

All JSON files follow specific schemas that are validated at runtime. Invalid configurations will show errors in the development console.

## Hot Reload

Changes to these files trigger automatic reload of the application in development mode, allowing real-time preview of modifications. 