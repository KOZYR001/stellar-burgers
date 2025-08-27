import ingredientReducer, {
  getIngredients,
  TIngredientState
} from '@slices/ingredientSlice';
import { TIngredient } from '@utils-types';

const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 50,
    calories: 300,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
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
  }
];

describe('ingredientSlice', () => {
  it('should return initial state', () => {
    expect(ingredientReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  it('should handle getIngredients.pending', () => {
    const state = ingredientReducer(initialState, {
      type: getIngredients.pending.type,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should handle getIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const state = ingredientReducer(initialState, {
      type: getIngredients.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  it('should handle getIngredients.fulfilled', () => {
    const state = ingredientReducer(initialState, {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      ingredients: mockIngredients
    });
  });
});
