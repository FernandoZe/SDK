import axios from 'axios';

import * as service from './index';
import { logger } from '../utils/helpers';
import { account, lib } from '../configs';
import { Api, Http, Order, Payment } from '../interfaces';

const timeout = 60 * 1000;
const client = axios.create({
  timeout,
  headers: {
    'Accept': 'application/json'
  }
});

const httpRequest = async ({ url, data, method = 'GET', headers }: Http): Promise<any | void> => {

  const _headers = {
    ...headers,
    'Accept-Language': lib.state.language ?? undefined,
    Authorization: lib.state.token ? `Bearer ${lib.state.token}` : undefined
  };

  try {
    const response = await client.request({
      url,
      data,
      method,
      headers: _headers
    });

    if (response.status === 200) {
      return response.data;
    }

  } catch (error: any) {
    const { message, response } = error;

    if (response) {
      const { data = {}} = response;
      let { message } = data;

      if (message.message) {
        message = message.message;
      }
      logger('ERROR', message);
      throw new Error(message);
    } else {
      logger('ERROR', message);
      throw new Error(message);
    }

  }

};

const api: Api = {
  async generateToken({ amount, referenceId, ...payload }: any): Promise<any | Error> {
    try {
      const url = `${lib.state.endpoint}/v2/cardinal/encode`;

      const { token } = await httpRequest({ url, method: 'POST', data: { amount, referenceId, payload: { ...payload, amount }}});

      return token;

    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  },
  async cardinalLookupRequest(data: Order): Promise<any | Error> {
    try {
      const url = `${lib.state.endpoint}/v2/cardinal/lookup`;

      const result = await httpRequest({ url, method: 'POST', data: { ...data, referenceId: account.state.service3DS?.referenceId, terminal: account.state.terminal, orderNumber: account.state.service3DS?.orderNumber }});

      return result;
    }catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  },
  async cardinalDecode(payload): Promise<any | Error> {
    try {
      const data = {
        ...payload,
        account: account.state?.service3DS?.credentials
      };
      const url = `${lib.state.endpoint}/v2/cardinal/decode`;
      const result = await httpRequest({ url, method: 'POST', data: { ...data, terminal: account.state.terminal }});

      return result;
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  },
  async makePayment(payload: Payment): Promise<any | Error> {
    try {
      let url: string;

      switch (payload.type) {
        case 'REDIRECT':
          url = `${lib.state.endpoint}/payments/redirect/intentPayout/${payload.hashTransaction}`;
          break;
        case 'PAYMENT_LINK':
          url = `${lib.state.endpoint}/v2/links/checkout/${payload.paymentLinkId}/process`;
          break;
        default:
          url = `${lib.state.endpoint}/payments`;
      }

      return await httpRequest({ url, method: 'POST', data: { ...payload, paymentID: account.state.service3DS?.orderNumber, ...( account.state.terminal && { terminal: account.state.terminal }) }});
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  },
  async getAccountServices(data: Order): Promise<void | Error> {
    try {
      if (lib.state._id) {
        const url = `${lib.state.endpoint}/accounts/settings`;

        const {
          amount,
          lastName,
          validThru,
          firstName,
          channelCode,
          referenceId,
          description,
          safeIdentifier,
          currency,
          payWithHSM
        } = data;

        const accountData = await httpRequest({ url, method: 'POST', data: {
          account: lib.state._id,
          safeIdentifier,
          validThru,
          channelCode,
          referenceId,
          amount,
          firstName,
          lastName,
          description,
          currency,
          payWithHSM
        }});

        account.setData(accountData);
      }

      await service.validateService();

    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  },
  async cybersourceRequest(configs: Http): Promise<any | Error> {
    try {

      const url = `${lib.state.endpoint}/v2/cybersource/validation3DS`;

      const response = await httpRequest({
        url,
        method: 'POST',
        data: {
          ...configs
        }
      });

      return response;
    } catch (error: any) {
      const { message, response } = error;

      if (response) {
        const { data = {}} = response;
        let { message } = data;

        if (message.message) {
          message = message.message;
        }

        throw new Error(message);
      } else {
        logger('ERROR', message);
        throw new Error(message);
      }
    }
  }
};

export default api;
