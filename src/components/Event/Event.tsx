import { differenceInMinutes, format } from 'date-fns';
import { useAtom } from 'jotai';
import { FC, useState } from 'react';
import { removeEventAtom, selectedEventAtom } from '../../atoms/event';
import { IEvent } from '../../models/event';
import classes from './Event.module.css';

interface Props {
  event: IEvent;
  index: number;
}

const Event: FC<Props> = ({ event }) => {
  const [, removeEvent] = useAtom(removeEventAtom);
  const [selected, setSelected] = useAtom(selectedEventAtom);
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);

  return (
    <>
      {event.divider ? <div className={classes.divider}></div> : null}
      <div
        className={
          selected?.id! === event.id ? classes.eventSelected : classes.event
        }
        onClick={() => {
          if (selected) {
            if (selected.id === event.id) {
              setSelected(null);
            } else {
              setSelected(event);
            }
          } else {
            setSelected(event);
          }
        }}
      >
        <div className={classes.date}>{format(start, 'dd - EE LL yyyy')}</div>
        <div className={classes.start}>{format(start, 'HH:mm')}</div>
        <div className={classes.end}>{format(end, 'HH:mm')}</div>
        <div className={classes.hours}>
          {(differenceInMinutes(end, start) / 60).toFixed(2)}h
        </div>
        <button
          className={classes.action}
          onClick={() => removeEvent(event.id)}
        >
          x
        </button>
      </div>
    </>
  );
};

export default Event;
