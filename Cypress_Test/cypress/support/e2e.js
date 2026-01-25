// Runs before each test file
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // prevent Cypress from failing tests on app errors
    return false;
});
Cypress.on('window:before:load', (win) => {
  // Mocking window.matchMedia for tests that rely on it
    win.matchMedia = win.matchMedia || function () {
        return {
            matches: false,
            addListener: function () {},
            removeListener: function () {}
        };
    };
});