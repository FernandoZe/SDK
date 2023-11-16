import { Account, AccountState, Lib } from './interfaces';

const lib: Lib = {
  state: {
    _id: '',
    token: '',
    debug: false,
    notification: true,
    language: undefined,
    endpoint: 'https://api.paygatehn.com',
    environment: 'PRODUCTION',
  },
  setID: function (_id: string) {
    this.state._id = _id;
  },
  setToken: function (token: string) {
    this.state.token = token;
  },
  setDebug: function (debug = false) {
    this.state.debug = debug;
  },
  setEndpoint: function (endpoint: string) {
    this.state.endpoint = endpoint;
  },
  setNotification: function (status = false) {
    this.state.notification = status;
  },
  setEnvironment: function (environment: string) {
    this.state.environment = environment;
  },
  setKountSessionID: function (sessionID: string) {
    this.state.kountSessionID = sessionID;
  },
  setLanguage(language: string) {
    this.state.language = language;
  }
};

const account: Account = {
  state: {
    _id: null,
    isActive: false,
    commercialName: '',
    displayName: null,
    terminal: '',
    antiFraud: {
      isActive: false,
      merchantID: '',
      ddcUrl: ''
    },
    service3DS: {
      isActive: false
    }
  },
  setData(account: AccountState) {
    this.state = {
      ...this.state,
      ...account
    };
  }
};

export { lib, account };
