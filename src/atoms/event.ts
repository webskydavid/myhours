import { differenceInMinutes, format, getTime } from 'date-fns';
import { atom } from 'jotai';
import { IEvent } from '../models/event';
import { currentDateAtom, netPricePerHAtom, vatAtom } from './app';
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

function setTotalHours(get: any, set: any, res: IEvent[] | undefined) {
  const vat = get(vatAtom);
  const netPricePerH = get(netPricePerHAtom);
  const total = (
    res!.reduce((prev, val) => {
      const start = new Date(val.start.dateTime);
      const end = new Date(val.end.dateTime);
      return prev + differenceInMinutes(end, start);
    }, 0) / 60
  ).toFixed(2);
  set(totalHoursAtom, total);
  const sum = Number.parseFloat(total) * Number.parseFloat(netPricePerH);
  const vatPer = Number.parseFloat(vat) / 100;
  set(totalErningsAtom, sum - sum * vatPer);
}

export const statusAtom = atom<'IDLE' | 'BUSY'>('IDLE');
export const errorAtom = atom<string | null>(null);
export const eventListAtom = atom<IEvent[]>([]);
export const totalHoursAtom = atom<string>('0');
export const totalErningsAtom = atom<string>('0');
export const selectedEventAtom = atom<IEvent | null>(null);

export const getCommandAtom = atom<string | null>((get) => {
  const event = get(selectedEventAtom);
  if (!event) {
    return null;
  }

  const day = format(new Date(event?.start?.dateTime!), 'dd');
  const start = format(new Date(event?.start?.dateTime!), 'HHmm');
  const end = format(new Date(event?.end?.dateTime!), 'HHmm');

  return `${day} ${start} ${end}`;
});

export const getEventListAtom = atom(null, (get, set) => {
  set(statusAtom, 'BUSY');
  const { token } = get(userAtom);
  const currentDate = get(currentDateAtom);
  const calendarId = get(calendarIdAtom);

  const run = async () => {
    try {
      const res = await Service.list(token, calendarId!, currentDate);

      setTotalHours(get, set, res);
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
        const newItems = [...items].filter((e) => e.id !== id);
        setTotalHours(get, set, newItems);
        set(eventListAtom, eventListManipulator(newItems));
        set(statusAtom, 'IDLE');
      }
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});

export const insertEventAtom = atom(null, (get, set, command: string) => {
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
      setTotalHours(get, set, newItems);
      set(eventListAtom, eventListManipulator(newItems));
      set(statusAtom, 'IDLE');
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});

export const updateEventAtom = atom(null, (get, set, { id, command }) => {
  set(statusAtom, 'BUSY');
  const items = get(eventListAtom);
  const { token } = get(userAtom);
  const calendarId = get(calendarIdAtom);
  const currentDate = get(currentDateAtom);

  const run = async () => {
    try {
      const res = await Service.update(
        id,
        command,
        token,
        currentDate,
        calendarId!
      );
      const newItems = [...items].map((i) => {
        if (i.id === id) {
          return res;
        }
        return i;
      }) as IEvent[];
      setTotalHours(get, set, newItems);
      set(eventListAtom, eventListManipulator(newItems));
      set(selectedEventAtom, null);
      set(statusAtom, 'IDLE');
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});
