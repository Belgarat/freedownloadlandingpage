# Book Landing Stack - Version History

## Versioning Strategy

- **v1.x.x**: Production stable versions (Fish Cannot Carry Guns landing page)
- **v2.x.x**: Development versions with new features (Admin panel, JSON config, etc.)

## Current Versions

### Production (main branch)
- **v1.0.0** (2025-01-15): Initial stable release
  - Fish Cannot Carry Guns landing page
  - Email collection with Resend
  - Supabase analytics
  - Admin dashboard
  - Comprehensive testing

### Development (develop branch)
- **v2.0.0-alpha.2** (2025-08-09): Theming, SEO, Admin UX and Analytics improvements
  - Theme: generate palette from cover (sharp), global CSS vars, full theming of landing
  - Theme tools: saturation/lightness adjustments, per-color locks, contrast checker, custom presets
  - Layout: types (default, minimal, full-width) + layout flags (countdown, stories, testimonials, awards, rankings)
  - Theme Background: optional gradient (direction) + Surface (auto/custom) for boxes
  - Fonts: curated selects with Google Fonts auto-load; live preview
  - SEO: server-side `generateMetadata()` from `seo.json`; Book Schema generator from Book config; helper texts in UI
  - Email editor: code view, URL placeholders, preview fixes, UI polish
  - Storage: Vercel Blob adapter and `CoverUploader`
  - Admin: unified topbar across sections; buttons for schema/theme generation made prominent
  - Analytics: admin page uses real stats endpoint; dev read-only fallback (no writes, no 500)
  - Misc: unified admin sections, small bug fixes and UX tweaks

- **v2.0.0-alpha.1** (in development): Admin panel and JSON configuration
  - JSON-based content management
  - WYSIWYG editor for book content
  - Dynamic CTA configuration
  - Theme system
  - Hot reload and preview

## Roadmap

### v2.0.0 (Q1 2025)
- [ ] JSON configuration system
- [ ] Admin panel for content editing
- [ ] WYSIWYG editor for book descriptions
- [ ] Dynamic CTA management
- [ ] Theme customization

### v2.1.0 (Q2 2025)
- [ ] Multiple layout templates
- [ ] Advanced analytics dashboard
- [ ] A/B testing for CTA
- [ ] Email template customization

### v2.2.0 (Q3 2025)
- [ ] Theme store/marketplace
- [ ] Community templates
- [ ] Advanced SEO tools
- [ ] Performance optimization

## Branch Strategy

- **main**: Production stable (v1.x.x)
- **develop**: Development features (v2.x.x)
- **feature/***: Individual features
- **hotfix/***: Emergency fixes for production

## Deployment

- **Production**: `https://belgarat.github.io/booklandingstack/` (main branch)
- **Development**: `https://belgarat.github.io/booklandingstack/develop/` (develop branch) 