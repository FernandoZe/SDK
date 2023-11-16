import { Account, AccountState, Order } from '../interfaces';

/*
paste this into a file called env_tests.json  in the root directory
{
  "token": "",
  "safeIdentifier": "",
  "endpoint":""
}
*/

/**
 * Cybersource Test card
 * safeIdentifier - cvv - validThru
 * 4111 1111 1111 1111 
 * 4622 9431 2701 3705 - 838 - 12/22
 * 4622 9431 2701 3713 - 043 - 12/22
 * 4622 9431 2701 3721 - 258 - 12/22
 * 4622 9431 2701 3739 - 942 - 12/22
 * 4622 9431 2701 3747 - 370 - 12/22
 */

import { token, endpoint, safeIdentifier } from '../../env_tests.json';

export const cardinalMock = (callbackResponse: any) => ({
  Cardinal: {
    configure: () => ({}),
    setup: (step: any, token: any) => ({}),
    on: (e: any, cb: any) => (cb(callbackResponse)),
    continue: (type: string, auth: any, details: any) => ({ type, auth, details })
  }
});

export const kountMock = (callbackResponse: any) => ({
  Kount: {
    ClientSDK: () => ({}),
    autoLoadEvents: () => ({})
  } 
});

export const ORDER_FIXTURE: Order = {
  cvv: '838',
  amount: 200,
  lastName: 'Casas',
  validThru: '1222',
  firstName: 'Mario',
  orderNumber: '10203040',
  mobilePhone: '87998877',
  billingCountryCode: '402',
  description: 'Pago deudas',
  billingAddress1: 'Ojojona',
  billingCity: 'Tegucigalpa',
  customerName: 'Jorge Sandres',
  email: 'jorgesandres@gmail.com',
  billingState: 'Francisco Morazán',
  safeIdentifier,
  referenceId: '102020202',
  shippingMethodIndicator: '07'
};

export const MOCK_ACCOUNT_STATE: AccountState = {
  _id: 'qwerty',
  displayName: 'ACCOUNT_TEST',
  commercialName: 'ACCOUNT_TEST',
  isActive: true,
  terminal: '',
  antiFraud: {
    isActive: true, 
    merchantID: 'clinpays',
    ddcUrl: ''
  },
  service3DS: {
    isActive: true,
    type: 'CARDINAL',
    credentials: {
      endpoint: '',
      apiKey: '',
      merchantId: '',
      transactionPwd: '',
      processorId: '',
      apiIdentifier: '',
      orgUnitId: '',
    },
    jwt: 'asdcer45gdc'
  }
};

export const MOCK_ACCOUNT_CYBERSOURCE: AccountState = {
  _id: 'qwerty',
  displayName: 'ACCOUNT_TEST',
  commercialName: 'ACCOUNT_TEST',
  isActive: true,
  terminal: '',
  antiFraud: {
    isActive: true,
    merchantID: 'clinpays',
    ddcUrl: ''
  },
  service3DS: {
    isActive: true,
    type: 'CYBERSOURCE',
    credentials: {
      endpoint: 'apitest.cybersource.com',
      apiKey: '37b17f49-5097-4780-8e15-21679f82076f',
      secretKey: 'Bf4slaTyMFHTnDlKXxJZFNzmklY6zUfws2ovoFAk8Y8=',
      merchantId: 'clinpays',
      transactionPwd: '',
      processorId: '',
      apiIdentifier: '',
      orgUnitId: '',
    },
    jwt: 'asdcer45gdc'
  }
};

export const CYBERSOURCE_CREDENTIALS = {
  keyId: '37b17f49-5097-4780-8e15-21679f82076f',
  secretKey: 'Bf4slaTyMFHTnDlKXxJZFNzmklY6zUfws2ovoFAk8Y8=',
  merchantId: 'emsanchez'
};

export const KOUNT_CREDENTIALS = {
  ddcUrl: 'https://www.kount.github.io',
  merchantID: 'clinpays'
};

export const ACCOUNT_FIXTURE: { token: string, endpoint: string } = {
  token,
  endpoint
};
