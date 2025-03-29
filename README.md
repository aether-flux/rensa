# Rensa

A minimal, high-performance backend framework built for speed and scalability.

## Features

- Fast and lightweight
- Simple yet powerful routing
- Layer (middleware) support

## Installation

### Manual

```sh
npm install rensa
```

#### Quick Start
Create a basic server with Rensa :
```js
import Rensa from "rensa";

const app = new Rensa();

app.get("/", (req, res) => {
  res.send("Hello, Rensa!");
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});
```

### Available Boilerplates
You may also choose one of the available templates using the following command :
```sh
npx rensa
```

*Available templates :*
- Basic
- Standard

Know more about the templates in [this repository](https://github.com/aether-flux/rensa-templates).

## Documentation
A complete documentation is available on the official [Rensa](https://rensa.vercel.app/) website.

## License
MIT
