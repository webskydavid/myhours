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
  statusAtom,
  totalErningsAtom,
  totalHoursAtom,
} from '../../atoms/event';
import { IEvent } from '../../models/event';
import Event from '../Event/Event';
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

  const history = useHistory();

  useEffect(() => {
    if (calendarId === '') {
      history.push('/select');
    }
  }, [calendarId, history]);

  useEffect(() => {
    getEventList();
  }, [getEventList, currentDate]);

  return (
    <div className={classes.root}>
      <Switcher />
      {/* {status === 'BUSY' ? 'Loading...' : ''} */}
      <>
        <div className={classes.list}>
          {!!items.length
            ? items.map((event: IEvent, index: number) => {
                return <Event key={event.id} event={event} index={index} />;
              })
            : 'No hours!'}
        </div>
        <div className={classes.footer}>
          <div>{items.length ? `Total hours: ${totalHours}` : '0.00h'}</div>
          {showErnings ? (
            <div>
              {items.length
                ? `Total net erning: ${totalErnings} ${currency}`
                : `0.00 ${currency}`}
            </div>
          ) : null}
        </div>
      </>
    </div>
  );
};

export default List;
