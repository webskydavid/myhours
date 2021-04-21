import { atom } from 'jotai';

export const statusAtom = atom<'IDLE' | 'BUSY'>('IDLE');
export const errorAtom = atom<string | null>(null);

export const userAtom = atom<any | null>({
  token: '',
  isAuthenticated: false,
});

export const signInAtom = atom<null, any>(null, (get, set, tokenObj) => {
  const run = async () => {
    set(errorAtom, null);
    set(statusAtom, 'BUSY');
    try {
      set(userAtom, {
        isAuthenticated: true,
        token: tokenObj.access_token,
      });
      set(statusAtom, 'IDLE');
    } catch (e) {
      set(errorAtom, e);
      set(statusAtom, 'IDLE');
    }
  };
  run();
});

export const signOutAtom = atom<null, void>(null, (get, set) => {
  const run = async () => {
    set(errorAtom, null);
    set(statusAtom, 'BUSY');
    set(userAtom, {
      isAuthenticated: false,
      token: '',
    });
    set(statusAtom, 'IDLE');
  };
  run();
});

export const signInFailureAtom = atom<null, void>(null, (get, set) => {
  set(errorAtom, 'SignIn failure!');
});
