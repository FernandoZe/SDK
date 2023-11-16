import { CARDINAL_CREDENTIALS, CYBERSOURCE_CREDENTIALS, KOUNT_CREDENTIALS } from '../interfaces/credentials';

export interface LibState {
  _id: string;
  token: string;
  debug: boolean;
  endpoint: string;
  notification: boolean;
  environment: string,
  kountSessionID?: string,
  language?: string;
}

export interface Lib {
  state: LibState;

  setID(_id: string): void;

  setToken(token: string): void;

  setDebug(debug: boolean): void;

  setEndpoint(endpoint: string): void;

  setNotification(status: boolean): void;

  setEnvironment(environment: string): void;

  setKountSessionID(sessionID: string): void;

  setLanguage(language: string): void;
}

type AntiFraud = {
  isActive: boolean;
  merchantID: string;
  ddcUrl: string;
}

export interface AccountState {
  _id: string | null;
  token?: string;
  displayName: string | null;
  commercialName: string | null;
  isActive: boolean;
  terminal: string;
  antiFraud: AntiFraud;
  service3DS?: {
    isActive: boolean;
    type?: 'CARDINAL' | 'CYBERSOURCE' | 'KOUNT';
    credentials?: CARDINAL_CREDENTIALS | CYBERSOURCE_CREDENTIALS | KOUNT_CREDENTIALS | undefined;
    jwt?: string | undefined;
    referenceId?: string | undefined;
    orderNumber?: string | undefined;
  };
}

export interface Account {
  state: AccountState;

  setData(account: AccountState): void;
}
