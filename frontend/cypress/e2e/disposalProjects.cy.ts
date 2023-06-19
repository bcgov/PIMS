const PROJECT_NAME = 'Cypress Test Disposal Project';

const inputs = {
  projectName: PROJECT_NAME,
  description: 'A test description.',
  searchFilter: {
    address: '1006 2nd Ave',
  },
  assessedValue: '10350',
  assessedDisplayedValue: '$10,350',
  netBookValue: '23789',
  netBookDisplayedValue: '$23,789',
  estimatedMarketValue: '16465',
  estimatedMarketDisplayedValue: '$16,465',
};

// TODO: Add cy.log to sections to detail whats happening.

/**
 * @author Braden Mitchell <braden.mitchell@gov.bc.ca || braden.jr.mitch@gmail.com>
 * @description Tests the creation of disposal projects.
 * @components ProjectDraftForm, ProjectDisposeLayout
 * @page Disposal Projects > Create Disposal Project
 * @route /dispose/projects/draft
 * @tests Create project with DRAFT status.
 */

describe('Create a disposal project', () => {
  beforeEach(function () {
    cy.kcLogout().kcLogin();
  });

  /* ---------------------------------------------------------------------
           TEST CASE: Create project with SUBMITTED EXEMPTION status.
  * --------------------------------------------------------------------- */

  /**
   * @title Create project with SUBMITTED EXEMPTION status
   * @description Tests creating a disposal project, going through steps 1-6 and submitting it.
   */

  it('Create project with SUBMITTED EXEMPTION status', () => {
    /* ---------------------------------------------------------------------
                          CLEAN UP: Run before test.
      * --------------------------------------------------------------------- */

    cy.visit(`/projects/list`).then(() => {
      cy.url().should('include', '/projects/list');
      /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          If Test Project Exists in 
          Table Body (tbody), delete it. 
      * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

      const PROJECT_NAME = 'Cypress Test Disposal Project';

      // Wait for page title.
      cy.get('[data-testid="project-list-view-page-title"]').should('exist');

      // Wait for the spinner to disappear.
      cy.get('.table-loading').should('not.exist').wait(2000);

      // Search for project
      cy.get('[name="name"]').click({ force: true });
      cy.get('[name="name"]').type(PROJECT_NAME);
      cy.get('[id="search-button"]').click({ force: true });

      // Wait for the spinner to disappear.
      cy.get('.table-loading').should('not.exist').wait(2000);

      cy.get('.table').then(($table) => {
        const secondChild = $table.children().eq(1);
        if (secondChild.text() !== 'No rows to display') {
          cy.get('.tbody').then(($tbody) => {
            const firstTableRow = $tbody.children().eq(0).children().eq(0);
            const projectNameCell = firstTableRow.children().eq(2);
            // If table row for Cypress test project exists.
            if (projectNameCell.text() === PROJECT_NAME) {
              cy.get('[role="cell"]')
                .contains(PROJECT_NAME)
                .then(($projectNameField) => {
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
        }
      });
    });

    cy.visit(`/dispose/projects/draft`);

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [1/6] Draft 
     * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Stepper 0 btn (Step 1/6) should be selected.
    cy.get('[data-target="stepper-0"]')
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    // Stepper 1 btn (Step 2/6) should be disabled.
    cy.get('[data-target="stepper-1"]').children().first().should('be.disabled');
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
    cy.get('[data-target="stepper-1"]')
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    // Stepper 0 btn (Step 1/6) should be enabled.
    cy.get('[data-target="stepper-0"]').children().first().should('be.enabled');
    // Stepper 2 btn (Step 3/6) should be disabled.
    cy.get('[data-target="stepper-2"]').children().first().should('be.disabled');
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
    cy.get('[title="Toggle Row Selected"]')
      .first()
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[title="Toggle Row Selected"]').should('be.checked');
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
    cy.get('[data-target="stepper-2"]')
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

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
    cy.get('[data-target="stepper-1"]').children().first().should('be.enabled');
    // Stepper 3 btn (Step 4/6) should be disabled.
    cy.get('[data-target="stepper-3"]').children().first().should('be.disabled');
    // Input accessed value.
    cy.get('[data-testid="assessed"]').should('be.enabled').click({ force: true });
    cy.get('[data-testid="assessed"]').type(inputs.assessedValue);
    // Input netBook value.
    cy.get('[data-testid="netBook"]').should('be.enabled').click({ force: true });
    cy.get('[data-testid="netBook"]').type(inputs.netBookValue);
    // Input estimated market value.
    cy.get('[data-testid="market"]').should('be.enabled').click({ force: true });
    cy.get('[data-testid="market"]').type(inputs.estimatedMarketValue);
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [4/6] Required Documentation 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // TODO: Test Exemption request.

    // Stepper 3 btn (Step 4/6) should be selected.
    cy.get('[data-target="stepper-3"]')
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    // Check Required Fields > Next button.
    cy.get('[data-testid="next-submit-btn"]').click();
    // Required text should be visible.
    cy.contains('Required').should('be.visible');
    // Check Required Fields > Stepper 4 btn (Step 5/6) should be disabled.
    cy.get('[data-target="stepper-4"]').children().first().should('be.disabled');

    // Stepper 2 btn (Step 3/6) should be enabled.
    cy.get('[data-target="stepper-2"]').children().first().should('be.enabled');
    // Stepper 4 btn (Step 5/6) should be disabled.
    cy.get('[data-target="stepper-4"]').children().first().should('be.disabled');
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
    cy.get('[name="exemptionRationale"]').should('be.enabled').click({ force: true });
    cy.get('[name="exemptionRationale"]').type('testing');
    // Next button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            [5/6] Approval 
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // TODO: Test required fields.

    // Stepper 4 btn (Step 5/6) should be selected.
    cy.get('[data-target="stepper-4"]')
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    // // Check Required Fields > Next button.
    // cy.get('[data-testid="next-submit-btn"]').click();
    // // Required text should be visible.
    // cy.contains('You must confirm approval before continuing.').should('be.visible');
    // // Check Required Fields > Stepper 5 btn (Step 6/6) should be disabled.
    // cy.get('[data-target="stepper-5"]')
    //   .children()
    //   .first()
    //   .should('be.disabled');

    // Stepper 3 btn (Step 4/6) should be enabled.
    cy.get('[data-target="stepper-3"]').children().first().should('be.enabled');
    // Stepper 5 btn (Step 6/6) should be disabled.
    cy.get('[data-target="stepper-5"]').children().first().should('be.disabled');
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

    // TODO:
    // Test Edit button.
    // Return to projects list before submitting and verify DRAFT status.

    // Stepper 5 btn (Step 6/6) should be selected.
    cy.get('[data-target="stepper-5"]')
      .children()
      .first()
      .children('.bs-stepper-circle')
      .first()
      .should('have.css', 'background-color', 'rgb(0, 123, 255)');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    // Description Field
    cy.get('[data-testid="project-description"]').should('be.visible').should('be.disabled');

    // Submit button.
    cy.get('[data-testid="next-submit-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          Return to Projects List
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
    cy.visit(`/projects/list`).wait(2000);

    // Wait for page title.
    cy.get('[data-testid="project-list-view-page-title"]').should('exist');

    // Wait for the spinner to disappear.
    cy.get('.table-loading').should('not.exist');

    cy.contains(PROJECT_NAME)
      .should('be.visible')
      .siblings()
      .should('contain', 'Submitted Exemption');
  });

  /* ---------------------------------------------------------------------
        TEST CASE: Approve project to APPROVED FOR EXEMPTION status.
  * --------------------------------------------------------------------- */

  /**
   * @title Approve project to APPROVED FOR EXEMPTION status.
   * @description Tests approving a disposal project.
   * @components ProjectDraftForm, ReviewApproveForm
   */

  it('Approve project to APPROVED FOR EXEMPTION status', () => {
    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
               Select Project
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
    cy.visit(`/projects/list`);

    // TODO: Test...
    // Required fields
    // Edit, Save, Deny
    // Add and remove properties

    // Wait for page title.
    cy.get('[data-testid="project-list-view-page-title"]').should('exist');

    // Wait for the spinner to disappear.
    cy.get('.table-loading').should('not.exist');

    // Search for project
    cy.get('[name="name"]').click({ force: true });
    cy.get('[name="name"]').type(PROJECT_NAME);
    cy.get('[id="search-button"]').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.table-loading').should('not.exist').wait(2000);

    // Select Project from table.
    cy.contains(PROJECT_NAME).should('be.visible').click({ force: true });

    // Wait for page.
    cy.url().should('include', '/projects/assess/properties');

    // Wait for the spinner to disappear.
    cy.get('.loading-spinner').should('not.exist');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Review Project Property Information
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check project name.
    cy.get('[data-testid="project-name"').should('be.visible').should('have.value', PROJECT_NAME);

    // Check project description.
    cy.get('[data-testid="project-description"')
      .should('be.visible')
      .should('have.value', inputs.description);

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        Review Financial Information
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check assessed value.
    cy.get('[data-testid="assessed"')
      .should('be.visible')
      .should('have.value', inputs.assessedDisplayedValue);

    // Check netBook value.
    cy.get('[data-testid="netBook"')
      .should('be.visible')
      .should('have.value', inputs.netBookDisplayedValue);

    // Check estimated market value.
    cy.get('[data-testid="market"')
      .should('be.visible')
      .should('have.value', inputs.estimatedMarketDisplayedValue);

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Review Properties in the Project
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check properties.
    cy.contains(inputs.searchFilter.address);

    // CHECK input - Project property information has been reviewed.
    cy.get('[data-testid="taskform-check-3"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="taskform-check-3"]').should('be.checked');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Enhanced Referral Process Exemption
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check exemption rationale value.
    cy.get('[name="exemptionRationale"').first().should('have.text', 'testing');

    // CHECK input - ADM has been notified of request for exemption.
    cy.get('[data-testid="taskform-check-10"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="taskform-check-10"]').should('be.checked');

    // CHECK input - ADM has approved the request for exemption.
    cy.get('[data-testid="taskform-check-11"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="taskform-check-11"]').should('be.checked');

    // Type date - ADM Approved Exemption On.
    cy.get('[name="exemptionApprovedOn"]').should('be.enabled').click({ force: true });
    cy.get('[name="exemptionApprovedOn"]').type('03/08/2023');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            Review Documentation
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check input - Surplus Declaration & Readiness Checklist document emailed to SRES.
    cy.get('[data-testid="taskform-check-0"]').should('be.disabled').should('be.checked');

    // Check input - Triple Bottom Line document emailed to SRES OR Project is in Tier 1.
    cy.get('[data-testid="taskform-check-1"]').should('be.disabled').should('be.checked');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Enhanced Referral Process Exemption
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check input - Apply for Enhanced Referral Process exemption.
    cy.get('[name="exemptionRequested"]').should('be.disabled').should('be.checked');

    // CHECK input - Documents have been received, reviewed and approved.
    cy.get('[data-testid="taskform-check-4"]')
      .should('be.enabled')
      .should('not.be.checked')
      .click({ force: true });
    cy.get('[data-testid="taskform-check-4"]').should('be.checked');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
              Review Appraisal
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check input - An appraisal has been ordered.
    cy.get('[data-testid="taskform-check-5"]').should('be.enabled').should('not.be.checked');

    // Check input - An appraisal has been received.
    cy.get('[data-testid="taskform-check-6"]').should('be.enabled').should('not.be.checked');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Review First Nations Consultation
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check input - First Nations consultation preparation and due diligence.
    cy.get('[data-testid="taskform-check-7"]').should('be.enabled').should('not.be.checked');

    // Check input - First Nations consultation is underway.
    cy.get('[data-testid="taskform-check-8"]').should('be.enabled').should('not.be.checked');

    // Check input - First Nations consultation is complete.
    cy.get('[data-testid="taskform-check-9"]').should('be.enabled').should('not.be.checked');

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                  Approval
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    // Check input -
    // My Ministry/Agency has approval/authority to submit the Disposal Project to SRES for review.
    cy.get('[data-testid="approval-check"]').should('be.disabled').should('be.checked');

    // Check inputs - Notes.
    cy.get('[id="input-note"]').should('be.disabled');
    cy.get('[id="input-publicNote"]').should('be.enabled');
    cy.get('[id="input-privateNote"]').should('be.enabled');
    cy.get('[id="input-notes[22].note"]').should('be.enabled');

    // Approve button.
    cy.get('[data-testid="review-approve-action-approve-btn"]').click({ force: true });
    cy.get('[data-testid="modal-footer-ok-btn"]').click({ force: true });

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                  Approved
    * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
    cy.contains('Approved for Exemption').should('be.visible');

    cy.visit(`/projects/list`);

    // Wait for page title.
    cy.get('[data-testid="project-list-view-page-title"]').should('exist');

    // Wait for the spinner to disappear.
    cy.get('.table-loading').should('not.exist');

    // Search for project
    cy.get('[name="name"]').click({ force: true });
    cy.get('[name="name"]').type(PROJECT_NAME);
    cy.get('[id="search-button"]').click({ force: true });

    // Wait for the spinner to disappear.
    cy.get('.table-loading').should('not.exist').wait(2000);

    // Check project has correct status.
    cy.contains(PROJECT_NAME)
      .should('be.visible')
      .siblings()
      .should('contain', 'Approved for Exemption');
  });

  /* ---------------------------------------------------------------------
                                CLEAN UP
  * --------------------------------------------------------------------- */

  /**
   * @title Clean up
   * @description Removes the test project.
   */

  it('Clean up', () => {
    cy.visit(`/projects/list`).then(() => {
      cy.url().should('include', '/projects/list');
      /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          If Test Project Exists in
          Table Body (tbody), delete it.
      * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

      const PROJECT_NAME = 'Cypress Test Disposal Project';

      // Wait for page title.
      cy.get('[data-testid="project-list-view-page-title"]').should('exist');

      // Wait for the spinner to disappear.
      cy.get('.table-loading').should('not.exist').wait(2000);

      // Search for project
      cy.get('[name="name"]').click({ force: true });
      cy.get('[name="name"]').type(PROJECT_NAME);
      cy.get('[id="search-button"]').click({ force: true });

      // Wait for the spinner to disappear.
      cy.get('.table-loading').should('not.exist').wait(2000);

      cy.get('.table').then(($table) => {
        const secondChild = $table.children().eq(1);
        if (secondChild.text() !== 'No rows to display') {
          cy.get('.tbody').then(($tbody) => {
            const firstTableRow = $tbody.children().eq(0).children().eq(0);
            const projectNameCell = firstTableRow.children().eq(2);
            // If table row for Cypress test project exists.
            if (projectNameCell.text() === PROJECT_NAME) {
              cy.get('[role="cell"]')
                .contains(PROJECT_NAME)
                .then(($projectNameField) => {
                  // Get the project number from the sibling table row cell that contains PROJECT_NAME
                  const projectNumber = $projectNameField
                    .siblings()
                    .eq(1)
                    .children()
                    .children('span')
                    .text();
                  // Remove project
                  cy.get(`[data-testid="trash-icon-${projectNumber}"]`).click({ force: true });
                  cy.get('[data-testid="modal-footer-ok-btn"]').click({ force: true });
                });
            }
          });
        }
      });
    });
  });
});
