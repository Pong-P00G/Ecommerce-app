import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "fz2o1x",

  e2e: {
    baseUrl: "http://localhost:5003", // or your Vite dev server port (usually 3001)
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    video: true,
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
