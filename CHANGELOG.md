# Changelog

All notable changes to this project will be documented in this file.

## 🎉 Major Release
## [3.0.0] - 2025-07-04

### Added
- **Rust-powered internals** for route storage.
- A config file **rensa.config.js** for managing your Rensa server.
- Support for **two working modes**:
    - **Manual mode**: write routes and logic manually (like Express)
    - **Compose mode**: a file-based routing system (like Next.js) with support for structured Layers, Builtins, views and static files via config file
- Brand new **Rensa CLI**:
    - Dev server with hot reloading
    - Helpful commands (eg, `npx rensa route`, `npx rensa init`, etc)
- Optonal file-based Layers support in **Compose** mode.

### Changed
- Changed the syntax of method handlers, i.e., `app.get()`, `app.post()`, etc., have a new function signature.
- Project templates updated in `create-rensa-app`: now includes **Manual** and **Compose** starter templates.
- Added structured subpath imports:
- `rensa/utils` for utility functions
- `rensa/compose` for compose-mode helpers
- `rensa/types` for shared types
- New types available: `RensaConfig`, `ComposeRoute` and `ComposeLayer`.
- `env()` is moved to `rensa/utils`.

### Removed
- Nothing previous has been removed in this version.
- Fully backwards-compatible, except **method handlers like** `app.get()`, `app.post()`, etc.

## [2.1.0] - 2025-05-09

### Added
- Use multiple Layers at once - app.use(layer1, layer2, ...);
- Scope Layers to make them execute on specific routes - app.use(layer1, layer2, ..., { scope: ["/dashboard", "/profile"] });
- Introducing Presets: Group Layers together under a name. Create with app.createPreset("preset-name", ...layers) and use with app.usePreset("preset-name", config?).
- Visit the docs for detailed information about usage.

### Changed
- Nothing previous has been changed in this version.

### Removed
- Nothing previous has been removed in this version

## [2.0.0] - 2025-05-04

### Added
- Full TypeScript rewrite.
- Exported `Request`, `Response`, `Layer`, and `Handler` types.
- Added new type-safe Layer definitions with function signatures (e.g., `rateLimit(windowMs, maxRequests)`).
- Updated documentation for `Request`, `Response`, `Layer` and `Handler` types.

### Changed
- Middleware and handler internals now use stricter type checking.
- CLI for creating a project from template has been moved to a separate package (`create-rensa-app`).

### Removed
- Legacy JS-based internals have been removed completely.

###### Previous versions were untracked.

