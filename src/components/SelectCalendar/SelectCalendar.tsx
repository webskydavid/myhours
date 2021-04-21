import { useAtom } from 'jotai';
import { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  calendarIdAtom,
  calendarListAtom,
  getCalendarListAtom,
  insertCalendarAtom,
  setCalendarIdAtom,
  statusAtom,
} from '../../atoms/calendar';

const useLocalStorage = () => {
  const [id, setId] = useState<string | null>();
  const KEY = 'calendarId';

  useEffect(() => {
    setId(localStorage.getItem(KEY));
  }, []);

  return { id };
};

const SelectCalendar: FC = () => {
  const [status] = useAtom(statusAtom);
  const [calendarId] = useAtom(calendarIdAtom);
  const [calendarList] = useAtom(calendarListAtom);
  const [, getCalendarList] = useAtom(getCalendarListAtom);
  const [, setCalendarId] = useAtom(setCalendarIdAtom);
  const [, insertCalendar] = useAtom(insertCalendarAtom);

  const history = useHistory();

  const handleSetCalendarId = useCallback(
    (id) => {
      setCalendarId(calendarId!);
      history.push('/');
    },
    [calendarId, history, setCalendarId]
  );

  useEffect(() => {
    getCalendarList();
    console.log(calendarId);

    if (calendarId !== '') {
      handleSetCalendarId(calendarId);
    }
  }, [getCalendarList, calendarId, handleSetCalendarId]);

  return (
    <>
      <h4>Select one calendar:</h4>
      <div>
        {status === 'IDLE'
          ? calendarList.map((calendar) => {
              return (
                <div key={calendar.id} onClick={handleSetCalendarId}>
                  {calendar.summary}
                </div>
              );
            })
          : 'Progressing...'}
      </div>

      {!calendarList.length ? (
        <>
          <h4>No calendar found</h4>
          <button
            type='button'
            onClick={insertCalendar}
            disabled={status === 'BUSY'}
          >
            Add calendar
          </button>
        </>
      ) : null}
    </>
  );
};

export default SelectCalendar;
