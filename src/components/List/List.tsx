import { differenceInMinutes } from 'date-fns';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  currencyAtom,
  currentDateAtom,
  showErningsAtom,
} from '../../atoms/app';
import { calendarIdAtom } from '../../atoms/calendar';
import {
  eventListAtom,
  getEventListAtom,
  insertEventAtom,
  statusAtom,
  totalErningsAtom,
  totalHoursAtom,
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
  const [calendarId] = useAtom(calendarIdAtom);
  const [totalHours] = useAtom(totalHoursAtom);
  const [totalErnings] = useAtom(totalErningsAtom);
  const [showErnings] = useAtom(showErningsAtom);
  const [currency] = useAtom(currencyAtom);
  const [, getEventList] = useAtom(getEventListAtom);
  const [, insertAtom] = useAtom(insertEventAtom);
  const history = useHistory();

  useEffect(() => {
    if (calendarId === '') {
      history.push('/select');
    }
  }, []);

  useEffect(() => {
    getEventList();
  }, [getEventList, currentDate]);

  const handleInsert = (values: any) => {
    insertAtom(values.command);
  };

  return (
    <div className={classes.root}>
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
        <div>{items.length ? `Total hours: ${totalHours}` : '0.00h'}</div>
        {showErnings ? (
          <div>
            {items.length
              ? `Total erning: ${totalErnings} ${currency}`
              : `0.00 ${currency}`}
          </div>
        ) : null}

        <EventForm handleInsert={handleInsert} />
      </>
    </div>
  );
};

export default List;
