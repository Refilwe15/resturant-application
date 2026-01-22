import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant API",
      version: "1.0.0",
      description: "API for React Native Restaurant App",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.ts"], // change to .ts if your routes are TypeScript
};

export const swaggerSpec = swaggerJsdoc(options);
