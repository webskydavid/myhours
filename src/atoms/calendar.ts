import { atom } from 'jotai';
import { userAtom } from './user';
import * as Service from './../services/service';
import { ICalendar } from '../models/calendar';
import { currentDateAtom } from './app';

// ATOMS
export const statusAtom = atom<'IDLE' | 'BUSY'>('IDLE');
export const errorAtom = atom<string | null>(null);
export const calendarListAtom = atom<ICalendar[]>([]);
export const calendarIdAtom = atom<string>(
  localStorage.getItem('calendarId') || ''
);
export const monthAtom = atom<number>(0);

// METHODS
export const setCalendarIdAtom = atom(null, (get, set, calendarId: string) => {
  localStorage.setItem('calendarId', calendarId);
  set(calendarIdAtom, calendarId);
});

export const getCalendarListAtom = atom(null, (get, set) => {
  set(statusAtom, 'BUSY');
  const run = async () => {
    try {
      const { token } = get(userAtom);
      const res = await Service.calendarList(token);
      set(calendarListAtom, res || []);
    } catch (e) {
      set(errorAtom, e);
    }
  };
  set(statusAtom, 'IDLE');
  run();
});

export const insertCalendarAtom = atom(null, (get, set) => {
  const list = get(calendarListAtom);
  set(statusAtom, 'BUSY');
  const run = async () => {
    try {
      const { token } = get(userAtom);
      const res = (await Service.insertCalendar(token)) as ICalendar;
      const newList = [...list, res];
      set(calendarListAtom, newList);
      set(statusAtom, 'IDLE');
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});

export const nextMonthAtom = atom(
  (get) => get(currentDateAtom).getMonth(),
  (get, set) => {
    const date = new Date(get(currentDateAtom));
    date.setMonth(date.getMonth() + 1);
    set(currentDateAtom, date);
  }
);

export const prevMonthAtom = atom(
  (get) => get(currentDateAtom).getMonth(),
  (get, set) => {
    const date = get(currentDateAtom);
    date.setMonth(date.getMonth() - 1);
    set(currentDateAtom, new Date(date));
  }
);
