const PROJECT_NAME = 'Cypress Test Disposal Project';

/**
 * @author Braden Mitchell <braden.mitchell@gov.bc.ca || braden.jr.mitch@gmail.com>
 * @description Tests the creation of disposal projects.
 * @components ProjectDraftForm, ProjectDisposeLayout
 * @page Disposal Projects > Create Disposal Project
 * @route /dispose/projects/draft
 * @tests Create project with DRAFT status.
 */

describe('Create a disposal project', () => {
  beforeEach(function() {
    cy.kcLogout();
    cy.kcLogin(Cypress.env('keycloak_user'));

    /* ---------------------------------------------------------------------
                          CLEAN UP: Run before tests.
      * --------------------------------------------------------------------- */

    cy.visit(`/projects/list`).then(() => {
      cy.url().should('include', '/projects/list');
      /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          If Test Project Exists in 
          Table Body (tbody), delete it. 
      * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

      const PROJECT_NAME = 'Cypress Test Disposal Project';

      // Wait for page title.
      cy.get('[data-testid="project-list-view-page-title"]', { timeout: 10000 }).should('exist');

      // Wait for the spinner to disappear.
      cy.get('.table-loading', { timeout: 10000 })
        .should('not.exist')
        .wait(2000);

      // Search for project
      cy.get('[name="name"]').click({ force: true });
      cy.get('[name="name"]').type(PROJECT_NAME);
      cy.get('[id="search-button"]').click({ force: true });

      // Wait for the spinner to disappear.
      cy.get('.table-loading', { timeout: 10000 })
        .should('not.exist')
        .wait(2000);

      cy.get('.tbody', { timeout: 10000 }).then($tbody => {
        const firstTableRow = $tbody
          .children()
          .eq(0)
          .children()
          .eq(0);
        const projectNameCell = firstTableRow.children().eq(2);
        // If table row for Cypress test project exists.
        if (projectNameCell.text() === PROJECT_NAME) {
          cy.get('[role="cell"]')
            .contains(PROJECT_NAME)
            .then($projectNameField => {
              // Get the project number from the sibling table row cell that contains PROJECT_NAME
              const projectNumber = $projectNameField
                .siblings()
                .eq(1)
                .children()
                .children('span')
                .text();
              // Remove project
              cy.get(`[data-testid="trash-icon-${projectNumber}"]`).click();
              cy.get('[data-testid="modal-footer-ok-btn"]').click();
            });
        }
      });
    });
  });

  /* ---------------------------------------------------------------------
                TEST CASE: Create project with DRAFT status.
  * --------------------------------------------------------------------- */

  /**
   * @title Create project with DRAFT status
   * @description Tests creating a disposal project as a draft, going through steps 1-6 but not submitting it.
   */

  it('Create project with DRAFT status', () => {
    cy.visit(`/dispose/projects/draft`);

    const inputs = {
      projectName: PROJECT_NAME,
      description: 'A test description.',
      searchFilter: {
        address: '750 6th Ave.',
      },
      assessedValue: '10350',
      netBookValue: '23789',
      estimatedMarketValue: '16465',
    };

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [1/6] Draft 
     * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Stepper 0 btn (Step 1/6) should be selected.
    cy.get('[data-target="stepper-0"]', { timeout: 10000 })
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');

    // Stepper 1 btn (Step 2/6) should be disabled.
    cy.get('[data-target="stepper-1"]')
      .children()
      .first()
      .should('be.disabled');
    // Input project name.
    cy.get('[data-testid="project-name"]')
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[data-testid="project-name"]').type(inputs.projectName);
    // Input project description.
    cy.get('[data-testid="project-description"]')
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[data-testid="project-description"]').type(inputs.description);
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [2/6] Select Properties 
     * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // TODO: Test search filter, and Remove Selected button.

    // Stepper 1 btn (Step 2/6) should be selected.
    cy.get('[data-target="stepper-1"]', { timeout: 10000 })
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');

    // Stepper 0 btn (Step 1/6) should be enabled.
    cy.get('[data-target="stepper-0"]')
      .children()
      .first()
      .should('be.enabled');
    // Stepper 2 btn (Step 3/6) should be disabled.
    cy.get('[data-target="stepper-2"]')
      .children()
      .first()
      .should('be.disabled');
    // FILTER BAR: Input address.
    cy.get('[data-testid="address"]')
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[data-testid="address"]').type(inputs.searchFilter.address);
    // Search.
    cy.get('[data-testid="search-btn"]').click();
    // Confirm search.
    cy.get('.td').contains(inputs.searchFilter.address);
    // Select property.
    cy.get('[data-testid="selectrow-3959"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="selectrow-3959"]').should('be.checked');
    cy.contains('1 Selected');
    // Add to project.
    cy.get('[data-testid="add-to-project-btn"]').click();
    // Reset filter.
    cy.get('[data-testid="reset-btn"]').click();
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [3/6] Update Information 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // TODO: Test...
    // - Assign Tier dropdown.
    // - Required fields.
    // - Editable Fields in Properties in the Project.
    // - Add More Properties button.
    // - Remove Properties button.

    // Stepper 2 btn (Step 3/6) should be selected.
    cy.get('[data-target="stepper-2"]', { timeout: 10000 })
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');

    // // Check Required Fields > Next button.
    // cy.get('[data-testid="next-submit-btn"]').click();
    // // Required text should be visible.
    // cy.get('[data-testid="error-message"]').should('not.have.property', 'display', 'none');
    // // Check Required Fields > Stepper 3 btn (Step 4/6) should be disabled.
    // cy.get('[data-target="stepper-3"]')
    //   .children()
    //   .first()
    //   .should('be.disabled');

    // Stepper 1 btn (Step 2/6) should be enabled.
    cy.get('[data-target="stepper-1"]')
      .children()
      .first()
      .should('be.enabled');
    // Stepper 3 btn (Step 4/6) should be disabled.
    cy.get('[data-target="stepper-3"]')
      .children()
      .first()
      .should('be.disabled');
    // Input accessed value.
    cy.get('[data-testid="assessed"]')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[data-testid="assessed"]').type(inputs.assessedValue);
    // Input netBook value.
    cy.get('[data-testid="netBook"]')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[data-testid="netBook"]').type(inputs.netBookValue);
    // Input estimated market value.
    cy.get('[data-testid="market"]')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[data-testid="market"]').type(inputs.estimatedMarketValue);
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [4/6] Required Documentation 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // TODO: Test Exemption request.

    // Stepper 3 btn (Step 4/6) should be selected.
    cy.get('[data-target="stepper-3"]', { timeout: 10000 })
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');

    // Check Required Fields > Next button.
    cy.get('[data-testid="next-submit-btn"]').click();
    // Required text should be visible.
    cy.contains('Required').should('be.visible');
    // Check Required Fields > Stepper 4 btn (Step 5/6) should be disabled.
    cy.get('[data-target="stepper-4"]')
      .children()
      .first()
      .should('be.disabled');

    // Stepper 2 btn (Step 3/6) should be enabled.
    cy.get('[data-target="stepper-2"]')
      .children()
      .first()
      .should('be.enabled');
    // Stepper 4 btn (Step 5/6) should be disabled.
    cy.get('[data-target="stepper-4"]')
      .children()
      .first()
      .should('be.disabled');
    // CHECK inputs.
    cy.get('[data-testid="taskform-check-0"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="taskform-check-0"]').should('be.checked');
    cy.get('[data-testid="taskform-check-1"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="taskform-check-1"]').should('be.checked');
    cy.get('[id="input-exemptionRequested"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[id="input-exemptionRequested"]').should('be.checked');
    // Type exemption rationale.
    cy.get('[name="exemptionRationale"]')
      .should('be.enabled')
      .click({ force: true });
    cy.get('[name="exemptionRationale"]').type('testing');
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [5/6] Approval 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Stepper 4 btn (Step 5/6) should be selected.
    cy.get('[data-target="stepper-4"]', { timeout: 10000 })
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');

    // Check Required Fields > Next button.
    cy.get('[data-testid="next-submit-btn"]').click();
    // Required text should be visible.
    cy.contains('You must confirm approval before continuing.').should('be.visible');
    // Check Required Fields > Stepper 5 btn (Step 6/6) should be disabled.
    cy.get('[data-target="stepper-5"]')
      .children()
      .first()
      .should('be.disabled');

    // Stepper 3 btn (Step 4/6) should be enabled.
    cy.get('[data-target="stepper-3"]')
      .children()
      .first()
      .should('be.enabled');
    // Stepper 5 btn (Step 6/6) should be disabled.
    cy.get('[data-target="stepper-5"]')
      .children()
      .first()
      .should('be.disabled');
    // CHECK input.
    cy.get('[data-testid="approval-check"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="approval-check"]').should('be.checked');
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });
    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [6/6] Review
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // TODO: Test Edit button.

    // Stepper 5 btn (Step 6/6) should be selected.
    cy.get('[data-target="stepper-5"]', { timeout: 10000 })
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');

    // Description Field
    cy.get('[data-testid="project-description"]')
      .should('be.visible')
      .should('be.disabled');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          Return to Projects List
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
    cy.visit(`/projects/list`);

    // Wait for page title.
    cy.get('[data-testid="project-list-view-page-title"]', { timeout: 10000 }).should('exist');

    // Wait for the spinner to disappear.
    cy.get('.table-loading', { timeout: 10000 }).should('not.exist');

    // Verify project is there.
    cy.contains(PROJECT_NAME).should('be.visible');
  });
});
