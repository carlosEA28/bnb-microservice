import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// Load OpenAPI spec from YAML file
const openApiPath = join(__dirname, "openapi.yaml");
const openApiSpec = load(readFileSync(openApiPath, "utf8"));

// Serve the OpenAPI spec as JSON
app.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

// Serve the OpenAPI spec as YAML
app.get("/openapi.yaml", (req, res) => {
  res.setHeader("Content-Type", "text/yaml");
  res.sendFile(openApiPath);
});

// Serve Scalar API Reference
app.use(
  "/",
  apiReference({
    theme: "purple",
    spec: {
      content: openApiSpec,
    },
    metaData: {
      title: "Simple Airbnb API Documentation",
      description:
        "Complete API documentation for the Simple Airbnb microservices system",
    },
  }),
);

app.listen(PORT, () => {
  console.log(`📚 Documentation server running at http://localhost:${PORT}`);
  console.log(`📄 OpenAPI spec available at:`);
  console.log(`   - JSON: http://localhost:${PORT}/openapi.json`);
  console.log(`   - YAML: http://localhost:${PORT}/openapi.yaml`);
});
