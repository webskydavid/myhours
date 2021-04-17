export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_RESPONSE = 'LOGOUT_RESPONSE';

export interface IState {
  error: string | null;
  token: string;
  isAuthenticated: boolean;
  state: string;
}

export interface IReducer {
  type: string;
  payload: any;
}

export const initialState = {
  error: null,
  token: '',
  isAuthenticated: false,
  state: 'IDLE',
};

export const reducer = (state: IState, action: any) => {
  const { type, payload } = action;
  console.groupCollapsed('appProvider reducer:', type);
  console.log(state, action);
  console.groupEnd();
  switch (type) {
    case LOGIN_REQUEST:
      return { ...state, state: 'BUSY' };
    case LOGIN_RESPONSE:
      return { ...state, state: 'IDLE', isAuthenticated: true, token: payload };
    case LOGIN_FAILURE:
      return { ...state, state: 'IDLE', error: payload };
    case LOGOUT_RESPONSE:
      return { ...state, state: 'IDLE', isAuthenticated: false, token: '' };
    default:
      throw new Error(`Unhandled action: ${type}`);
  }
};
