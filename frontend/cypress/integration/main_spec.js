describe('Protein Matcher', () => {
  before(() => Cypress.Cookies.defaults({ preserve: ['sessionid', 'csrftoken'] }));

  it('Runs searches via text and file inputs', () => {
    cy.clearCookie('sessionid');
    cy.visit('/')
    // Backend mock won't find a match based on settings_dev.
    cy.focused().type(Cypress.env('unmatchableSequence'));
    cy.get('#search').click();

    cy.fixture('dnaSequence.txt').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'dnaSequence.txt',
          mimeType: 'text/plain'
      });
      cy.get('#search').click();
    });
  })

  it('Preserves searches for the current user.', () => {
    cy.reload();
    cy.get('table').should($el => {
      expect($el).to.contain(Cypress.env('unmatchableSequence'));
      expect($el).to.contain('AATGTTTTATTTGGAATCTTTTTGCATATATGACATTTACCGTCAACTGGAAATGGAGTATTCCTCTTTA');

      expect($el.find('tr')).length(4);
      const $resultLogos = $el.find('tr').find('img');
      expect($resultLogos).length(2);
      expect($resultLogos).attr('alt').to.eq('Looking...');
    });
  });

  it('Displays search results and links to NCBI website.', () => {
    cy.wait(3000);
    cy.get('table').should($el => {
      expect($el).to.contain('NC_000852');
      expect($el.find('a').attr('href')).to.eq('https://www.ncbi.nlm.nih.gov/nuccore/NC_000852');

      expect($el.find('tr')).length(4);
      const $resultLogos = $el.find('tr').find('img');
      expect($resultLogos).length(1);
      expect($resultLogos).attr('alt').to.eq('Not found');
    });
  })
})