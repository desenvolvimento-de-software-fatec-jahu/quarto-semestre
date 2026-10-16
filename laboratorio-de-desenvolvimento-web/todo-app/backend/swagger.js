import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "ToDo App API",
    description: "Auto-generated documentation for the ToDo App REST API",
    version: "1.0.0",
  },
  host: "localhost:5000",
  basePath: "/api",
  schemes: ["http"],
};

// Arquivo que será gerado automaticamente
const outputFile = "./swagger-output.json";

// Arquivos de rotas que serão lidos
const endpointsFiles = [
  "./src/routes/authRoutes.js",
  "./src/routes/userRoutes.js",
  "./src/routes/todoRoutes.js",
];

swaggerAutogen()(outputFile, endpointsFiles, doc);