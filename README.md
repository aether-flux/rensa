# Rensa

A developer-first backend framework with modern ergonomics that feel like magic.

[![version](https://img.shields.io/github/v/release/aether-flux/rensa?style=for-the-badge)](https://github.com/aether-flux/rensa/releases/latest)

## Features

- DX-First Philosophy
- File-based Routing (`Compose Mode`)
- Structured Layers (middlewares)
- Rensa CLI (`rensa dev`, `rensa routes`, and much more)
- Flexible configuration via `rensa.config.js`
- Custom 404 Handler Support
- Fast and Reliable Enough
- Full TypeScript Support
- Rust-powered Internals (Gradually adapting more)

## Installation

### Manual

Install the official Rensa package using the following command:
```sh
npm install rensa
```

#### Quick Start Guide
Get started with your first Rensa project in an instant:
```sh
npx create-rensa-app@latest
```

Select your desired template when prompted:
- `Manual`: Spins up a Rensa project in `manual` mode
- `Compose`: Creates a new Rensa project in `compose` mode

Know more about the templates in [this repository](https://github.com/aether-flux/rensa-templates).
Learn more about getting started in the [docs](https://rensa.vercel.app/docs/quick-start-guide).

### Rensa CLI
Rensa comes with a feature-packed CLI that can help you build with Rensa.

Some of the commands are:
##### dev
You can start your server with hot reload on file changes with just one command. Use this command as follows:
```sh
npx rensa dev
```

##### route [in Compose mode only]
You can create a new route with a single command. Specify the route path and method as follows, and Rensa CLI will create a new route for you:
```sh
npx rensa route [method] [path]
```

There are many more commands in the Rensa CLI. To know more about the Rensa CLI, visit the docs for [available commands](https://rensa.vercel.app/docs/available-commands).

## Documentation
A complete documentation is available on the official [Rensa](https://rensa.vercel.app/) website.

## Latest Release
🎉 Rensa **v3.0.0** is out now!
[Check out the latest release notes here!](https://github.com/aether-flux/rensa/releases/latest)

## Support
Love using Rensa? If you'd like to support its development and help keep it going, consider [buying me a coffee](https://buymeacoffee.com/aetherflux)!

## License
MIT
