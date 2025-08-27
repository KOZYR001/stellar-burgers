describe('burger constructor', () => {
  beforeEach(() => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const password = 'password123';

    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: '/images/bun.png',
            image_mobile: '/images/bun-mobile.png',
            image_large: '/images/bun-large.png',
            __v: 0
          },
          {
            _id: '643d69a5c3f7b9001cfa0941',
            name: 'Биокотлета из марсианской травы',
            type: 'main',
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 300,
            image: '/images/patty.png',
            image_mobile: '/images/patty-mobile.png',
            image_large: '/images/patty-large.png',
            __v: 0
          }
        ]
      }
    }).as('getIngredients');

    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/register', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { email: uniqueEmail, name: 'Test User' }
      }
    }).as('register');

    cy.request({
      method: 'POST',
      url: 'https://norma.nomoreparties.space/api/auth/register',
      body: { email: uniqueEmail, password, name: 'Test User' }
    }).then((response) => {
      window.localStorage.setItem('accessToken', response.body.accessToken);
      window.localStorage.setItem('refreshToken', response.body.refreshToken);
      cy.log(`Эмуляция регистрации: ${uniqueEmail}`);
    });

    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { email: uniqueEmail, name: 'Test User' }
      }
    }).as('login');

    cy.request({
      method: 'POST',
      url: 'https://norma.nomoreparties.space/api/auth/login',
      body: { email: uniqueEmail, password }
    }).then((response) => {
      window.localStorage.setItem('accessToken', response.body.accessToken);
      window.localStorage.setItem('refreshToken', response.body.refreshToken);
      cy.log(`Эмуляция входа: ${uniqueEmail}`);
    });

    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: uniqueEmail, name: 'Test User' }
      }
    }).as('getUser');

    cy.visit('/');
  });

  it('should open ingredient modal', () => {
    // Получаем URL из элемента и проверяем его
    cy.get('[data-cy="ingredient"]')
      .first()
      .then(($el) => {
        const href = $el.find('a').attr('href'); // Ищем атрибут href внутри Link
        if (!href) {
          throw new Error('href attribute not found on [data-cy="ingredient"] Link');
        }
        cy.log(`Navigating to: ${href}`);
        cy.visit(href, { state: { background: '/' } });
      });

    // Проверяем, что модальное окно открылось
    cy.get('[data-cy="modal"]', { timeout: 15000 }).should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
  });

  it('should open order modal', () => {
    cy.get('[data-cy="ingredient"]').first().find('button').click();

    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Test Order',
        order: { number: 12345 }
      }
    }).as('createOrder');

    cy.get('[data-cy="order-button"]').should('not.be.disabled');
    cy.get('[data-cy="order-button"]').click();

    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]', { timeout: 15000 }).should('be.visible');
    cy.contains('12345').should('be.visible');
  });
});