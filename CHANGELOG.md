# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-05-09

### ✨ Added
- Use multiple Layers at once - app.use(layer1, layer2, ...);
- Scope Layers to make them execute on specific routes - app.use(layer1, layer2, ..., { scope: ["/dashboard", "/profile"] });
- Introducing Presets: Group Layers together under a name. Create with app.createPreset("preset-name", ...layers) and use with app.usePreset("preset-name", config?).
- Visit the docs for detailed information about usage.

### ⚠️ Changed
- Nothing previous has been changed in this version.

### ❗ Removed
- Nothing previous has been removed in this version

## [2.0.0] - 2025-05-04

### ✨ Added
- Full TypeScript rewrite.
- Exported `Request`, `Response`, `Layer`, and `Handler` types.
- Added new type-safe Layer definitions with function signatures (e.g., `rateLimit(windowMs, maxRequests)`).
- Updated documentation for `Request`, `Response`, `Layer` and `Handler` types.

### ⚠️ Changed
- Middleware and handler internals now use stricter type checking.
- CLI for creating a project from template has been moved to a separate package (`create-rensa-app`).

### ❗️Removed
- Legacy JS-based internals have been removed completely.

###### Previous versions were untracked.

