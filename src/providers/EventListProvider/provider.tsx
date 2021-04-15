import { FC, useReducer, useMemo, useCallback, Reducer } from 'react';
import { initialState, IReducer, IState, reducer } from './reducer';
import { Context } from './context';
import { useApp } from '../AppProvider';

const CALENDAR_ID = 'pvvdnnjjhf3tgmlq12uageualg@group.calendar.google.com';

const getFilter = (currentDate: any) => {
  const date = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    day: currentDate.getDate(),
  };

  const startDay = new Date(date.year, date.month, 1, 0, 0, 0);
  const endDay = new Date(date.year, date.month + 1, 0, 0, 0, 0);

  const parse = (date: any, dateToParse: any) => {
    const result = `${date.year}-${
      dateToParse.getMonth() < 10
        ? '0' + (dateToParse.getMonth() + 1)
        : dateToParse.getMonth()
    }-${
      dateToParse.getDate() < 10
        ? '0' + dateToParse.getDate()
        : dateToParse.getDate()
    }`;

    return result;
  };

  const filter = encodeURI(
    `?timeMin=${parse(date, startDay)}T00:01:00Z&timeMax=${parse(
      date,
      endDay
    )}T23:59:00Z`
  );

  return filter;
};

const EventListProvider: FC = ({ children }) => {
  const { state: appState } = useApp();
  const [state, dispatch] = useReducer<Reducer<IState, IReducer>>(reducer, {
    ...initialState,
    month: initialState.currentDate.getMonth(),
  });

  const list = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const filter = getFilter(state.currentDate);
      const orderBy = '&orderBy=startTime';
      const singleEvents = '&singleEvents=true';
      const query = `${filter}${singleEvents}${orderBy}`;
      const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events${query}`;
      const res: Response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${appState.token}`,
        },
      });
      if (res.status === 200) {
        const { items } = await res.json();
        dispatch({ type: 'RESPONSE', payload: items });
      } else {
        dispatch({ type: 'ERROR', payload: 'Error!' });
      }
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [state.currentDate, appState.token]);

  const remove = useCallback(
    async (id: string) => {
      dispatch({ type: 'LOADING' });
      try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${id}`;
        const res: Response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${appState.token}`,
          },
        });

        if (res.status === 204) {
          const filtered = state.items.filter((item) => {
            return item.id !== id;
          });
          dispatch({ type: 'RESPONSE', payload: filtered });
        } else {
          dispatch({ type: 'ERROR', payload: 'Error!' });
        }
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e });
      }
    },
    [appState.token, state.items]
  );

  const insert = useCallback(
    async (command) => {
      dispatch({ type: 'LOADING' });
      try {
        const [d, s, e] = command.split(' ');
        const start = new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth(),
          d,
          s.substring(0, 2),
          s.substring(2)
        );
        const end = new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth(),
          d,
          e.substring(0, 2),
          e.substring(2)
        );

        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${appState.token}`,
            },
            body: JSON.stringify({
              start: {
                dateTime: start.toISOString(),
                timeZone: 'Europe/Warsaw',
              },
              end: {
                dateTime: end.toISOString(),
                timeZone: 'Europe/Warsaw',
              },
            }),
          }
        );
        await list();
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e });
      }
    },
    [appState.token, state.currentDate, list]
  );

  const nextMonth = useCallback(() => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(state.month + 1);
    dispatch({
      type: 'CHANGE_DATE',
      payload: { month: state.month + 1, currentDate: newDate },
    });
  }, [state.month, state.currentDate]);

  const prevMonth = useCallback(() => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(state.month - 1);
    dispatch({
      type: 'CHANGE_DATE',
      payload: { month: state.month - 1, currentDate: newDate },
    });
  }, [state.month, state.currentDate]);

  const value = useMemo(
    () => ({
      state,
      actions: {
        list,
        remove,
        insert,
        nextMonth,
        prevMonth,
      },
    }),
    [state, list, remove, insert, nextMonth, prevMonth]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default EventListProvider;
