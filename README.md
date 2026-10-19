# CHAI Services — interest page prototype

Lightweight landing page exploring "Education as a Service" and "Insights" offerings for CHAI, modeled on Rock Health Advisory's *What We Offer* page and styled to match chai.org (Montserrat, CHAI brand palette).

- `index.html` — Services + Insights landing page (single top-nav tab with dropdown: Education / Insights / Partner Ecosystem). Three-door overview, Education + Insights panes, Partner Ecosystem summary.
- `partners.html` — Partner Ecosystem directory (22 partners, 4 categories, filter bar). Rendered from `partners-data.js`; logos in `partners/`.
- `request.html` — interest form (Name, Job Title, Company, Email, Service Area, Message). `?service=education|insights|partner-find|partner-join` tailors the headline; a specific option value (`ai-governance`, `risk`, `evaluation`, `intake`, `custom`, `leaders`, `insights`) preselects the service area. Personal email domains are rejected client-side.
- `styles.css` — brand tokens and layout. `app.js` — nav toggle and form behavior.

No backend. Submissions are stored in the reviewer's own browser (`localStorage`) and the thank-you screen offers a prefilled email to admin@chai.org. Wire the form to HubSpot/Contentful or a form service before any public launch.

Deploy: static site on GitHub Pages from the `main` branch root.
