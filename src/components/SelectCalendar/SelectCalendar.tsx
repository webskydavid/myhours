import { useAtom } from 'jotai';
import { FC, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  calendarIdAtom,
  calendarListAtom,
  getCalendarListAtom,
  insertCalendarAtom,
  setCalendarIdAtom,
  statusAtom,
} from '../../atoms/calendar';

const SelectCalendar: FC = () => {
  const [status] = useAtom(statusAtom);
  const [calendarList] = useAtom(calendarListAtom);
  const [selectedCalendar] = useAtom(calendarIdAtom);
  const [, getCalendarList] = useAtom(getCalendarListAtom);
  const [, setCalendarId] = useAtom(setCalendarIdAtom);
  const [, insertCalendar] = useAtom(insertCalendarAtom);

  const history = useHistory();

  const handleSetCalendarId = useCallback(
    (id) => {
      setCalendarId(id);
      history.push('/');
    },
    [history, setCalendarId]
  );

  useEffect(() => {
    getCalendarList();
  }, []);

  return (
    <div>
      {!selectedCalendar ? <h4>You have no calendar selected!</h4> : null}
      <h4>Select one calendar:</h4>
      <div>
        {status === 'IDLE'
          ? calendarList.map((calendar) => {
              return (
                <div
                  key={calendar.id}
                  onClick={() => handleSetCalendarId(calendar.id)}
                >
                  {calendar.summary}
                </div>
              );
            })
          : 'Progressing...'}
      </div>

      <>
        <button
          type='button'
          onClick={insertCalendar}
          disabled={status === 'BUSY'}
        >
          Add calendar
        </button>
      </>
    </div>
  );
};

export default SelectCalendar;
