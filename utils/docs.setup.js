import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Wedding planning apis",
    version: "1.0.0",
    description: "Main documentations on the maarketplaace social commerce apis",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Wedding planner",
      url: "https://guest-imageupload.vercel.app/",
    },
  },
  servers: [
    {
      url: 'http://localhost:1800',
      description: 'Development server',
    },
    {
        url: "https://weddingscanner.onrender.com",
        description: 'Main Production server',
    }
  ],
};

const options = {
    swaggerDefinition,
    apis: ['../routers/*.js'],
  }

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
