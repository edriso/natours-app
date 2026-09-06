# natours-app
## Map configuration

Set the `mapbox-public-token` meta tag in `public/tour.html` to a URL-restricted public (`pk.`) token. Never put a secret (`sk.`) token in browser code. Without a public token, the tour details remain available and the map shows a configuration message.

A previously committed Mapbox token has been removed from the current page. Revoke or rotate the exposed token in Mapbox; it remains in Git history.
