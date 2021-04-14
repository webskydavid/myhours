export interface IState {
  loading: boolean;
  error: Error | null;
  list: any[];
}

export interface IReducer {
  type: string;
  payload: any;
}

export const initialState = {
  loading: false,
  error: null,
  list: [],
};

export const reducer = (state: IState, action: IReducer) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'RESPONSE':
      return { ...state, loading: false, list: payload };
    case 'ERROR':
      return { ...state, error: payload, loading: false };
    default:
      throw new Error(`Unhandled action: ${type}`);
  }
};
