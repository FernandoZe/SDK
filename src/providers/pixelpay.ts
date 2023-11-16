import { lib } from '../configs';
import { Order } from '../interfaces';
import { ENVIRONMENTS, ERRORS } from '../utils/constants';
import { expirationDateWithHyphens, hashMD5, phoneNumberWithoutHyphens } from '../utils/helpers';
import { getCountryByNumericCode } from '../services/locations';

const { REQUIRED } = ERRORS;

class PixelPay {
  
  public apiKey: string;
  public secretKey: string;
  public endpoint: string;

  protected order!: Order | any;

  constructor() {
    this.secretKey = '';
    this.apiKey = '';
    this.endpoint = 'https://pixel-pay.com';
  }

  private setup(apiKey: string, secretKey: string | undefined, endpoint = 'https://pixel-pay.com'): void {
    this.apiKey = apiKey;
    this.endpoint = endpoint;

    if (secretKey) {
      this.secretKey = hashMD5(secretKey);
    } else {
      throw new Error(REQUIRED.SECRET_KEY_MISSED);
    }

    if (lib.state.environment !== ENVIRONMENTS.PRODUCTION) {
      (window as any).PixelPay.sandbox();
    }

    (window as any).PixelPay.setup(this.apiKey, this.secretKey, this.endpoint);
  }

  public setCredentials(credentials: any) {
    const { apiKey, secretKey, endpoint } = credentials;

    this.setup(apiKey, secretKey, endpoint);
  }

  public setOrder(order: Order): void {
    const pixelPayOrder = (window as any).PixelPay.newOrder();

    const { orderNumber, amount, customerName, email } = order;

    pixelPayOrder.setOrderID(orderNumber);
    pixelPayOrder.setAmount(amount);
    pixelPayOrder.setFullName(customerName);
    pixelPayOrder.setEmail(email);

    this.order = pixelPayOrder;

    this.setCard(order);
    this.setBilling(order);
  }

  private setCard(data: Order): any {

    const { safeIdentifier, cvv, firstName, lastName, validThru } = data;

    const card = (window as any).PixelPay.newCard();
    card.setCardNumber(safeIdentifier);
    card.setCvv(cvv);
    card.setCardHolder(`${firstName} ${lastName}`);
    card.setExpirationDate(expirationDateWithHyphens(validThru));

    this.order.addCard(card);
  }

  private setBilling(data: Order): any {
    const billing = (window as any).PixelPay.newBilling();

    const {
      billingCity,
      billingState,
      billingAddress1,
      mobilePhone,
      billingCountryCode
    } = data;

    const country = getCountryByNumericCode(billingCountryCode);

    billing.setCity(billingCity);
    billing.setState(billingState);
    billing.setCountry(country?.alpha2 ?? 'HN');
    billing.setAddress(billingAddress1);
    billing.setPhoneNumber(phoneNumberWithoutHyphens(mobilePhone));

    this.order.addBilling(billing);
  }

  private async payOrder(): Promise<any | Error> {

    try {
      if (!this.order) {
        throw new Error('La orden no fue configurada correctamente');
      }

      const responsePixelPay = await (window as any).PixelPay.payOrder(this.order);

      return { isValidated: responsePixelPay.success, data: responsePixelPay.data };

    } catch (error: any) {

      return { isValidated: false, data: error.data };

    }
  }

  public async handle() {
    return await this.payOrder();
  }
}

export default PixelPay;
