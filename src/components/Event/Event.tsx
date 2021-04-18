import { format, intervalToDuration } from 'date-fns';
import React, { FC } from 'react';
import { IEvent } from '../../models/event';
import classes from './Event.module.css';

interface Props {
  event: IEvent;
  edit: any;
  index: number;
  onEdit: (event: any) => void;
  onRemove: (id: string) => void;
}

const Event: FC<Props> = ({ event, edit, index, onEdit, onRemove }) => {
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  const isEdit = edit.edit && edit.event?.id === event.id;
  console.log(edit, isEdit);

  return (
    <div
      className={
        isEdit
          ? classes.eventSelected
          : index % 2 === 0
          ? classes.event
          : classes.eventEven
      }
      onClick={() => onEdit(event)}
    >
      <div className={classes.date}>{format(start, 'yyyy-MM-dd')}</div>
      <div className={classes.start}>{format(start, 'HH:mm')}</div>
      <div className={classes.end}>{format(end, 'HH:mm')}</div>
      <div className={classes.hours}>
        {intervalToDuration({ start, end }).hours}:
        {intervalToDuration({ start, end }).minutes}
      </div>
      <button className={classes.action} onClick={() => onRemove(event.id)}>
        Delete
      </button>
    </div>
  );
};

export default Event;
