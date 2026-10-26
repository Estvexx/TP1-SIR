const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
});

const doc = {
  info: {
    title: "Backend",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000" }],
};

swaggerAutogen("./swagger-output.json", ["./src/app.js"], doc);
