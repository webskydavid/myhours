import { Field, Form, Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useEventList } from '../../providers/EventListProvider';

const useLocalStorage = () => {
  const [id, setId] = useState<string | null>();
  const KEY = 'calendarId';

  useEffect(() => {
    setId(localStorage.getItem(KEY));
  }, []);

  return { exists: id && id !== null && id !== '', id };
};

const SelectCalendar: FC = () => {
  const [showSelect, setShowSelect] = useState(false);
  const { exists, id } = useLocalStorage();
  const { state, actions } = useEventList();

  useEffect(() => {
    if (id && exists) {
      actions.setCalendarId(id);
    }
  }, [exists, id]);

  return (
    <Formik
      initialValues={{ id: '' }}
      onSubmit={(values) => {
        setShowSelect(false);
        return actions.setCalendarId(values.id);
      }}
    >
      <Form>
        {!state.calendarList.length && !exists ? (
          <button type='button' onClick={actions.insertCalendar}>
            Add calendar
          </button>
        ) : null}

        {!exists || showSelect ? (
          <>
            <Field as='select' name='id'>
              <option value=''>Select calendar</option>
              {!!state.calendarList.length
                ? state.calendarList.map((calendar) => {
                    return (
                      <option key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </option>
                    );
                  })
                : null}
            </Field>
            <button type='submit'>Select</button>
          </>
        ) : null}

        {exists && !showSelect ? (
          <button
            type='button'
            onClick={() => {
              actions.calendarList();
              setShowSelect(true);
            }}
          >
            Select calendar
          </button>
        ) : null}
      </Form>
    </Formik>
  );
};

export default SelectCalendar;
