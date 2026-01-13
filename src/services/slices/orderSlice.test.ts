import orderReducer, { getOrderByNumber, TOrderState } from './orderSlice';
import { TOrder } from '@api'; // Изменено с @utils-types на @api

const initialState: TOrderState = {
  orders: [],
  orderByNumberResponse: null,
  request: false,
  responseOrder: null,
  error: null
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

describe('orderSlice', () => {
  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle getOrderByNumber.pending', () => {
    const state = orderReducer(initialState, {
      type: getOrderByNumber.pending.type,
      meta: { requestId: 'test-id', arg: 12345 }
    });
    expect(state).toEqual({
      ...initialState,
      error: null,
      request: true
    });
  });

  it('should handle getOrderByNumber.rejected', () => {
    const errorMessage = 'Failed to fetch order';
    const state = orderReducer(initialState, {
      type: getOrderByNumber.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id', arg: 12345 }
    });
    expect(state).toEqual({
      ...initialState,
      error: errorMessage,
      request: false
    });
  });

  it('should handle getOrderByNumber.fulfilled', () => {
    const state = orderReducer(initialState, {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [mockOrder] },
      meta: { requestId: 'test-id', arg: 12345 }
    });
    expect(state).toEqual({
      ...initialState,
      error: null,
      request: false,
      orderByNumberResponse: mockOrder
    });
  });
});
