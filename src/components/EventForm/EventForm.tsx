import { FC } from 'react';
import { format, getDate } from 'date-fns';
import { ErrorMessage, Field, Form, Formik } from 'formik';

interface Props {
  classes: { [key: string]: string };
  handleInsert: (values: any) => void;
  currentDate: Date;
  editEvent: any;
}

const EventForm: FC<Props> = ({
  classes,
  handleInsert,
  currentDate,
  editEvent,
}) => {
  const command = editEvent.event
    ? format(new Date(editEvent.event.start.dateTime), 'dd HHmm') +
      ' ' +
      format(new Date(editEvent.event.end.dateTime), 'HHmm')
    : '';

  return (
    <Formik
      initialValues={{
        command: editEvent.edit ? command : getDate(currentDate) + ' ',
      }}
      enableReinitialize={true}
      onSubmit={handleInsert}
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
  );
};

export default EventForm;
