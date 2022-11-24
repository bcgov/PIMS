const PROJECT_NAME = 'Cypress Test Disposal Project';

describe('Create a disposal project', () => {
  beforeEach(function() {
    cy.kcLogout();
    cy.kcLogin('admin');
    // CLEAN UP
    cy.visit(`/projects/list`);
    cy.get('.tbody').then($tbody => {
      const firstTableRow = $tbody
        .children()
        .eq(0)
        .children()
        .eq(0);
      const projectNameCell = firstTableRow.children().eq(2);
      const projectStatusCell = firstTableRow.children().eq(3);
      // If table row for Cypress test project exists in DRAFT status
      if (projectNameCell.text() === PROJECT_NAME && projectStatusCell.text() === 'Review') {
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

    // Stepper 1 btn (Step 2/6) should be disabled.
    cy.get('[data-target="stepper-1"]')
      .children()
      .first()
      .should('be.disabled');
    // Input project name.
    cy.get('[data-testid="project-name"]')
      .should('be.visible')
      .should('be.enabled')
      .type(inputs.projectName);
    // Input project description.
    cy.get('[data-testid="project-description"]')
      .should('be.visible')
      .should('be.enabled')
      .type(inputs.description);
    cy.get('[data-testid="next-submit-btn"]').click();

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [2/6] Select Properties 
     * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

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
      .type(inputs.searchFilter.address);
    // Search.
    cy.get('[data-testid="search-btn"]').click();
    // Confirm search.
    cy.get('.td').contains(inputs.searchFilter.address);
    // Select property.
    cy.get('[data-testid="selectrow-3959"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click()
      .should('be.checked');
    cy.contains('1 Selected');
    // Add to project.
    cy.get('[data-testid="add-to-project-btn"]').click();
    // Reset filter.
    cy.get('[data-testid="reset-btn"]').click();
    cy.get('[data-testid="next-submit-btn"]').click();

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [3/6] Update Information 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

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
      .type(inputs.assessedValue);
    // Input netBook value.
    cy.get('[data-testid="netBook"]')
      .should('be.enabled')
      .type(inputs.netBookValue);
    // Input estimated market value.
    cy.get('[data-testid="market"]')
      .should('be.enabled')
      .type(inputs.estimatedMarketValue);
    cy.get('[data-testid="next-submit-btn"]').click();

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [4/6] Required Documentation 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

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
      .click()
      .should('be.checked');
    cy.get('[data-testid="taskform-check-1"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click()
      .should('be.checked');
    cy.get('[data-testid="next-submit-btn"]').click();

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [5/6] Approval 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

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
      .click()
      .should('be.checked');
    cy.get('[data-testid="next-submit-btn"]').click();
    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [6/6] Review
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Description Field
    cy.get('[data-testid="project-description"]')
      .should('be.visible')
      .should('be.disabled');
    // Return to project list.
    cy.visit(`/projects/list`);
  });
});
