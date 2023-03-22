/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    kcLogin(user: string): Chainable<Element>;
    kcLogout(): Chainable<any>;
  }
}
