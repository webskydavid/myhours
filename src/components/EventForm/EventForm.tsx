import { FC } from 'react';
import { format, getDate } from 'date-fns';
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
    console.log(command);

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

                const regex = new RegExp(/^[0-9]{1,2} [0-9]{2,4} [0-9]{2,4}$/g);

                if (!regex.test(command)) {
                  error =
                    'Invalid value provided "14 1300 1400" <day starthour endhour>!';
                } else {
                  const [day] = command.split(' ');
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
  ) : null;
};

export default EventForm;
