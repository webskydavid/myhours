import { differenceInMinutes, format } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IEvent } from '../../models/event';
import { useAppState } from '../../providers/AppProvider/provider';
import {
  useEventListActions,
  useEventListState,
} from '../../providers/EventListProvider/provider';
import Event from '../Event/Event';
import EventForm from '../EventForm/EventForm';
import Switcher from '../Switcher/Switcher';
import classes from './List.module.css';

const List: FC = () => {
  const appState = useAppState();
  const eventListState = useEventListState();
  const eventListActions = useEventListActions(appState);
  const { loading, items, currentDate, calendarId } = eventListState;
  const { insert, remove, list } = eventListActions;

  const history = useHistory();

  useEffect(() => {
    if (!appState.isAuthenticated) {
      history.push('/login');
    }
  }, [appState.isAuthenticated, history]);

  useEffect(() => {
    if (appState.isAuthenticated) {
      list();
    }
  }, [list, appState.isAuthenticated, calendarId]);

  const handleInsert = (values: any) => {
    insert(values.command);
  };

  const handleRemove = (id: string) => {
    remove(id);
  };

  const handleEdit = (event: any) => {};

  return (
    <div>
      <Switcher />
      {loading ? 'Loading...' : ''}
      <>
        <div className={classes.list}>
          {!!items.length
            ? items.map((event: IEvent, index: number) => {
                return (
                  <Event
                    key={event.id}
                    event={event}
                    index={index}
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                  />
                );
              })
            : 'No hours!'}
        </div>
        <div>
          {items.length
            ? 'Total hours: ' +
              (
                items.reduce((prev, val) => {
                  const start = new Date(val.start.dateTime);
                  const end = new Date(val.end.dateTime);
                  return prev + differenceInMinutes(end, start);
                }, 0) / 60
              ).toFixed(2)
            : '0.00h'}
        </div>
        <div className={classes.terminalContainer}>
          <EventForm
            classes={classes}
            currentDate={currentDate}
            handleInsert={handleInsert}
          />
        </div>
      </>
    </div>
  );
};

export default List;
