import CryptoES from 'crypto-es';
import { Method } from 'axios';
import { CYBERSOURCE_CREDENTIALS, Order } from 'src/interfaces';
import { ENVIRONMENTS } from '../../../utils/constants';
import { lib } from '../../../configs';
import { RequestMethods } from '../../../interfaces/utils/requestMethod.enum';

export class CybersourceCommand {
  private _method: Method;
  private _resource: string;
  private _requestHost: string;

  private credentials: CYBERSOURCE_CREDENTIALS;
  private _keyId!: string;
  private _secretKey!: string;
  private _merchantId!: string;

  private _digest!: string;
  private _signature!: string;
  private _date: string;

  private _order: any;

  constructor(credentials: CYBERSOURCE_CREDENTIALS, order: Order) {
    this._method = RequestMethods.POST;
    this._resource = '/risk/v1/authentications/';
    this._requestHost = (lib.state.environment !== ENVIRONMENTS.PRODUCTION) ? 'apitest.cybersource.com' : 'api.cybersource.com';
    this.credentials = credentials;
    this._keyId = credentials.keyId;
    this._secretKey = credentials.secretKey;
    this._merchantId = credentials.merchantId;
    this._date = new Date().toUTCString();

    this._order = {
      clientReferenceInformation: {
        code: order.email
      },
      orderInformation: {
        billTo: {
          firstName: order.firstName,
          lastName: order.lastName,
          address1: order.billingAddress1,
          postalCode: order.billingPostCode,
          locality: order.billingCity,
          administrativeArea: order.billingState,
          country: order.b2cc,
          phoneNumber: order.mobilePhone.replace('+', ''),
          email: order.email
        },
        amountDetails: {
          totalAmount: order.amount.toString(),
          currency: order.currency
        }
      },
      paymentInformation: {
        card: {
          expirationYear: `20${order.validThru.substring(order.validThru.length - 2)}`,
          number: order.safeIdentifier,
          securityCode: order.cvv,
          expirationMonth: order.validThru.substring(0, 2)
        }
      },
      consumerAuthenticationInformation: {
        transactionMode: 'eCommerce'
      }
    };
    
  }

  private generateDigest() : void {
    const dataString = JSON.stringify(this._order);

    const sha256Digest = CryptoES.SHA256(dataString);
    const digestHash = CryptoES.enc.Base64.stringify(sha256Digest);

    this._digest = `SHA-256=${digestHash}`;
  }

  private generateSignature(): void {
    const algorithm = 'HmacSHA256';
    let signatureHeader = `keyid="${this._keyId}", algorithm="${algorithm}"`;

    if (this._method === RequestMethods.GET) {
      const headersForGetMethod = 'host date (request-target) v-c-merchant-id';
      signatureHeader += `, headers="${headersForGetMethod}"`;
    } else if (this._method === RequestMethods.POST) {
      const headersForPostMethod = 'host date (request-target) digest v-c-merchant-id';
      signatureHeader += `, headers="${headersForPostMethod}"`;
    }

    this._date = new Date().toUTCString();
    let signatureString = `host: ${this._requestHost}\n`;
    signatureString += `date: ${this._date}\n`;

    const targetUrl = `${this._method.toLowerCase()} ${this._resource}`;
    signatureString += `(request-target): ${targetUrl}\n`;

    if (this._method === RequestMethods.POST) {
      // Digest for POST call
      this.generateDigest();

      signatureString += `digest: ${this._digest}\n`;
    }

    signatureString += `v-c-merchant-id: ${this.merchantId}`;

    // Decoding scecret key
    const words = CryptoES.enc.Base64.parse(this._secretKey);
    
    const signatureHash = CryptoES.HmacSHA256(signatureString, words);
    const signatureValue = CryptoES.enc.Base64.stringify(signatureHash);


    signatureHeader += `, signature="${signatureValue}"`;

    this._signature = signatureHeader;

  }

  public get signature(): string {
    this.generateSignature();

    return this._signature; 
  }
  
  public get digest(): string {
    this.generateDigest(); 

    return this._digest; 
  }

  public get method(): Method {
    return this._method; 
  }

  public get resource(): string {
    return this._resource;
  }

  public get requestHost(): string {
    return this._requestHost; 
  }

  public get merchantId(): string {
    return this._merchantId; 
  }

  public get order(): Order {
    return this._order; 
  }

  public get date(): string {
    return this._date;
  }
}