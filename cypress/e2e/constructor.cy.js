describe('burger constructor', () => {
  let orderData;

  beforeEach(() => {
    // Загружаем фикстуру до настройки перехватов
    cy.fixture('order').then((data) => {
      orderData = data;
    });

    cy.fixture('ingredients').then((data) => {
      data.data = data.data.map((item) => ({
        ...item,
        image: '/placeholder.png',
        image_large: '/placeholder.png',
        image_mobile: '/placeholder.png'
      }));
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        statusCode: 200,
        body: data
      }).as('getIngredients');
    });

    cy.fixture('user').then((data) => {
      const authData = {
        ...data,
        accessToken: 'Bearer mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
      cy.intercept(
        'POST',
        'https://norma.nomoreparties.space/api/auth/register',
        {
          statusCode: 200,
          body: authData
        }
      ).as('register');

      cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
        statusCode: 200,
        body: authData
      }).as('login');

      cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
        statusCode: 200,
        body: authData
      }).as('getUser');

      cy.intercept(
        'POST',
        'https://norma.nomoreparties.space/api/orders',
        (req) => {
          req.headers['authorization'] = authData.accessToken;
          req.reply({
            statusCode: 200,
            body: orderData // Используем заранее загруженные данные
          });
        }
      ).as('createOrder');

      window.localStorage.setItem('accessToken', authData.accessToken);
      window.localStorage.setItem('refreshToken', authData.refreshToken);
      cy.setCookie('accessToken', authData.accessToken);

      // Эмуляция вызова getUser
      cy.intercept(
        'GET',
        'https://norma.nomoreparties.space/api/auth/user',
        (req) => {
          req.reply({ statusCode: 200, body: authData });
        }
      ).as('mockGetUser');

      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'userState',
            JSON.stringify({
              user: { email: 'test@example.com', name: 'Test User' },
              isAuthenticated: true,
              isAuthChecked: false
            })
          );
        }
      });
    });

    cy.wait('@getIngredients', {
      requestTimeout: 15000,
      responseTimeout: 15000
    }).then((interception) => {
      if (!interception.response.body.success) {
        throw new Error('Failed to load ingredients');
      }
    });
    cy.wait('@mockGetUser', { requestTimeout: 15000, responseTimeout: 15000 }); // Ждём эмуляцию getUser
    cy.get('.burger_constructor', { timeout: 40000 }).should('be.visible');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should open ingredient modal by clicking on image', () => {
    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          cy.wrap($ingredients).first().find('img').click({ force: true });
          cy.get('#modals')
            .find('[data-cy="modal"]', { timeout: 15000 })
            .should('be.visible');
          cy.get('#modals')
            .find('[data-cy="modal"]')
            .within(() => {
              cy.contains('Детали ингредиента').should('be.visible');
              cy.contains('Булка').should('be.visible');
            });
        } catch (err) {
          cy.log('Error opening ingredient modal:', err.message);
          cy.get('body').debug();
          throw err;
        }
      });
  });

  it('should close ingredient modal by clicking on cross', () => {
    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          cy.wrap($ingredients).first().find('img').click({ force: true });
          cy.get('#modals')
            .find('[data-cy="modal"]', { timeout: 15000 })
            .should('be.visible');
          cy.get('#modals')
            .find('[data-cy="close-modal"]', { timeout: 15000 })
            .should('be.visible')
            .click({ force: true });
          cy.get('#modals').find('[data-cy="modal"]').should('not.exist');
        } catch (err) {
          cy.log('Error finding close button:', err.message);
          cy.get('#modals').debug();
          throw err;
        }
      });
  });

  it('should close ingredient modal by clicking on overlay', () => {
    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          cy.wrap($ingredients).first().find('img').click({ force: true });
          cy.get('#modals')
            .find('[data-cy="modal"]', { timeout: 15000 })
            .should('be.visible');
          cy.get('[data-cy="modal-overlay"]').click({ force: true });
          cy.get('#modals')
            .find('[data-cy="modal"]')
            .should('not.exist', { timeout: 4000 });
        } catch (err) {
          cy.log('Error closing modal by overlay:', err.message);
          cy.get('#modals').debug();
          throw err;
        }
      });
  });

  it('should add bun to constructor', () => {
    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          const $bun = $ingredients
            .filter((i, el) => {
              const dataAttr = Cypress.$(el).attr('data-ingredient');
              if (dataAttr) {
                try {
                  const parsedData = JSON.parse(dataAttr);
                  return parsedData.type === 'bun';
                } catch (e) {
                  cy.log('JSON Parse Error:', e.message);
                  return false;
                }
              }
              return false;
            })
            .first();
          if ($bun.length === 0) throw new Error('No bun ingredient found');
          cy.wrap($bun).find('button').click({ force: true });
          cy.wait(3000);
        } catch (err) {
          cy.log('Error finding bun ingredient:', err.message);
          cy.get('body').debug();
          throw err;
        }
      });
    cy.get('.constructor-element', { timeout: 30000 })
      .should('have.length.at.least', 2)
      .then(($elements) => {
        cy.wrap($elements)
          .first()
          .find('.constructor-element__text')
          .should('contain', 'Булка (верх)');
        cy.wrap($elements)
          .last()
          .find('.constructor-element__text')
          .should('contain', 'Булка (низ)');
      });
    cy.get('[data-cy="order-button"]').should('not.be.disabled');
  });

  it('should add main ingredient to constructor', () => {
    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          const $bun = $ingredients
            .filter((i, el) => {
              const dataAttr = Cypress.$(el).attr('data-ingredient');
              if (dataAttr) {
                try {
                  const parsedData = JSON.parse(dataAttr);
                  return parsedData.type === 'bun';
                } catch (e) {
                  cy.log('JSON Parse Error:', e.message);
                  return false;
                }
              }
              return false;
            })
            .first();
          if ($bun.length === 0) throw new Error('No bun ingredient found');
          cy.wrap($bun).find('button').click({ force: true });
          cy.wait(3000);
        } catch (err) {
          cy.log('Error finding bun ingredient:', err.message);
          cy.get('body').debug();
          throw err;
        }
      });

    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          const $main = $ingredients
            .filter((i, el) => {
              const dataAttr = Cypress.$(el).attr('data-ingredient');
              if (dataAttr) {
                try {
                  const parsedData = JSON.parse(dataAttr);
                  return parsedData.type === 'main';
                } catch (e) {
                  cy.log('JSON Parse Error:', e.message);
                  return false;
                }
              }
              return false;
            })
            .first();
          if ($main.length === 0) throw new Error('No main ingredient found');
          cy.wrap($main).find('button').click({ force: true });
          cy.wait(15000);
        } catch (err) {
          cy.log('Error finding main ingredient:', err.message);
          cy.get('body').debug();
          throw err;
        }
      });

    cy.get('.burger_constructor', { timeout: 40000 })
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="constructor-list"]', { timeout: 15000 })
          .should('be.visible')
          .find('.constructor-element')
          .should('have.length.at.least', 1)
          .first()
          .find('.constructor-element__text')
          .should('contain', 'Котлета');
      });

    cy.get('[data-cy="order-button"]').should('not.be.disabled');
  });

  it('should create order and clear constructor', () => {
    cy.get('[data-cy="ingredient"]', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($ingredients) => {
        try {
          const $bun = $ingredients
            .filter((i, el) => {
              const dataAttr = Cypress.$(el).attr('data-ingredient');
              if (dataAttr) {
                try {
                  const parsedData = JSON.parse(dataAttr);
                  return parsedData.type === 'bun';
                } catch (e) {
                  cy.log('JSON Parse Error:', e.message);
                  return false;
                }
              }
              return false;
            })
            .first();
          if ($bun.length === 0) throw new Error('No bun ingredient found');
          cy.wrap($bun).find('button').click({ force: true });
          cy.wait(3000);

          const $main = $ingredients
            .filter((i, el) => {
              const dataAttr = Cypress.$(el).attr('data-ingredient');
              if (dataAttr) {
                try {
                  const parsedData = JSON.parse(dataAttr);
                  return parsedData.type === 'main';
                } catch (e) {
                  cy.log('JSON Parse Error:', e.message);
                  return false;
                }
              }
              return false;
            })
            .first();
          if ($main.length === 0) throw new Error('No main ingredient found');
          cy.wrap($main).find('button').click({ force: true });
          cy.wait(3000);
        } catch (err) {
          cy.log('Error adding ingredients:', err.message);
          cy.get('body').debug();
          throw err;
        }
      });

    cy.get('.burger_constructor').within(() => {
      cy.get('.constructor-element').should('have.length.at.least', 2);
    });

    // Создаём заказ
    cy.get('[data-cy="order-button"]', { timeout: 15000 })
      .should('not.be.disabled')
      .click();
    cy.wait('@createOrder', {
      requestTimeout: 15000,
      responseTimeout: 15000
    }).then((interception) => {
      if (!interception.response.body.success) {
        throw new Error('Order creation failed');
      }
      cy.log('Order creation response:', interception.response.body);
    });

    // Ожидаем появления модального окна с номером заказа
    cy.get('#modals')
      .find('[data-cy="modal"]', { timeout: 20000 })
      .should('be.visible');
    cy.contains('12345').should('be.visible');

    // Закрываем модальное окно
    cy.get('#modals')
      .find('[data-cy="close-modal"]', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });
    cy.get('#modals').find('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get('.burger_constructor').within(() => {
      cy.get('.constructor-element', { timeout: 15000 }).should('not.exist');
    });
  });
});
