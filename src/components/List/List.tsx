import { addMonths, intervalToDuration, subMonths } from 'date-fns';
import format from 'date-fns/format';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useEventList } from '../../providers/EventListProvider';
import EventForm from '../EventForm/EventForm';
import SelectCalendar from '../SelectCalendar/SelectCalendar';
import { useApp } from './../../providers/AppProvider';
import classes from './List.module.css';

const List: FC = () => {
  const { state: appState } = useApp();
  const { state: eventListState, actions: eventListActions } = useEventList();
  const {
    loading,
    items,
    calendarList,
    currentDate,
    calendarId,
  } = eventListState;
  const {
    insert,
    remove,
    list,
    calendarList: calendar,
    nextMonth,
    prevMonth,
  } = eventListActions;

  const history = useHistory();

  useEffect(() => {
    if (!appState.isLoggedIn) {
      history.push('/login');
    }
  }, [appState.isLoggedIn, history]);

  useEffect(() => {
    console.log(calendarId);

    if (appState.isLoggedIn) {
      if (calendarId !== '') {
        list();
      } else {
        calendar();
      }
    }
  }, [list, calendar, appState.isLoggedIn, calendarId]);

  const handleInsert = (values: any) => {
    insert(values.command);
  };

  const handleRemove = (id: string) => {
    remove(id);
  };

  const setPrevMonth = () => {
    prevMonth();
  };

  const setNextMonth = () => {
    nextMonth();
  };

  return (
    <div>
      <SelectCalendar />
      <div className={classes.switcher}>
        <button onClick={setPrevMonth}>
          {format(subMonths(currentDate, 1), 'MMMM')}
        </button>
        <span>{format(currentDate, 'MMMM yyyy')}</span>
        <button onClick={setNextMonth}>
          {format(addMonths(currentDate, 1), 'MMMM')}
        </button>
      </div>
      {!loading ? (
        <>
          <div className={classes.list}>
            {!!items.length
              ? items.map((event: any) => {
                  const start = new Date(event.start.dateTime);
                  const end = new Date(event.end.dateTime);

                  return (
                    <div key={event.id} className={classes.event}>
                      <div className={classes.date}>
                        {format(start, 'yyyy-MM-dd')}
                      </div>
                      <div className={classes.start}>
                        {format(start, 'HH:mm')}
                      </div>
                      <div className={classes.end}>{format(end, 'HH:mm')}</div>
                      <div className={classes.hours}>
                        {intervalToDuration({ start, end }).hours}:
                        {intervalToDuration({ start, end }).minutes}
                      </div>
                      <button
                        className={classes.action}
                        onClick={() => handleRemove(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              : 'No hours!'}
          </div>
          <div className={classes.terminalContainer}>
            <EventForm
              classes={classes}
              currentDate={currentDate}
              handleInsert={handleInsert}
            />
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default List;
