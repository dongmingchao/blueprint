import { AsyncStorage } from '@solid-primitives/storage';
import localforage from 'localforage';

export const storage: AsyncStorage = {
  getItem: function (key: string): string | Promise<string | null> | null {
    return localforage.getItem(key);
  },
  setItem: function (key: string, value: string): void | Promise<void> {
    return localforage.setItem(key, value).then();
  },
  removeItem: function (key: string): void | Promise<void> {
    return localforage.removeItem(key);
  },
  key: function (index: number): string | Promise<string | null> | null {
    return localforage.key(index);
  },
  get length() {
    return localforage.length();
  }
};
