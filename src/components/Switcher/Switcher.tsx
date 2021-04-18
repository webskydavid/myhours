import { addMonths, format, subMonths } from 'date-fns';
import React, { FC } from 'react';
import { useEventList } from '../../providers/EventListProvider';
import classes from './Switcher.module.css';

const Switcher: FC = () => {
  const { state, actions } = useEventList();
  const { currentDate } = state;
  const { nextMonth, prevMonth } = actions;
  return (
    <div className={classes.root}>
      <button onClick={prevMonth}>
        {format(subMonths(currentDate, 1), 'MMMM')}
      </button>
      <span>{format(currentDate, 'MMMM yyyy')}</span>
      <button onClick={nextMonth}>
        {format(addMonths(currentDate, 1), 'MMMM')}
      </button>
    </div>
  );
};

export default Switcher;
