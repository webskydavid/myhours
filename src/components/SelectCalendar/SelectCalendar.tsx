import { Field, Form, Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
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

  return { id };
};

const SelectCalendar: FC = () => {
  const { id } = useLocalStorage();
  const appState = useAppState();
  const { loading, calendarList } = useEventListState();
  const actions = useEventListActions(appState);
  const history = useHistory();

  useEffect(() => {
    actions.calendarList();
  }, []);

  useEffect(() => {
    if (id) {
      history.push('/');
    }
  }, [id, history]);

  return (
    <>
      <h4>Select one calendar:</h4>
      <div>
        {!loading
          ? calendarList.map((calendar) => {
              return (
                <div
                  key={calendar.id}
                  onClick={() => {
                    console.log('select', calendar.id);
                    actions.setCalendarId(calendar.id);
                  }}
                >
                  {calendar.summary}
                </div>
              );
            })
          : 'Progressing...'}
      </div>

      {!calendarList.length ? (
        <>
          <h4>No calendar found</h4>
          <button
            type='button'
            onClick={actions.insertCalendar}
            disabled={loading}
          >
            Add calendar
          </button>
        </>
      ) : null}
    </>
  );
};

export default SelectCalendar;
