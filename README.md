# CHAI Services — interest page prototype

Lightweight landing page exploring "Education as a Service" and "Insights" offerings for CHAI, modeled on Rock Health Advisory's *What We Offer* page and styled to match chai.org (Montserrat, CHAI brand palette).

- `index.html` — Services page (new top-nav tab). Left: Education as a Service. Right: Insights.
- `request.html` — interest form (Name, Company, Email, Service Area, Message). `?service=education|insights|intake|governance|evaluation` preselects the service area and tailors the headline.
- `styles.css` — brand tokens and layout. `app.js` — nav toggle and form behavior.

No backend. Submissions are stored in the reviewer's own browser (`localStorage`) and the thank-you screen offers a prefilled email to admin@chai.org. Wire the form to HubSpot/Contentful or a form service before any public launch.

Deploy: static site on GitHub Pages from the `main` branch root.
