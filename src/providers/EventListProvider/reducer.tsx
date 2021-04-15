export interface IState {
  loading: boolean;
  error: Error | null;
  items: any[];
  currentDate: Date;
  month: number;
}

export interface IReducer {
  type: string;
  payload?: any;
}

export const initialState = {
  loading: false,
  error: null,
  items: [],
  currentDate: new Date(),
  month: 0,
};

export const reducer = (state: IState, action: IReducer) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'RESPONSE':
      return { ...state, loading: false, items: payload };
    case 'ERROR':
      return { ...state, error: payload, loading: false };
    case 'CHANGE_DATE':
      const { currentDate, month } = payload;
      return { ...state, currentDate, month };
    default:
      throw new Error(`Unhandled action: ${type}`);
  }
};
