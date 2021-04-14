import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useApp } from './../../providers/AppProvider';
import classes from './List.module.css';

const calendarId = 'pvvdnnjjhf3tgmlq12uageualg@group.calendar.google.com';

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

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

const getWorkTime = (start: Date, end: Date) => {
  return Math.abs(end.getTime() - start.getTime()) / 3600000;
};

const List: FC = () => {
  const currentDate = useMemo(() => new Date(), []);
  const { state } = useApp();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    command: '14 1345 1500',
  });
  const [month, setMonth] = useState(currentDate.getMonth());
  const [startAdding, setStartAdding] = useState(false);

  if (!state.isLoggedIn) {
    history.push('/login');
  }

  const fetchList = useCallback(
    async (currentDate: any) => {
      setBusy(true);
      try {
        const filter = getFilter(currentDate);
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events${filter}`;
        const res: Response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });

        if (res.status === 200) {
          const { items } = await res.json();
          setList(items);
          setBusy(false);
        } else {
          console.log(await res.json());
        }
      } catch (e) {
        console.log(e.json());
      }
    },
    [state.token]
  );

  const addHour = async () => {
    setBusy(true);
    try {
      const end = new Date();
      const start = new Date();
      end.setHours(end.getHours() + 1);
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${state.token}`,
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
      await fetchList(currentDate);
      setBusy(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: any) => {
    const { target } = e;
    setForm((f) => ({ ...f, [target.name]: target.value }));
  };

  useEffect(() => {
    fetchList(currentDate);
  }, []);

  useEffect(() => {
    console.log(month);

    currentDate.setMonth(month);
    fetchList(currentDate);
  }, [month, currentDate, fetchList]);

  return (
    <div>
      <h4>
        <button onClick={() => setMonth((s) => s - 1)}>MARZEC</button>
        {months[month]}
        <button onClick={() => setMonth((s) => s + 1)}>MAJ</button>
      </h4>
      {busy ? 'Loading data...' : null}
      <div className={classes.list}>
        {list.length
          ? list.map((event: any) => {
              const start = new Date(event.start.dateTime);
              const end = new Date(event.end.dateTime);

              return (
                <div key={event.id} className={classes.event}>
                  <div>{start.toISOString()}</div>
                  <div>
                    {start.getHours()}:
                    {start.getMinutes() === 0 ? '00' : start.getMinutes()}
                  </div>
                  <div>
                    {end.getHours()}:
                    {end.getMinutes() === 0 ? '00' : end.getMinutes()}
                  </div>
                  <div>{getWorkTime(start, end)}</div>
                </div>
              );
            })
          : 'No hours!'}
        {startAdding ? (
          <div className={classes.event}>
            <input
              onChange={handleChange}
              value={form.command}
              type='text'
              name='command'
            />
            <button onClick={addHour}>Add</button>
          </div>
        ) : (
          <button onClick={() => setStartAdding(true)}>Add</button>
        )}
      </div>
    </div>
  );
};

export default List;
