context("ADropdown", () => {
  before(() => {
    cy.visitInLightTheme(
      "http://localhost:8081/iframe.html?id=components-dropdowns--usage-1&viewMode=docs"
    );
  });

  it("opens and closes appropriately", () => {
    cy.get("#story--components-dropdowns--usage-1 .a-dropdown__menu")
      .eq(0)
      .should("not.be.visible");
    cy.get("#story--components-dropdowns--usage-1 .a-button").eq(0).click();
    cy.get("#story--components-dropdowns--usage-1 .a-dropdown__menu")
      .eq(0)
      .should("be.visible")
      .type("{esc}")
      .should("not.be.visible")
      .prev()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      });
  });

  it("tabs appropriately", () => {
    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(0)
      .focus()
      .tab();
    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(1)
      .then(($el) => {
        Cypress.dom.isFocused($el);
      });

    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(0)
      .click()
      .tab();
    cy.get("#story--components-dropdowns--usage-1 .a-dropdown__menu")
      .eq(0)
      .should("not.be.visible");
    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(1)
      .then(($el) => {
        Cypress.dom.isFocused($el);
      });
  });

  it("arrow-keys appropriately", () => {
    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(0)
      .click()
      .next()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .type("{downArrow}")
      .find(".a-dropdown__item")
      .first()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .type("{downArrow}")
      .next()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .type("{esc}");

    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(0)
      .click()
      .next()
      .type("{upArrow}")
      .find(".a-dropdown__item")
      .last()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .type("{upArrow}")
      .prev()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .type("{esc}");
  });

  it("has working selected prop", () => {
    cy.get("#story--components-dropdowns--usage-1 .a-button").eq(0).click();
    cy.get("#story--components-dropdowns--usage-1 .a-dropdown__item")
      .eq(0)
      .should("have.class", "a-dropdown__item--state-selected")
      .type("{esc}");
  });

  it("has appropriate role attributes", () => {
    cy.get("#story--components-dropdowns--usage-1 .a-button")
      .eq(0)
      .click()
      .next()
      .should("have.attr", "role", "menu")
      .find(".a-dropdown__item")
      .first()
      .should("have.attr", "role", "menuitem")
      .type("{esc}");
  });

  it("supports themes", () => {
    if (Cypress.env("snapshots") === "off") return;

    cy.get("#story--components-dropdowns--usage-1 .a-button").first().click();

    cy.get("#story--components-dropdowns--usage-1")
      .parent()
      .parent()
      .matchImageSnapshot("a-dropdown--usage-1");

    cy.get(".a-button").eq(1).click();

    cy.get("#story--components-dropdowns--usage-1 .a-button").first().click();

    cy.get("#story--components-dropdowns--usage-1")
      .parent()
      .parent()
      .matchImageSnapshot("a-dropdown--dusk-1");
  });
});
