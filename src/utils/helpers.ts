import CryptoES from 'crypto-es';
import { Order } from 'src/interfaces';
import { lib } from '../configs';

const { state } = lib;

const numerize = (number: number | string): number => Number(String(number).replace(/[^0-9.-]+/g, ''));
const logger = (message: string, data: any = undefined): void => {
  if (state.debug) {
    message = `[PAYGATE]: ${message}`;

    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};
const expirationDateWithHyphens = (expirationDate: string): string => String(expirationDate).replace('/', '-').replace(/\s/g, '');

const removeExtraFieldsPayload = (payload: any): Order => {

  const extra_fields = ['apiKey', 'orgUnitId', 'endpoint', 'type', 'hashTransaction', 'paymentLinkId', 'cardinal', 'createdAt', 'status', 'tax'];
  const tempPayload = { ...payload };

  extra_fields.forEach( field => delete tempPayload[field]);

  return tempPayload;
};

const phoneNumberWithoutHyphens = (phoneNumber: string): string => phoneNumber.replace(/[^+\d.]/g, '');

const hashMD5 = (plainText: string): string => CryptoES.MD5(plainText).toString(CryptoES.enc.Hex);

export { numerize, logger, expirationDateWithHyphens, removeExtraFieldsPayload, phoneNumberWithoutHyphens, hashMD5 };
