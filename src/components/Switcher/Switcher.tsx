import { addMonths, format, subMonths } from 'date-fns';
import React, { FC } from 'react';
import { useAppState } from '../../providers/AppProvider/provider';
import {
  useEventListActions,
  useEventListState,
} from '../../providers/EventListProvider/provider';
import classes from './Switcher.module.css';

const Switcher: FC = () => {
  const appState = useAppState();
  const state = useEventListState();
  const actions = useEventListActions(appState);
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
