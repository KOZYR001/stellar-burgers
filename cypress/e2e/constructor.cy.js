describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    // Перехват запросов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json',
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json',
    }).as('createOrder');

    // Установка мокового токена
    cy.setCookie('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');

    // Открытие страницы конструктора
    cy.visit('/');
    cy.wait('@getIngredients');

    // Ожидание загрузки страницы
    cy.contains('Соберите бургер').should('be.visible');

    // Удаление оверлея Webpack Dev Server
    cy.get('body').then(($body) => {
      if ($body.find('#webpack-dev-server-client-overlay').length > 0) {
        cy.get('#webpack-dev-server-client-overlay').invoke('remove');
        cy.get('#webpack-dev-server-client-overlay').should('not.exist');
      }
    });

    // Отладка: логирование DOM
    cy.get('body').then(($body) => {
      cy.log($body.html());
    });
  });

  it('should add bun and main ingredient to constructor', () => {
    // Проверка, что конструктор пуст
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');

    // Добавление булки
    cy.contains('h3', 'Булки').should('be.visible');
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('li')
      .first()
      .contains('Добавить')
      .click({ force: true, timeout: 10000 });
    cy.contains('Булка (верх)').should('be.visible');
    cy.contains('Булка (низ)').should('be.visible');

    // Добавление начинки
    cy.contains('h3', 'Начинки').should('be.visible');
    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('li')
      .first()
      .contains('Добавить')
      .click({ force: true, timeout: 10000 });
    cy.contains('Котлета').should('be.visible');
  });

  it('should open and close ingredient modal', () => {
    // Проверка секции "Булки"
    cy.contains('h3', 'Булки').should('be.visible');

    // Клик по карточке ингредиента (переход на /ingredients/:id)
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('li')
      .first()
      .find('a')
      .click({ force: true, timeout: 10000 });

    // Проверка URL
    cy.url().should('include', '/ingredients/');

    // Проверка модального окна
    cy.get('[class*="modal_modal"]').should('be.visible', { timeout: 10000 });
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Булка').should('be.visible');

    // Закрытие по крестику
    cy.get('[class*="modal_modal"] button').click({ force: true, timeout: 10000 });
    cy.get('[class*="modal_modal"]').should('not.exist');

    // Повторное открытие и закрытие по оверлею
    cy.visit('/'); // Возвращаемся на главную
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('li')
      .first()
      .find('a')
      .click({ force: true, timeout: 10000 });
    cy.url().should('include', '/ingredients/');
    cy.get('[class*="modal_modal"]').should('be.visible', { timeout: 10000 });
    cy.get('[class*="modal-overlay_overlay"]').click({ force: true, position: 'topLeft', timeout: 10000 });
    cy.get('[class*="modal_modal"]').should('not.exist');
  });

  it('should create order and verify modal', () => {
    // Добавление булки и начинки
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('li')
      .first()
      .contains('Добавить')
      .click({ force: true, timeout: 10000 });
    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('li')
      .first()
      .contains('Добавить')
      .click({ force: true, timeout: 10000 });

    // Проверка цены
    cy.contains('400').should('be.visible');

    // Клик по кнопке "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click({ force: true, timeout: 10000 });
    cy.wait('@createOrder', { timeout: 10000 });

    // Проверка модального окна заказа
    cy.get('[class*="modal_modal"]').should('be.visible', { timeout: 10000 });
    cy.contains('12345').should('be.visible');

    // Закрытие модального окна
    cy.get('[class*="modal_modal"] button').click({ force: true, timeout: 10000 });
    cy.get('[class*="modal_modal"]').should('not.exist');

    // Проверка, что конструктор пуст
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });
});