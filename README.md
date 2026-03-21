# dumpster-rental
A website where customers can rent dumpsters

## MVC Structure

- `src/routes`: Route registration only (maps URL paths to controllers)
- `src/controllers`: Request handling + validation + view rendering
- `src/models`: Firestore data access functions
- `src/views`: EJS templates and partials
- `public`: Static assets (CSS, client-side JavaScript, images)

## Notes

- Keep page-specific browser code out of shared partials. 
- Keep Firestore snapshots inside models; controllers should receive plain objects/arrays.
