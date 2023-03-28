/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    kcLogin(): Chainable<Element>;
    kcLogout(): Chainable<any>;
  }
}
