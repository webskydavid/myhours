import { atom } from 'jotai';

const showErnings = localStorage.getItem('showErnings') === 'true';
const netPricePerH = localStorage.getItem('netPricePerH') || '0';
const vat = localStorage.getItem('vat') || '0';
const darkTheme = localStorage.getItem('darkTheme') === 'true';
const currency = localStorage.getItem('currency') || '';

export const currentDateAtom = atom<Date>(new Date());

export const showErningsAtom = atom<boolean>(showErnings);
export const netPricePerHAtom = atom<number>(Number.parseInt(netPricePerH));
export const vatAtom = atom<number>(Number.parseInt(vat));
export const darkThemeAtom = atom<boolean>(darkTheme);
export const currencyAtom = atom<string>(currency);

export const setShowErningsAtom = atom(null, (get, set, value: boolean) => {
  localStorage.setItem('showErnings', String(value));
  console.log('setShowErningsAtom', value);
  set(showErningsAtom, value);
});

export const setNetPricePerHAtom = atom(null, (get, set, value: number) => {
  localStorage.setItem('netPricePerH', String(value));
  set(netPricePerHAtom, value);
});

export const setVatAtom = atom(null, (get, set, value: number) => {
  localStorage.setItem('vat', String(value));
  set(vatAtom, value);
});

export const setDarkThemeAtom = atom(null, (get, set, value: boolean) => {
  localStorage.setItem('darkTheme', String(value));
  console.log('setDarkThemeAtom', value);
  set(darkThemeAtom, value);
});

export const setCurrencyAtom = atom(null, (get, set, value: string) => {
  localStorage.setItem('currency', String(value));

  set(currencyAtom, value);
});
