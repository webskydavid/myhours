export interface IState {
  isLoggedIn: boolean;
  loading: boolean;
  error: Error | null;
  token: string;
}

export interface IReducer {
  type: string;
  payload: any;
}

export const initialState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  token: '',
};

export const reducer = (state: IState, action: IReducer) => {
  const { type, payload } = action;
  switch (type) {
    case 'IS_LOGGED_IN':
      return { ...state, isLoggedIn: payload };
    case 'TOKEN':
      return { ...state, token: payload };
    case 'LOADING':
      return { ...state, loading: payload };
    case 'ERROR':
      return { ...state, error: payload };
    default:
      throw new Error(`Unhandled action: ${type}`);
  }
};
