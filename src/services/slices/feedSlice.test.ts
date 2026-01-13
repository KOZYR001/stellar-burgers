import feedReducer, { getFeeds, TFeedState } from './feedSlice';
import { TOrder } from '@api'; // Изменено с @utils-types на @api

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2025-08-25T08:00:00.000Z',
    updatedAt: '2025-08-25T08:00:00.000Z',
    number: 12345,
    ingredients: ['1', '2']
  }
];

describe('feedSlice', () => {
  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle getFeeds.pending', () => {
    const state = feedReducer(initialState, {
      type: getFeeds.pending.type,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should handle getFeeds.rejected', () => {
    const errorMessage = 'Failed to fetch feeds';
    const state = feedReducer(initialState, {
      type: getFeeds.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  it('should handle getFeeds.fulfilled', () => {
    const state = feedReducer(initialState, {
      type: getFeeds.fulfilled.type,
      payload: { orders: mockOrders, total: 100, totalToday: 10 },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      orders: mockOrders,
      total: 100,
      totalToday: 10
    });
  });
});
