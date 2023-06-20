/**
 * @author Braden Mitchell <braden.mitchell@gov.bc.ca || braden.jr.mitch@gmail.com>
 * @description Tests the routing of Nav Bar links.
 * @components AppNavBar
 * @tests Home, Administration, Submit Property, View Property Inventory, Disposal Projects, Reports.
 */

describe('Navigation/routing of NavBar links', () => {
  beforeEach(function () {
    cy.kcLogout().kcLogin();
  });

  /* ---------------------------------------------------------------------
              TEST CASE: Home button directs to home page.
  * --------------------------------------------------------------------- */

  /**
   * @title Home button directs to home page
   * @description Tests that clicking the home button redirects you to the mapview.
   */

  it('Home button directs to home page', () => {
    cy.visit('/');

    // Go to another page.
    cy.get('[data-testid="navbar-view-inventory"]').should('be.visible').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/properties/list');
    // Click home button.
    cy.get('[data-testid="navbar-home-btn"]').first().should('be.visible').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/mapview');
  });

  /* ---------------------------------------------------------------------
          TEST CASE: Administration dropdown links to correct routes.
  * --------------------------------------------------------------------- */

  /**
   * @title Administration dropdown links to correct routes
   * @description Tests the routing of links in the Administration dropdown from the NavBar.
   * Clicks nav link, checks url, checks page loaded.
   */

  it('Administration dropdown links to correct routes', () => {
    cy.visit('/');

    // Open Administration dropdown.
    cy.get('[data-testid="navbar-admin-dropdown"]').should('be.visible').click();

    // Go to Administration > Users page.
    cy.get('[data-testid="navbar-admin-users"]').should('be.visible').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/admin/users');
    cy.get('[data-testid="admin-users-page"]').should('exist');

    // Open Administration dropdown.
    cy.get('[data-testid="navbar-admin-dropdown"]').should('be.visible').click();

    // Go to Administration > Access Requests page.
    cy.get('[data-testid="navbar-admin-access-requests"]')
      .should('be.visible')
      .click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/admin/access/requests');
    cy.get('[data-testid="admin-access-requests-page"]').should('exist');

    // Open Administration dropdown.
    cy.get('[data-testid="navbar-admin-dropdown"]').should('be.visible').click();

    // Go to Administration > Agencies page.
    cy.get('[data-testid="navbar-admin-agencies"]').should('be.visible').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/admin/agencies');
    cy.get('[data-testid="admin-agencies-page"]').should('exist');

    // Open Administration dropdown.
    cy.get('[data-testid="navbar-admin-dropdown"]').should('be.visible').click();

    // Go to Administration > Administrative Areas page.
    cy.get('[data-testid="navbar-admin-administrative-areas"]')
      .should('be.visible')
      .click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/admin/administrativeAreas');
    cy.get('[data-testid="admin-administrative-areas-page"]').should('exist');
  });

  /* ---------------------------------------------------------------------
          TEST CASE: Submit Property links to correct route.
  * --------------------------------------------------------------------- */

  /**
   * @title Submit Property links to correct route
   * @description Tests the routing of Submit Property from the NavBar.
   * Clicks nav link, checks url, checks page loaded.
   */

  it('Submit Property links to correct route', () => {
    // Go to Submit Property page.
    cy.get('[data-testid="navbar-submit-property"]').should('be.visible').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/mapview');
    cy.get('[data-testid="submit-property-selector"]').should('exist');
  });

  /* ---------------------------------------------------------------------
          TEST CASE: View Property Inventory links to correct route.
  * --------------------------------------------------------------------- */

  /**
   * @title View Property Inventory links to correct route
   * @description Tests the routing of View Property Inventory from the NavBar.
   * Clicks nav link, checks url, checks page loaded.
   */

  it('View Property Inventory links to correct route', () => {
    cy.visit('/');

    // Go to View Property Inventory page.
    cy.get('[data-testid="navbar-view-inventory"]').should('be.visible').click();

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/properties/list');
    cy.get('[data-testid="property-list-view"]').should('exist');
  });

  /* ---------------------------------------------------------------------
          TEST CASE: Disposal Projects dropdown links to correct routes.
  * --------------------------------------------------------------------- */

  /**
   * @title Disposal Projects dropdown links to correct routes
   * @description Tests the routing of links in the Disposal Projects dropdown from the NavBar.
   * Clicks nav link, checks url, checks page loaded.
   */

  it('Disposal Projects dropdown links to correct routes', () => {
    cy.visit('/');

    // Open Disposal Projects dropdown.
    cy.get('[data-testid="navbar-disposal-projects-dropdown"]').should('be.visible').click();

    // Go to Disposal Projects > Create Disposal Project page.
    cy.get('[data-testid="navbar-disposal-projects-create"]')
      .should('be.visible')
      .click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/dispose/projects/draft');
    cy.get('[data-testid="disposal-projects-draft-form"]').should('exist');

    // Open Disposal Projects dropdown.
    cy.get('[data-testid="navbar-disposal-projects-dropdown"]').should('be.visible').click();

    // Go to Disposal Projects > View Projects page.
    cy.get('[data-testid="navbar-disposal-projects-view"]')
      .should('be.visible')
      .click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/projects/list');
    cy.get('[data-testid="disposal-projects-project-list-view"]').should('exist');

    // Open Disposal Projects dropdown.
    cy.get('[data-testid="navbar-disposal-projects-dropdown"]').should('be.visible').click();

    // Go to Disposal Projects > View SPL Projects page.
    cy.get('[data-testid="navbar-disposal-projects-view-spl"]')
      .should('be.visible')
      .click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/projects/spl');
    cy.get('[data-testid="disposal-projects-spl-project-list-view"]').should('exist');

    // Open Disposal Projects dropdown.
    cy.get('[data-testid="navbar-disposal-projects-dropdown"]').should('be.visible').click();

    // Go to Disposal Projects > Approval Requests page.
    cy.get('[data-testid="navbar-disposal-projects-approval-requests"]')
      .should('be.visible')
      .click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/approval/requests');
    cy.get('[data-testid="disposal-projects-project-approval-request-list-view"]').should('exist');
  });

  /* ---------------------------------------------------------------------
          TEST CASE: Reports dropdown links to correct routes.
  * --------------------------------------------------------------------- */

  /**
   * @title Reports dropdown links to correct routes
   * @description Tests the routing of links in the Reports dropdown from the NavBar.
   * Clicks nav link, checks url, checks page loaded.
   */

  it('Reports dropdown links to correct routes', () => {
    cy.visit('/');

    // Open Reports dropdown.
    cy.get('[data-testid="navbar-reports-dropdown"]').should('be.visible').click();

    // Go to SPL Reports page.
    cy.get('[data-testid="navbar-spl-reports"]').should('be.visible').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    cy.url().should('include', '/reports/spl');
    cy.get('[data-testid="spl-report-layout"]').should('exist');
  });

  // TODO: Test Help Modal.
});
