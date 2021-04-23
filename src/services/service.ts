import { differenceInMinutes } from 'date-fns';
import { ICalendar } from '../models/calendar';
import { IEvent } from '../models/event';

const API_URL = 'https://www.googleapis.com/calendar/v3/';

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

export const list = async (
  token: string,
  calendarId: string,
  currentDate: Date
): Promise<IEvent[] | undefined> => {
  try {
    const filter = getFilter(currentDate);
    const orderBy = '&orderBy=startTime';
    const singleEvents = '&singleEvents=true';
    const query = `${filter}${singleEvents}${orderBy}`;
    const url = `${API_URL}calendars/${calendarId}/events${query}`;
    const res: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      const { items } = await res.json();
      return items;
    } else {
      new Error('Error: Calendar list!');
    }
  } catch (e) {
    new Error(e);
  }
};

export const remove = async (
  id: string,
  token: string,
  calendarId: string
): Promise<boolean | undefined> => {
  try {
    const url = `${API_URL}calendars/${calendarId}/events/${id}`;
    const res: Response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 204) {
      return true;
    } else {
      new Error('Error: Calendar list!');
    }
  } catch (e) {
    new Error(e);
  }
};

export const insert = async (
  command: string,
  token: string,
  currentDate: Date,
  calendarId: string
): Promise<IEvent | undefined> => {
  try {
    const [d, s, e] = command.split(' ');
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      Number.parseInt(d),
      Number.parseInt(s.slice(-4, s.length / 2)),
      Number.parseInt(s.slice(-2))
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      Number.parseInt(d),
      Number.parseInt(e.slice(-4, e.length / 2)),
      Number.parseInt(e.slice(-2))
    );

    const res: Response = await fetch(
      `${API_URL}calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary: (differenceInMinutes(end, start) / 60).toFixed(2) + 'h',
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

    if (res.status === 200) {
      return res.json();
    }
  } catch (e) {
    new Error(e);
  }
};

export const update = async (
  id: string,
  command: string,
  token: string,
  currentDate: Date,
  calendarId: string
): Promise<IEvent | undefined> => {
  try {
    const [d, s, e] = command.split(' ');
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      Number.parseInt(d),
      Number.parseInt(s.slice(-4, s.length / 2)),
      Number.parseInt(s.slice(-2))
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      Number.parseInt(d),
      Number.parseInt(e.slice(-4, e.length / 2)),
      Number.parseInt(e.slice(-2))
    );

    const res: Response = await fetch(
      `${API_URL}calendars/${calendarId}/events/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary: (differenceInMinutes(end, start) / 60).toFixed(2) + 'h',
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

    if (res.status === 200) {
      return res.json();
    }
  } catch (e) {
    new Error(e);
  }
};

export const insertCalendar = async (
  token: string
): Promise<ICalendar | Error> => {
  try {
    const res: Response = await fetch(`${API_URL}calendars`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        summary: `__HOURS__${Date.now()}`,
      }),
    });

    if (res.status === 200) {
      return (await res.json()) as ICalendar;
    } else {
      return new Error('Error: Insert calendar!');
    }
  } catch (e) {
    return new Error(e);
  }
};

export const calendarList = async (
  token: string
): Promise<ICalendar[] | undefined> => {
  try {
    const url = `${API_URL}users/me/calendarList`;
    const res: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      const { items } = await res.json();
      // FIX: Issue with missing calendars
      const filtered: ICalendar[] = items.filter((item: any) => {
        return item.summary.startsWith('__HOURS__');
      });
      return filtered;
    } else {
      new Error('Error: Calendar list!');
    }
  } catch (e) {
    new Error(e);
  }
};
