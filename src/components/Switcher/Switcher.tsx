import { addMonths, format, subMonths } from 'date-fns';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { currentDateAtom } from '../../atoms/app';
import { nextMonthAtom, prevMonthAtom } from '../../atoms/calendar';
import classes from './Switcher.module.css';

const Switcher: FC = () => {
  const [currentDate] = useAtom(currentDateAtom);
  const [, nextMonth] = useAtom(nextMonthAtom);
  const [, prevMonth] = useAtom(prevMonthAtom);

  return (
    <div className={classes.root}>
      <button className={classes.switch} onClick={prevMonth}>
        {format(subMonths(currentDate, 1), 'MMMM')}
      </button>
      <span>{format(currentDate, 'MMMM yyyy')}</span>
      <button className={classes.switch} onClick={nextMonth}>
        {format(addMonths(currentDate, 1), 'MMMM')}
      </button>
    </div>
  );
};

export default Switcher;
