import { Method, AxiosRequestHeaders } from 'axios';
import { Order, Payment } from '../index';

export interface Http {
  url: string;
  data?: any;
  method?: Method;
  headers?: any;
}

export interface HttpCybersource<T> {
  url: string;
  options: {
    headers: AxiosRequestHeaders,
    method: Method,
    data?: T;
  }
}

export type ConfigRequest = {
  data: any;
  method: Method;
  url: string;
  headers: {
    date: string;
    vcMerchantId: string;
    signature: string;
    digest: string;
    host: string
  };
}

export interface Api {
  getAccountServices(data: Order): Promise<void | Error>;
  generateToken(payload: any): Promise<any | Error>;
  makePayment(data: Payment): Promise<any | Error>;
  cardinalLookupRequest(data: Order): Promise<any | Error>;
  cardinalDecode(data: { token: string }): Promise<any | Error>;

  cybersourceRequest(config: ConfigRequest): Promise<any>;
}
