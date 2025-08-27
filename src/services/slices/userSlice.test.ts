import userReducer, {
  userLogout,
  resetError,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  getOrdersAll,
  TUserState
} from './userSlice';
import { TUser, TOrder, TRegisterData } from '@api'; // Изменено с @utils-types на @api

const initialState: TUserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  userData: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false,
  userOrders: []
};

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123'
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

describe('userSlice', () => {
  it('should return initial state', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle userLogout', () => {
    const state = userReducer(
      { ...initialState, userData: mockUser },
      userLogout()
    );
    expect(state.userData).toBeNull();
  });

  it('should handle resetError', () => {
    const state = userReducer(
      { ...initialState, error: 'Some error' },
      resetError()
    );
    expect(state.error).toBeNull();
  });

  it('should handle registerUser.pending', () => {
    const state = userReducer(initialState, {
      type: registerUser.pending.type,
      meta: { requestId: 'test-id', arg: mockRegisterData }
    });
    expect(state).toEqual({
      ...initialState,
      request: true,
      error: null,
      isAuthChecked: true,
      isAuthenticated: false
    });
  });

  it('should handle registerUser.rejected', () => {
    const errorMessage = 'Registration failed';
    const state = userReducer(initialState, {
      type: registerUser.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id', arg: mockRegisterData }
    });
    expect(state).toEqual({
      ...initialState,
      request: false,
      error: errorMessage,
      isAuthChecked: false
    });
  });

  it('should handle registerUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: {
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh'
      },
      meta: { requestId: 'test-id', arg: mockRegisterData }
    });
    expect(state).toEqual({
      ...initialState,
      request: false,
      error: null,
      response: mockUser,
      userData: mockUser,
      isAuthChecked: false,
      isAuthenticated: true
    });
  });

  it('should handle loginUser.pending', () => {
    const state = userReducer(initialState, {
      type: loginUser.pending.type,
      meta: {
        requestId: 'test-id',
        arg: { email: 'test@example.com', password: 'password123' }
      }
    });
    expect(state).toEqual({
      ...initialState,
      loginUserRequest: true,
      error: null,
      isAuthChecked: true,
      isAuthenticated: false
    });
  });

  it('should handle loginUser.rejected', () => {
    const errorMessage = 'Login failed';
    const state = userReducer(initialState, {
      type: loginUser.rejected.type,
      error: { message: errorMessage },
      meta: {
        requestId: 'test-id',
        arg: { email: 'test@example.com', password: 'password123' }
      }
    });
    expect(state).toEqual({
      ...initialState,
      loginUserRequest: false,
      isAuthChecked: false,
      error: errorMessage
    });
  });

  it('should handle loginUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: {
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh'
      },
      meta: {
        requestId: 'test-id',
        arg: { email: 'test@example.com', password: 'password123' }
      }
    });
    expect(state).toEqual({
      ...initialState,
      error: null,
      loginUserRequest: false,
      isAuthChecked: false,
      isAuthenticated: true,
      userData: mockUser
    });
  });

  it('should handle getUser.pending', () => {
    const state = userReducer(initialState, {
      type: getUser.pending.type,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      isAuthenticated: true,
      isAuthChecked: true,
      loginUserRequest: true
    });
  });

  it('should handle getUser.rejected', () => {
    const errorMessage = 'Get user failed';
    const state = userReducer(initialState, {
      type: getUser.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      isAuthenticated: false,
      isAuthChecked: false,
      loginUserRequest: false
    });
  });

  it('should handle getUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: getUser.fulfilled.type,
      payload: { user: mockUser },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      isAuthenticated: true,
      loginUserRequest: false,
      userData: mockUser,
      isAuthChecked: false
    });
  });

  it('should handle updateUser.pending', () => {
    const state = userReducer(initialState, {
      type: updateUser.pending.type,
      meta: { requestId: 'test-id', arg: { name: 'Updated User' } }
    });
    expect(state).toEqual({
      ...initialState,
      request: true,
      error: null
    });
  });

  it('should handle updateUser.rejected', () => {
    const errorMessage = 'Update failed';
    const state = userReducer(initialState, {
      type: updateUser.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id', arg: { name: 'Updated User' } }
    });
    expect(state).toEqual({
      ...initialState,
      request: false,
      error: errorMessage
    });
  });

  it('should handle updateUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: { user: mockUser },
      meta: { requestId: 'test-id', arg: { name: 'Updated User' } }
    });
    expect(state).toEqual({
      ...initialState,
      request: false,
      error: null,
      response: mockUser
    });
  });

  it('should handle logoutUser.pending', () => {
    const state = userReducer(initialState, {
      type: logoutUser.pending.type,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      isAuthenticated: true,
      isAuthChecked: true,
      error: null,
      request: true
    });
  });

  it('should handle logoutUser.rejected', () => {
    const errorMessage = 'Logout failed';
    const state = userReducer(initialState, {
      type: logoutUser.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      isAuthenticated: true,
      isAuthChecked: false,
      error: errorMessage,
      request: false
    });
  });

  it('should handle logoutUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: logoutUser.fulfilled.type,
      payload: undefined,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      isAuthenticated: false,
      isAuthChecked: false,
      error: null,
      request: false,
      userData: null
    });
  });

  it('should handle getOrdersAll.pending', () => {
    const state = userReducer(initialState, {
      type: getOrdersAll.pending.type,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      error: null,
      request: true
    });
  });

  it('should handle getOrdersAll.rejected', () => {
    const errorMessage = 'Orders fetch failed';
    const state = userReducer(initialState, {
      type: getOrdersAll.rejected.type,
      error: { message: errorMessage },
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      error: errorMessage,
      request: false
    });
  });

  it('should handle getOrdersAll.fulfilled', () => {
    const state = userReducer(initialState, {
      type: getOrdersAll.fulfilled.type,
      payload: mockOrders,
      meta: { requestId: 'test-id' }
    });
    expect(state).toEqual({
      ...initialState,
      error: null,
      request: false,
      userOrders: mockOrders
    });
  });
});
