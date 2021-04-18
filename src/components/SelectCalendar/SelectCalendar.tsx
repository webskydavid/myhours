import { Field, Form, Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useAppState } from '../../providers/AppProvider/provider';
import {
  useEventListActions,
  useEventListState,
} from '../../providers/EventListProvider/provider';

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
  const appState = useAppState();
  const state = useEventListState();
  const actions = useEventListActions(appState);

  useEffect(() => {
    if (id && exists) {
      console.log('setCalendarId useEffect', id, exists);

      actions.setCalendarId(id);
    }
  }, [actions, exists, id]);

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
