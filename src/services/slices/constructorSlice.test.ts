import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setRequest,
  resetModal,
  orderBurger,
  TConsturctorState
} from './constructorSlice';
import { TOrder, TIngredient } from '@api'; // Изменено с @utils-types на @api

const initialState: TConsturctorState = {
  loading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 50,
  calories: 300,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

const mockMainIngredient: TIngredient = {
  _id: '2',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 10,
  calories: 500,
  price: 200,
  image: 'patty.png',
  image_large: 'patty-large.png',
  image_mobile: 'patty-mobile.png'
};

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2025-08-25T08:00:00.000Z',
  updatedAt: '2025-08-25T08:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2']
};

describe('constructorSlice', () => {
  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  it('should handle addIngredient (bun)', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.constructorItems.bun).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('should handle addIngredient (main)', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockMainIngredient)
    );
    expect(state.constructorItems.ingredients).toEqual([
      { ...mockMainIngredient, id: expect.any(String) }
    ]);
  });

  it('should handle removeIngredient', () => {
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(mockMainIngredient)
    );
    const ingredientId = stateWithIngredient.constructorItems.ingredients[0].id;
    const state = constructorReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('should handle moveIngredientUp', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMainIngredient)
    );
    const secondIngredient: TIngredient = {
      ...mockMainIngredient,
      _id: '3',
      name: 'Салат'
    };
    const stateWithTwoIngredients = constructorReducer(
      stateWithIngredients,
      addIngredient(secondIngredient)
    );
    const state = constructorReducer(
      stateWithTwoIngredients,
      moveIngredientUp(1)
    );
    expect(state.constructorItems.ingredients[0].name).toBe('Салат');
    expect(state.constructorItems.ingredients[1].name).toBe('Котлета');
  });

  it('should handle moveIngredientDown', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMainIngredient)
    );
    const secondIngredient: TIngredient = {
      ...mockMainIngredient,
      _id: '3',
      name: 'Салат'
    };
    const stateWithTwoIngredients = constructorReducer(
      stateWithIngredients,
      addIngredient(secondIngredient)
    );
    const state = constructorReducer(
      stateWithTwoIngredients,
      moveIngredientDown(0)
    );
    expect(state.constructorItems.ingredients[0].name).toBe('Салат');
    expect(state.constructorItems.ingredients[1].name).toBe('Котлета');
  });

  it('should handle setRequest', () => {
    const state = constructorReducer(initialState, setRequest(true));
    expect(state.orderRequest).toBe(true);
  });

  it('should handle resetModal', () => {
    const stateWithModal = {
      ...initialState,
      orderModalData: mockOrder
    };
    const state = constructorReducer(stateWithModal, resetModal());
    expect(state.orderModalData).toBeNull();
  });

  it('should handle orderBurger.pending', () => {
    const state = constructorReducer(initialState, {
      type: orderBurger.pending.type,
      meta: { requestId: 'test-id', arg: ['1', '2'] }
    });
    expect(state).toEqual({
      ...initialState,
      loading: true,
      orderRequest: true,
      error: null
    });
  });

  it('should handle orderBurger.rejected', () => {
    const errorMessage = 'Order failed';
    const state = constructorReducer(initialState, {
      type: orderBurger.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id', arg: ['1', '2'] }
    });
    expect(state).toEqual({
      ...initialState,
      loading: false,
      orderRequest: false,
      error: errorMessage
    });
  });

  it('should handle orderBurger.fulfilled', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMainIngredient)
    );
    const state = constructorReducer(stateWithIngredients, {
      type: orderBurger.fulfilled.type,
      payload: { order: mockOrder },
      meta: { requestId: 'test-id', arg: ['1', '2'] }
    });
    expect(state).toEqual({
      ...initialState,
      loading: false,
      orderRequest: false,
      error: null,
      orderModalData: mockOrder,
      constructorItems: { bun: null, ingredients: [] }
    });
  });
});
