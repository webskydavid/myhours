import { FC } from 'react';
import { format, getDate, isAfter, isValid } from 'date-fns';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useAtom } from 'jotai';
import { currentDateAtom } from '../../atoms/app';
import classes from './EventForm.module.css';
import {
  getCommandAtom,
  insertEventAtom,
  selectedEventAtom,
  updateEventAtom,
} from '../../atoms/event';
import { userAtom } from '../../atoms/user';
import { useLocation } from 'react-router';

const EventForm: FC = () => {
  const [user] = useAtom(userAtom);

  const [selected] = useAtom(selectedEventAtom);
  const [command] = useAtom(getCommandAtom);
  const [currentDate] = useAtom(currentDateAtom);
  const [, insert] = useAtom(insertEventAtom);
  const [, update] = useAtom(updateEventAtom);

  const location = useLocation();

  const handleInsert = (values: any) => {
    console.log(values);

    if (command) {
      update({ id: selected?.id, command: values.command });
    } else {
      insert(values.command);
    }
  };

  return user.isAuthenticated && location.pathname === '/' ? (
    <div className={classes.root}>
      <Formik
        initialValues={{
          command: command ? command : getDate(currentDate) + ' ',
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          resetForm();
          return handleInsert(values);
        }}
      >
        <Form>
          <div className={classes.terminal}>
            <Field
              type='tel'
              autoComplete='off'
              name='command'
              validate={(command: string) => {
                let error;
                const maxDay = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  0
                ).getDate();

                const regex = new RegExp(/^[0-9]{1,2} [0-9]{3,4} [0-9]{3,4}$/g);

                if (!regex.test(command)) {
                  error =
                    'Invalid value provided "14 1300 1400" <day starthour endhour>!';
                } else {
                  const y = format(currentDate, 'yyyy');
                  const m = format(currentDate, 'MM');
                  const [day, s, e] = command.split(' ');
                  const sH = `${s.length < 4 ? '0' : ''}${s.slice(
                    -4,
                    s.length / 2
                  )}:${s.slice(-2)}:00Z`;
                  const eH = `${e.length < 4 ? '0' : ''}${e.slice(
                    -4,
                    e.length / 2
                  )}:${e.slice(-2)}:00Z`;
                  const sDate = `${y}-${m}-${day}T${sH}`;
                  const eDate = `${y}-${m}-${day}T${eH}`;
                  const dayNumber = Number.parseInt(day);

                  if (!isValid(new Date(sDate)) || !isValid(new Date(eDate))) {
                    error = 'Invalid date format.';
                  }

                  if (dayNumber > maxDay || dayNumber < 1) {
                    error = 'Invalid day value.';
                  }
                  if (isAfter(new Date(sDate), new Date(eDate))) {
                    error =
                      'The starting hour cannot be less than the ending hour.';
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
  ) : null;
};

export default EventForm;
