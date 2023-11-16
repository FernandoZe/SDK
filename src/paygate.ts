import { logger, phoneNumberWithoutHyphens } from './utils/helpers';
import { account, lib } from './configs';
import { payOrderSchema } from './schemas';
import { Order, Payment, AccountState } from './interfaces';
import { ENDPOINTS, ENVIRONMENTS } from './utils/constants';

import http from './services/http';
import { getCountriesAndStates } from './services/locations';
import { IEnvironments } from './interfaces/utils/environments.interface';
import { PaymentMethodHandler } from './services/payment-method.handler';

const configure_ecommerce = (_id: string, token = '', environment = ENVIRONMENTS.PRODUCTION): void => {
  const endpoint = ENDPOINTS[environment.toUpperCase() as keyof IEnvironments];

  if (!endpoint) {
    throw new Error('Ambiente no configurado correctamente');
  }

  lib.setID(_id);
  lib.setToken(token);
  lib.setEndpoint(endpoint);
};

const debug = (show: boolean): void => {
  lib.setDebug(show);
};

const language = (language: string): void => {

  if (lib.state.debug) {
    logger('Set language', language);
  }

  lib.setLanguage(language);
};

const configure_link = (payload: AccountState, environment = ENVIRONMENTS.PRODUCTION): void => {

  const { _id, token, language }: any = payload;
  const endpoint = ENDPOINTS[environment.toUpperCase() as keyof IEnvironments];

  if (!endpoint) {
    throw new Error('Ambiente no configurado correctamente');
  }

  if (token) {
    lib.setToken(token);
  }

  lib.setID(_id);
  lib.setEndpoint(endpoint);
  lib.setEnvironment(environment);
  lib.setLanguage(language || 'en');
};

const payOrder = async (data: Order): Promise<any> => {

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {

    try {
      if (!lib.state._id) {
        throw new Error('Cuenta no configurada.');
      }

      await http.getAccountServices(data);

      const payload = {
        ...data,
        sess: account.state.antiFraud?.isActive ? (window as any).ka.sessionId : null
      };

      if (payload.hashTransaction) {
        payload.type = 'REDIRECT';
      } else if (payload.paymentLinkId) {
        payload.type = 'PAYMENT_LINK';
      } else {
        payload.type = 'PAYMENT';
      }

      await payOrderSchema.validate({ ...payload, ...account.state });
      payload.mobilePhone = phoneNumberWithoutHyphens(payload.mobilePhone);

      const { service3DS } = account.state;

      let response3DS;

      if (service3DS?.isActive) {
        const paymentMethod = new PaymentMethodHandler();
        response3DS = await paymentMethod.process(service3DS, payload);
      }

      if (response3DS && response3DS?.isValidated === false) {
        throw new Error('Error de validación de la tarjeta');
      }

      const paymentData: Payment = { ...payload, response3DS, service3DS: { isActive: service3DS?.isActive, type: service3DS?.type }};

      const transaction = await http.makePayment(paymentData);

      resolve(transaction);

    } catch (error) {
      const { message } = error as Error;
      logger(message);
      reject(error);
    }
  });
};

export {
  debug,
  payOrder,
  language,
  configure_link,
  configure_ecommerce,
  getCountriesAndStates,
};
