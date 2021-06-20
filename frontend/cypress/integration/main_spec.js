describe('Protein Matcher', () => {
  it('Runs searches and displays history', () => {
    cy.visit('/')
    cy.focused().type('notdna');
    cy.get('#search').click();
    cy.get('table').should($el => {
      expect($el).to.contain('NOTDNA');
      var $resultLogo = $el.find('tr').last().find('img');
      expect($resultLogo).attr('class').to.eq('spinner');
    });
  })
})