import { differenceInMinutes } from 'date-fns';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { currentDateAtom } from '../../atoms/app';
import {
  eventListAtom,
  getEventListAtom,
  insertEventAtom,
  statusAtom,
} from '../../atoms/event';
import { IEvent } from '../../models/event';
import Event from '../Event/Event';
import EventForm from '../EventForm/EventForm';
import Switcher from '../Switcher/Switcher';
import classes from './List.module.css';

const List: FC = () => {
  const [status] = useAtom(statusAtom);
  const [items] = useAtom(eventListAtom);
  const [currentDate] = useAtom(currentDateAtom);
  const [, getEventList] = useAtom(getEventListAtom);
  const [, insertAtom] = useAtom(insertEventAtom);

  useEffect(() => {
    getEventList();
  }, [getEventList, currentDate]);

  const handleInsert = (values: any) => {
    insertAtom(values.command);
  };

  return (
    <div>
      <Switcher />
      {status === 'BUSY' ? 'Loading...' : ''}
      <>
        <div className={classes.list}>
          {!!items.length
            ? items.map((event: IEvent, index: number) => {
                return <Event key={event.id} event={event} index={index} />;
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
          <EventForm classes={classes} handleInsert={handleInsert} />
        </div>
      </>
    </div>
  );
};

export default List;
