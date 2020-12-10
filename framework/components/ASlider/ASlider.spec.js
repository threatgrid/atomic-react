context("ASlider", () => {
  before(() => {
    cy.visitInLightTheme("http://localhost:8081/components/slider");
  });

  it("has working keyboard controls", () => {
    cy.get("#usage + .playground").should("contain", "Value: 2");
    cy.get("#usage + .playground .a-slider__thumb").click().type("{upArrow}");
    cy.get("#usage + .playground").should("contain", "Value: 3");
    cy.get("#usage + .playground .a-slider__thumb").click().type("{downArrow}");
    cy.get("#usage + .playground").should("contain", "You must agree");
    cy.get("#usage + .playground .a-slider__thumb").click().type("{pageUp}");
    cy.get("#usage + .playground .a-slider__thumb").click().type("{leftArrow}");
    cy.get("#usage + .playground").should("contain", "Value: 4");
    cy.get("#usage + .playground .a-slider__thumb").click().type("{pageDown}");
    cy.get("#usage + .playground .a-slider__thumb")
      .click()
      .type("{rightArrow}");
    cy.get("#usage + .playground .a-slider__thumb")
      .click()
      .type("{rightArrow}");
    cy.get("#usage + .playground .a-slider__thumb")
      .click()
      .type("{rightArrow}");
    cy.get("#usage + .playground").should("contain", "Value: 3");

    cy.get("#range + .playground").should("contain", "Value: 0,1000");
    cy.get("#range + .playground .a-slider__thumb").click().type("{upArrow}");
    cy.get("#range + .playground").should("contain", "Value: 15,1000");
    cy.get("#range + .playground .a-slider__thumb").click().type("{downArrow}");
    cy.get("#range + .playground").should("contain", "Value: 0,1000");
    cy.get("#range + .playground .a-slider__thumb").click().type("{pageUp}");
    cy.get("#range + .playground").should("contain", "Value: 150,1000");
    cy.get("#range + .playground .a-slider__thumb").click().type("{leftArrow}");
    cy.get("#range + .playground").should("contain", "Value: 135,1000");
    cy.get("#range + .playground .a-slider__thumb").click().type("{pageDown}");
    cy.get("#range + .playground").should("contain", "Value: 0,1000");
    cy.get("#range + .playground .a-slider__thumb")
      .click()
      .type("{rightArrow}");
    cy.get("#range + .playground").should("contain", "Value: 15,1000");
  });

  // TODO: Test accessibility

  it("supports themes", () => {
    if (Cypress.env("snapshots") === "off") return;

    cy.get("#states + .playground .playground__preview").toMatchImageSnapshot();

    cy.get(".a-switch__box").eq(0).click();

    cy.get("#states + .playground .playground__preview").toMatchImageSnapshot();
  });
});
