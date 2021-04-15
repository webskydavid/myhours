import {
  addMonths,
  getDate,
  getDaysInMonth,
  intervalToDuration,
  subMonths,
} from 'date-fns';
import format from 'date-fns/format';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useEventList } from '../../providers/EventListProvider';
import { useApp } from './../../providers/AppProvider';
import classes from './List.module.css';

const List: FC = () => {
  const { state: appState } = useApp();
  const { state: eventListState, actions: eventListActions } = useEventList();
  const { loading, items, currentDate } = eventListState;
  const { insert, remove, list, nextMonth, prevMonth } = eventListActions;

  const history = useHistory();

  if (!appState.isLoggedIn) {
    history.push('/login');
  }

  useEffect(() => {
    if (appState.isLoggedIn) {
      list();
    }
  }, [list, appState.isLoggedIn]);

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
            {items.length
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
                        Del
                      </button>
                    </div>
                  );
                })
              : 'No hours!'}
          </div>
          <div className={classes.terminalContainer}>
            <Formik
              initialValues={{ command: getDate(currentDate) + ' ' }}
              onSubmit={handleInsert}
            >
              <Form>
                <div className={classes.terminal}>
                  <Field
                    autocomplete='off'
                    name='command'
                    validate={(command: string) => {
                      let error;
                      const maxDay = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        0
                      ).getDate();

                      const regex = new RegExp(
                        /^[0-9]{1,2} [0-9]{2,4} [0-9]{2,4}$/g
                      );

                      if (!regex.test(command)) {
                        error =
                          'Invalid value provided "14 1300 1400" <day starthour endhour>!';
                      } else {
                        const [day, start, end] = command.split(' ');
                        const dayNumber = Number.parseInt(day);

                        if (dayNumber > maxDay || dayNumber < 1) {
                          error = 'Invalid day value!';
                        }
                      }
                      return error;
                    }}
                  />
                  <button type='submit'>SEND</button>
                </div>
                <ErrorMessage name='command'>
                  {(msg) => <div className={classes.error}>{msg}</div>}
                </ErrorMessage>
              </Form>
            </Formik>
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default List;
