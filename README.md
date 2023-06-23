# Reproduction of `cy.wait` issue with array of aliases

## Description

It appears that Cypress handles an array of aliases differently than `cy.wait` an alias multiple times serially (at least for aliases `cy.intercept` calls). The order of the array of results is not given in the same order.

**this works**
```js
// `cy.wait` automatically increments each time the alias is waited on, seems to work as expected wrt order
cy.wait('@item').then((req) => ...do your assertions on the first interception...)
cy.wait('@item').then((req) => ...do your assertions on the second interception...)
cy.wait('@item').then((req) => ...do your assertions on the third interception...)
```

**this doesn't**
```js
// Using an array of aliases should work the same, at least the docs don't claim otherwise
cy.wait(['@item', '@item', '@item']).then((reqs) => {
  const mystery = reqs[0];  // this could be any one of the three requests
})
```

## Instructions

1. Clone repo
1. `npm i`
1. `npx cypress open`
1. Open E2E mode in Chrome or Electron
1. Run the spec, observe failure of test case using array
*Note:* Rarely the planets align and everything works, re-run the spec and the array version will fail

## License

MIT