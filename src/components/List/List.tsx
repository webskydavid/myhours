import { addMonths, intervalToDuration, subMonths } from 'date-fns';
import format from 'date-fns/format';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAppState } from '../../providers/AppProvider/provider';
import { useEventList } from '../../providers/EventListProvider';
import EventForm from '../EventForm/EventForm';
import SelectCalendar from '../SelectCalendar/SelectCalendar';
import classes from './List.module.css';

const List: FC = () => {
  const appState = useAppState();
  const { state: eventListState, actions: eventListActions } = useEventList();
  const { loading, items, currentDate, calendarId } = eventListState;
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
    if (!appState.isAuthenticated) {
      history.push('/login');
    }
  }, [appState.isAuthenticated, history]);

  useEffect(() => {
    console.log(calendarId);

    if (appState.isAuthenticated) {
      if (calendarId !== '') {
        list();
      } else {
        calendar();
      }
    }
  }, [list, calendar, appState.isAuthenticated, calendarId]);

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
