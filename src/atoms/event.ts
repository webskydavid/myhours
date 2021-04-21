import { format, getTime } from 'date-fns';
import { atom } from 'jotai';
import { IEvent } from '../models/event';
import { currentDateAtom } from './app';
import { calendarIdAtom } from './calendar';
import { userAtom } from './user';
import * as Service from './../services/service';

const eventListManipulator = (items: IEvent[]) => {
  let day = 0;
  const clone = [...items];
  clone.map((i: IEvent, index: number) => {
    let currentDay = Number.parseInt(format(new Date(i.start.dateTime), 'dd'));
    if (currentDay > day) {
      i.divider = day !== 0 ? true : false;
      day = currentDay;
    } else {
      i.divider = false;
    }
    i.selected = false;
    return i;
  });

  clone.sort((a, b) => {
    return (
      getTime(new Date(a.start.dateTime)) - getTime(new Date(b.start.dateTime))
    );
  });
  return clone;
};

export const statusAtom = atom<'IDLE' | 'BUSY'>('IDLE');
export const errorAtom = atom<string | null>(null);

export const eventListAtom = atom<IEvent[]>([]);

export const getEventListAtom = atom(null, (get, set) => {
  set(statusAtom, 'BUSY');
  const { token } = get(userAtom);
  const currentDate = get(currentDateAtom);
  const calendarId = get(calendarIdAtom);

  console.log(currentDate);

  const run = async () => {
    try {
      const res = await Service.list(token, calendarId!, currentDate);
      set(eventListAtom, eventListManipulator(res!));
      set(statusAtom, 'IDLE');
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});

export const removeEventAtom = atom(null, (get, set, id: string) => {
  set(statusAtom, 'BUSY');
  const items = get(eventListAtom);
  const { token } = get(userAtom);
  const calendarId = get(calendarIdAtom);

  const run = async () => {
    try {
      const res = await Service.remove(id, token, calendarId!);
      if (res) {
        set(statusAtom, 'IDLE');
        set(
          eventListAtom,
          eventListManipulator([...items].filter((e) => e.id !== id))
        );
      }
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});

export const insertEventAtom = atom(null, (get, set, command: string) => {
  console.log(command);

  set(statusAtom, 'BUSY');
  const items = get(eventListAtom);
  const { token } = get(userAtom);
  const calendarId = get(calendarIdAtom);
  const currentDate = get(currentDateAtom);

  const run = async () => {
    try {
      const res = await Service.insert(
        command,
        token,
        currentDate,
        calendarId!
      );
      const newItems = [...items, res!];
      set(statusAtom, 'IDLE');
      set(eventListAtom, eventListManipulator(newItems));
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});
