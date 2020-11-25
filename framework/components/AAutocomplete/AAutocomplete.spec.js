import giResponse from "./algolia.gi.fixture.json";

context("AAutocomplete", () => {
  before(() => {
    cy.visitInLightTheme("http://localhost:8081/components/autocomplete");
  });

  it("has a label that works", () => {
    cy.get("#usage + .playground .a-input-base__label")
      .eq(0)
      .click()
      .then(($el) => {
        const labelFor = $el.attr("for");
        cy.get("#usage + .playground .a-autocomplete__input")
          .eq(0)
          .then(($el2) => {
            Cypress.dom.isFocused($el2);
            cy.wrap($el2).should("have.attr", "id", labelFor);
          });
      });
  });

  it("opens and closes appropriately", () => {
    cy.intercept("POST", "https://nut7b5fgkt", {
      headers: {
        "access-control-allow-origin": window.location.origin,
        "Access-Control-Allow-Credentials": "true"
      },
      body: giResponse
    }).as("algolia");

    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .should("not.be.visible");
    cy.get("#usage + .playground .a-autocomplete__input")
      .eq(0)
      .type("gi")
      .wait("@algolia");
    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .should("be.visible")
      .prev()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .type("{downArrow}");
    cy.get("#usage + .playground .a-autocomplete__menu-item")
      .eq(0)
      .type("{esc}");
    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .should("not.be.visible");
  });

  it("tabs appropriately", () => {
    cy.get("#usage + .playground .a-autocomplete__input")
      .eq(0)
      .type("{downArrow}")
      .tab();
    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .find(".a-autocomplete__menu-item")
      .first()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .tab();
    cy.get("#usage + .playground .a-input-base__clear")
      .eq(0)
      .then(($el) => {
        Cypress.dom.isFocused($el);
      });
  });

  it("arrow-keys menus appropriately", () => {
    cy.get("#usage + .playground .a-autocomplete__input")
      .eq(0)
      .type("{downArrow}")
      .type("{downArrow}");
    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .find(".a-autocomplete__menu-item")
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

    cy.get("#usage + .playground .a-autocomplete__input")
      .eq(0)
      .type("{upArrow}");
    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .find(".a-autocomplete__menu-item")
      .last()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .focus()
      .type("{upArrow}")
      .prev()
      .then(($el) => {
        Cypress.dom.isFocused($el);
      })
      .focus()
      .type("{esc}");
  });

  it("has appropriate role attributes", () => {
    cy.get("#usage + .playground .a-autocomplete__input")
      .eq(0)
      .type("{downArrow}");
    cy.get("#usage + .playground .a-autocomplete__menu-items")
      .eq(0)
      .should("have.attr", "role", "listbox")
      .find(".a-autocomplete__menu-item")
      .first()
      .should("have.attr", "role", "option")
      .focus()
      .type("{esc}");
  });

  it("validates on blur", () => {
    cy.get("#validation + .playground .a-autocomplete__input")
      .eq(0)
      .tab()
      .tab({shift: true})
      .tab();
    cy.get("#validation + .playground .a-input-base__hint")
      .eq(0)
      .contains("Food Group is required");
    cy.get("#validation + .playground .a-switch__box").click();
  });

  it("validates", () => {
    cy.get("#validation + .playground .a-autocomplete__input")
      .eq(0)
      .type("aaa");
    cy.get("#validation + .playground").click("top");
    cy.get("#validation + .playground .a-input-base__hint")
      .eq(0)
      .contains("Must have a capital letter");

    cy.get("#validation + .playground .a-autocomplete__input").eq(0).clear();
    cy.get("#validation + .playground").click("top");
    cy.get("#validation + .playground .a-input-base__hint")
      .eq(0)
      .contains("Food Group is required");
  });

  it("supports themes", () => {
    if (Cypress.env("snapshots") === "off") return;

    cy.get("#usage + .playground .a-autocomplete__input")
      .first()
      .type("{downArrow}")
      .type("{downArrow}");

    cy.get("#usage + .playground .playground__preview").toMatchImageSnapshot();

    cy.get("#states + .playground .a-autocomplete__input")
      .first()
      .type("{downArrow}")
      .type("{downArrow}");

    cy.get("#states + .playground .playground__preview").toMatchImageSnapshot();

    cy.get(".a-switch__box").eq(0).click();

    cy.get("#states + .playground .a-autocomplete__input")
      .first()
      .type("{downArrow}")
      .type("{downArrow}");

    cy.get("#states + .playground .playground__preview").toMatchImageSnapshot();
  });
});
