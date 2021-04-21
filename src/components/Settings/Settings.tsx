import classes from './Settings.module.css';
import { useAtom } from 'jotai';
import { FC } from 'react';
import {
  darkThemeAtom,
  netPricePerHAtom,
  setDarkThemeAtom,
  setNetPricePerHAtom,
  setShowErningsAtom,
  setVatAtom,
  showErningsAtom,
  vatAtom,
  currencyAtom,
  setCurrencyAtom,
} from '../../atoms/app';
import SettingsField from './SettingsField';

const Settings: FC = () => {
  const [showErnings] = useAtom(showErningsAtom);
  const [netPricePerH] = useAtom(netPricePerHAtom);
  const [vat] = useAtom(vatAtom);
  const [darkTheme] = useAtom(darkThemeAtom);
  const [currency] = useAtom(currencyAtom);

  const [, setShowErnings] = useAtom(setShowErningsAtom);
  const [, setNetPricePerH] = useAtom(setNetPricePerHAtom);
  const [, setVat] = useAtom(setVatAtom);
  const [, setDarkTheme] = useAtom(setDarkThemeAtom);
  const [, setCurrency] = useAtom(setCurrencyAtom);

  return (
    <div className={classes.root}>
      <h3 className={classes.head}>Settings</h3>
      <div className={classes.field}>
        <SettingsField
          value={showErnings}
          name='showErnings'
          type='checkbox'
          label='Show ernings'
          onChange={setShowErnings}
        />
      </div>
      <div className={classes.field}>
        <SettingsField
          value={netPricePerH}
          name='netPricePerH'
          type='text'
          label='Net price per hour'
          onChange={setNetPricePerH}
        />
      </div>
      <div className={classes.field}>
        <SettingsField
          value={vat}
          name='vat'
          type='text'
          label='Vat'
          onChange={setVat}
        />
      </div>
      <div className={classes.field}>
        <SettingsField
          value={darkTheme}
          name='dartTheme'
          type='checkbox'
          label='Dark theme'
          onChange={setDarkTheme}
        />
      </div>
      <div className={classes.field}>
        <SettingsField
          value={currency}
          name='currency'
          type='text'
          label='Currency'
          onChange={setCurrency}
        />
      </div>
    </div>
  );
};

export default Settings;
