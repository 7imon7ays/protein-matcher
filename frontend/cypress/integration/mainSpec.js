describe('Protein Matcher', () => {
  before(() => Cypress.Cookies.defaults({ preserve: ['sessionid', 'csrftoken'] }));

  it('Shows no search history for new visitors', () => {
    cy.clearCookie('sessionid');
    cy.visit('/');

    // Two rows appear by default.
    cy.get('table').should($el => { expect($el.find('tr')).length(2)});
  });

  it('Runs searches via text input and displays up to ten search results only.', () => {
    let dnaSequence;
    // Run twelve searches while preserving order of execution.
    var genArr = Array.from({ length: 12 }, (_, k) => k + 1);
    cy.wrap(genArr).each((i) => {
      dnaSequence = 'ATG'.repeat(i);
      cy.get('input[type="text"]').type(dnaSequence).type('{enter}');
      cy.wait(200);
    });

    // Backend mock won't find a match for this sequence based on settings_dev.
    cy.focused().type(Cypress.env('unmatchableSequence'));
    cy.get('#search').click();

    cy.get('table').should($el => {
      const $firstRow = $el.find('tr:nth-child(2)');
      // Last search still running.
      expect($firstRow.find('img')).attr('alt').to.eq('Looking...');
      expect($firstRow).to.contain(Cypress.env('unmatchableSequence'));

      expect($el.find('tr')).length(12);

      const $lastRow = $el.find('tr').last();
      expect($lastRow).to.contain('ATG'.repeat(4));
    });
  });

  it('Runs searches via file input.', () => {
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
      expect($el).to.contain('AATGTTTTATTTGGAATCTTTTTGCATATAT'); // From the file fixture above.
      expect($el).to.contain(Cypress.env('unmatchableSequence'));
    });
  });

  it('Displays search results and links to NCBI website.', () => {
    cy.wait(8000);
    cy.get('table').should($el => {
      expect($el).to.contain('NC_000852');
      expect($el.find('a').attr('href')).to.eq('https://www.ncbi.nlm.nih.gov/nuccore/NC_000852');

      const $resultLogos = $el.find('tr:nth-child(3)').find('img');
      expect($resultLogos).attr('alt').to.eq('Not found');
    });
  });

  it('Shows each visitor their own search history.', () => {
    cy.clearCookie('sessionid');
    cy.visit('/');

    // No search history.
    cy.get('table').should($el => { expect($el.find('tr')).length(2)});
  });
});