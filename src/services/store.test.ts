import { rootReducer } from '@store';
import { initialState as userInitialState } from '@slices/userSlice';
import { initialState as orderInitialState } from '@slices/orderSlice';
import { initialState as feedInitialState } from '@slices/feedSlice';
import { initialState as constructorInitialState } from '@slices/constructorSlice';
import { initialState as ingredientInitialState } from '@slices/ingredientSlice';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      user: userInitialState,
      order: orderInitialState,
      feed: feedInitialState,
      constructorBurger: constructorInitialState,
      ingredient: ingredientInitialState
    });
  });
});
