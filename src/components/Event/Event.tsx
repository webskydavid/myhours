import {
  differenceInHours,
  differenceInMinutes,
  format,
  intervalToDuration,
} from 'date-fns';
import React, { FC, useState } from 'react';
import { IEvent } from '../../models/event';
import classes from './Event.module.css';

interface Props {
  event: IEvent;
  index: number;
  onEdit: (event: any) => void;
  onRemove: (id: string) => void;
}

const Event: FC<Props> = ({ event, index, onEdit, onRemove }) => {
  const [selectedEvent, setSelectedEvent] = useState(event);
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);

  return (
    <>
      {event.divider ? <div className={classes.divider}></div> : null}
      <div
        className={
          selectedEvent.selected ? classes.eventSelected : classes.event
        }
        onClick={() => {
          setSelectedEvent((e) => ({ ...e, selected: !e.selected }));
        }}
      >
        <div className={classes.date}>{format(start, 'yyyy-MM-dd')}</div>
        <div className={classes.start}>{format(start, 'HH:mm')}</div>
        <div className={classes.end}>{format(end, 'HH:mm')}</div>
        <div className={classes.hours}>
          {(differenceInMinutes(end, start) / 60).toFixed(2)}h
        </div>
        <button className={classes.action} onClick={() => onRemove(event.id)}>
          Delete
        </button>
      </div>
    </>
  );
};

export default Event;
