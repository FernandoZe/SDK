import http from '../services/http';
import { account, lib } from '../configs';
import { Order } from '../interfaces';
import { logger } from '../utils/helpers';
import { CARDINAL } from '../utils/constants';

const { ERRORS } = CARDINAL;

class Cardinal {
  public session_id: string | any;
  public order_uuid: string | null;
  public merchant_id: string | null;
  private _paymentValidatedRef: { ActionCode: string | undefined, ErrorNumber: number | undefined, ErrorDescription: string | undefined };

  protected order!: Order;
  protected token!: string;

  constructor() {
    this.session_id = null;
    this.order_uuid = null;
    this.merchant_id = 'clinpays';
    this._paymentValidatedRef = {
      ActionCode: undefined,
      ErrorNumber: undefined,
      ErrorDescription: undefined
    };
  }

  public async handle() {
    return await this.init(this.order);
  }

  public async setCredentials(token: string) {
    this.token = await this.configure(token);
  }

  public setOrder(order: Order) {
    this.order = order;
  }

  public configure(token: string): Promise<string | any> {

    return new Promise((resolve, reject) => {

      try {
        (window as any).Cardinal.configure({
          payment: {
            framework: 'cardinal'
          },
          logging: {
            level: lib.state.debug ? 'on' : 'off'
          },
          maxRequestRetries: 3,
        });

        (window as any).Cardinal.setup('init', {
          jwt: token
        });

        (window as any).Cardinal.on('payments.setupComplete', (setupCompleteData: any) => {
          logger('setup_complete', setupCompleteData);

          const { sessionId } = setupCompleteData;

          if (typeof sessionId !== undefined) {
            this.session_id = sessionId;

            resolve(this.session_id);
          } else {
            logger('Authentication error');
            reject('Authentication error');
          }

        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async init(payload: Order): Promise<any> {
    return new Promise(resolve => {
      try {
        (window as any).Cardinal.on('payments.validated', async (data: any, jwt: any) => {
          logger('PAYMENT VALIDATED', data);
          const { ActionCode, ErrorNumber, ErrorDescription } = data;
          let message;
          switch (ActionCode) {
            case 'SUCCESS':
              if (ActionCode !== this._paymentValidatedRef.ActionCode
                && ErrorNumber !== this._paymentValidatedRef.ErrorNumber
                && ErrorDescription !== this._paymentValidatedRef.ErrorDescription) {

                this._paymentValidatedRef = { ActionCode, ErrorNumber, ErrorDescription };

                try {
                  this.validateCCAToken(jwt).then(res => resolve({ isValidated: true, data: res })).catch(e => resolve({ isValidated: false, data: e }));
                } catch (e) {
                  resolve({ isValidated: false, data: e });
                }
              }
              break;

            case 'NOACTION':
              // Handle no actionable outcome
              resolve({ isValidated: false, data: { message: ERRORS.TRANSACTION_FAILED }});
              break;
            case 'FAILURE':
              // Handle failed transaction attempt
              resolve({ isValidated: false, data: { message: ERRORS.TRANSACTION_VERIFICATION_FAILED }});
              break;
            case 'ERROR':

              switch (ErrorNumber) {
                case 10001:
                case 10002:
                case 10003:
                  message = ERRORS.CONNECTION_ERROR;
                  break;
                case 10004:
                  message = ERRORS.GENERAL_ERROR;
                  break;
                case 10005:
                case 10008:
                  message = ERRORS.CONFIG_ERROR;
                  break;
                case 10007:
                  message = ERRORS.CONFIRM_CONNECTION_ERROR;
                  break;
                case 10009:
                  message = ERRORS.CONTINUE_CONNECTION_ERROR;
                  break;
                case 10010:
                  message = ERRORS.INVALID_RESPONSE;
                  break;
                case 10011:
                  message = ERRORS.CANCELED;
                  break;
                default:
                  message = ErrorDescription;
                  break;
              }

              resolve({ isValidated: false, data: { message }});
              break;
            default:
              resolve({ isValidated: false, data: { message: ERRORS.TRANSACTION_FAILED }});
          }

        });
        try {
          this.ccaLookup(payload).then(res => resolve({ isValidated: true, data: res })).catch(e => resolve({ isValidated: false, data: e }));

        } catch (e) {
          resolve({ isValidated: false, data: e });
        }
      } catch (e) {
        resolve({ isValidated: false, data: e });
      }
    });
  }

  private validateCCAToken(token: any): Promise<any> {

    return new Promise((resolve, reject) => {
      http.cardinalDecode({ token }).then(response => {
        const { Payload = {}} = response;
        const { Payment = {}} = Payload;
        const { ExtendedData = {}} = Payment;

        const { PAResStatus, SignatureVerification } = ExtendedData;

        if (SignatureVerification === 'Y') {

          if (PAResStatus === 'Y' || PAResStatus === 'A') {
            resolve(ExtendedData);
          } else {
            reject({ message: ERRORS.INCOMPLETE_AUTHENTICATION });
          }
        } else {
          reject({ message: ERRORS.TRANSACTION_VERIFICATION_FAILED });
        }
      }).catch(({ message }) => {
        reject({ message });
      });
    });
  }

  protected ccaLookup(request: Order): Promise<any> {
    return new Promise((resolve, reject) => {

      const { shippingMethodIndicator = '07' } = request;

      http.cardinalLookupRequest({ ...request, shippingMethodIndicator }).then(response => {
        logger('cmpi_lookup response', response);

        const { lookupResponse } = response;
        const { ErrorNo, ErrorDesc, Enrolled } = lookupResponse;

        if (ErrorNo !== '0') {
          reject({ message: ErrorDesc || '' });
        }

        if (Enrolled === 'Y') {
          const { ACSUrl, Payload, TransactionId } = lookupResponse;

          if (ACSUrl && Payload) {
            (window as any).Cardinal.continue('cca', {
              AcsUrl: ACSUrl,
              Payload
            }, {
              OrderDetails: {
                TransactionId,
                Amount: request.amount,
                OrderNumber: request.orderNumber,
                CurrencyCode: request.billingCountryCode,
              }
            });

          } else {

            const { PAResStatus, SignatureVerification } = lookupResponse;

            if (SignatureVerification === 'Y') {

              if (PAResStatus === 'Y' || PAResStatus === 'A') {
                resolve(response);
              } else {
                reject({ message: ERRORS.INVALID_RESPONSE });
              }
            } else {
              reject({ message: ERRORS.TRANSACTION_VERIFICATION_FAILED });
            }
          }


        } else {
          reject({ message: ERRORS.TRANSACTION_FAILED });
        }
      }).catch((error: any) => {
        logger('MPI Lookup Failed', error.message);
        reject({ message: error.message });
      });
    });

  }
}

export default Cardinal;
