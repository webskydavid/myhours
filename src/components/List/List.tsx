import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useEventList } from '../../providers/EventListProvider';
import { useApp } from './../../providers/AppProvider';
import classes from './List.module.css';

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

const getWorkTime = (start: Date, end: Date) => {
  return Math.abs(end.getTime() - start.getTime()) / 3600000;
};

const List: FC = () => {
  const { state: appState } = useApp();
  const { state: eventListState, actions: eventListActions } = useEventList();
  const { loading, items, currentDate, month } = eventListState;
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
      <h4>
        <button onClick={setPrevMonth}>{months[month - 1]}</button>
        {months[month]}
        <button onClick={setNextMonth}>{months[month + 1]}</button>
        {currentDate.toISOString()}
      </h4>
      {!loading ? (
        <div className={classes.list}>
          {items.length
            ? items.map((event: any) => {
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
                    <button onClick={() => handleRemove(event.id)}>X</button>
                  </div>
                );
              })
            : 'No hours!'}

          <div className={classes.event}>
            <Formik
              initialValues={{ command: currentDate.getDate() + '' }}
              onSubmit={handleInsert}
            >
              <Form>
                <Field
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
                <ErrorMessage name='command' />
                <button type='submit'>Add</button>
              </Form>
            </Formik>
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default List;
