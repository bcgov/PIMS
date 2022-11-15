import 'cypress-keycloak-commands';

describe('Create a disposal project', () => {
  beforeEach(function() {
    cy.kcLogin('admin');
    //TODO: reset state by removing created test disposal projects
  });

  it('VALID project creation', () => {
    cy.visit('/dispose/projects/draft');

    /* [1/6] Draft */
    /* [2/6] Select Properties */
    /* [3/6] Update Information */
    /* [4/6] Required Documentation */
    /* [5/6] Approval */
    /* [6/6] Review */
  });

  it('INVALID project creation', () => {
    cy.visit('/dispose/projects/draft');

    /* [1/6] Draft */
    /* [2/6] Select Properties */
    /* [3/6] Update Information */
    /* [4/6] Required Documentation */
    /* [5/6] Approval */
    /* [6/6] Review */
  });
});
