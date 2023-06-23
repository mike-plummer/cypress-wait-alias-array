describe('cypress-support-internal-13', {defaultCommandTimeout: 100}, () => {
  beforeEach('passes', () => {
    cy.intercept('POST', 'https://example.cypress.io', async (request) => {
      // wait a random amount of ms before responding so the requests aren't
      // jumbled in the timeseries
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100))
      request.reply({ counter: JSON.parse(request.body).counter })
    }).as('req')

    cy.visit('./index.html')

    // Click a button that fires off 10 requests
    // Each request has a built-in random delay from the intercept above
    cy.get('button').click()
  })

  it('should return intercept subjects in order when waited using an array', () => {
    // Use `cy.wait` serially, ensure the yielded value matches the order the requests
    // were received
    for (let i = 0; i < 10; i++) {
      cy.wait('@req').its('response').its('body').its('counter').should('equal', i)
    }
  })

  it('should return intercept subjects in order when waited serially', () => {
    // Use `cy.wait` with an array of aliases, see if the yielded values are ordered
    // by when they were received (hint, they aren't in Cy 12.15.0)
    cy.wait(['@req', '@req', '@req', '@req', '@req', '@req', '@req', '@req', '@req', '@req']).then((reqs) => {
      for (let i = 0; i < 10; i++) {
        cy.wrap(reqs[i]).its('response').its('body').its('counter').should('equal', i)
      }
    })
  })
})