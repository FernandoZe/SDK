import { ConfigRequest } from '../../../interfaces';
import { CybersourceCommand } from '../commands';

export class CybersourceFinder {

  constructor(private readonly cybersourceCommand: CybersourceCommand) { }

  public getRequestConfig() : ConfigRequest {
    const date = this.cybersourceCommand.date;
    const digest = this.cybersourceCommand.digest;
    const signature = this.cybersourceCommand.signature;
    const requestHost = this.cybersourceCommand.requestHost;
    const method = this.cybersourceCommand.method;
    const resource = this.cybersourceCommand.resource;
    const merchantId = this.cybersourceCommand.merchantId;
    const order = this.cybersourceCommand.order;

    const requestConfig = {
      data: order,
      url: `https://${requestHost}${resource}`,
      method: method,
      headers: {
        date,
        digest,
        signature,
        host: requestHost,
        vcMerchantId: merchantId
      }
    };

    return requestConfig; 
  }
}