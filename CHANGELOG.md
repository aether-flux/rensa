# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-05-04

### ✨ Added
- Full TypeScript rewrite.
- Exported `Request`, `Response`, `Layer`, and `Handler` types.
- Added new type-safe Layer definitions with function signatures (e.g., `rateLimit(windowMs, maxRequests)`).
- Updated documentation for `Request`, `Response`, `Layer` and `Handler` types.

### ⚠️ Changed
- Middleware and handler internals now use stricter type checking.

### ❗️Removed
- Legacy JS-based internals have been removed completely.

###### Previous versions were untracked.

