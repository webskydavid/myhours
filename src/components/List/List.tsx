import { addMonths, intervalToDuration, subMonths } from 'date-fns';
import format from 'date-fns/format';
import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAppState } from '../../providers/AppProvider/provider';
import { useEventList } from '../../providers/EventListProvider';
import Event from '../Event/Event';
import EventForm from '../EventForm/EventForm';
import SelectCalendar from '../SelectCalendar/SelectCalendar';
import Switcher from '../Switcher/Switcher';
import classes from './List.module.css';

const List: FC = () => {
  const [editEvent, setEditEvent] = useState<any | null>({
    event: null,
    edit: false,
  });
  const appState = useAppState();
  const { state: eventListState, actions: eventListActions } = useEventList();
  const { loading, items, currentDate, calendarId } = eventListState;
  const { insert, remove, list, calendarList: calendar } = eventListActions;

  const history = useHistory();

  useEffect(() => {
    if (!appState.isAuthenticated) {
      history.push('/login');
    }
  }, [appState.isAuthenticated, history]);

  useEffect(() => {
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

  const handleEdit = (event: any) => {
    setEditEvent((e: any) => ({
      event,
      edit: !e.edit,
    }));
  };

  return (
    <div>
      <SelectCalendar />
      <Switcher />
      {!loading ? (
        <>
          <div className={classes.list}>
            {!!items.length
              ? items.map((event: any, index: number) => (
                  <Event
                    key={event.id}
                    event={event}
                    edit={editEvent}
                    index={index}
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                  />
                ))
              : 'No hours!'}
          </div>
          <div className={classes.terminalContainer}>
            <EventForm
              classes={classes}
              currentDate={currentDate}
              handleInsert={handleInsert}
              editEvent={editEvent}
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
