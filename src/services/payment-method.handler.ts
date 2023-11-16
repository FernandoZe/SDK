import { Order } from '../interfaces';
import { CommandBus } from '../interfaces/CommandBus';
import Cardinal from '../providers/cardinal';
import { CybersourceCommand } from '../providers/cybersource/commands';
import { CybersourceHandler } from '../providers/cybersource/handler';
import PixelPay from '../providers/pixelpay';
import http from './http';

export class PaymentMethodHandler {
  
  public async process(service3DS: any, order: Order) {
    const { type, credentials, jwt } = service3DS;

    const bus = new CommandBus();

    if (type === 'CARDINAL') {
      const token = (jwt) ? jwt : await http.generateToken(order);

      const cardinal = new Cardinal();
      cardinal.setCredentials(token);
      cardinal.setOrder(order);

      return await cardinal.handle(); 
    }

    if(type === 'CYBERSOURCE') {
      bus.addHandler(CybersourceCommand.name, new CybersourceHandler());

      return bus.handle(new CybersourceCommand(credentials, order));

    }

    if(type === 'PIXELPAY') {
      const pixelPay = new PixelPay();
      pixelPay.setCredentials(credentials);
      pixelPay.setOrder(order);

      return await pixelPay.handle();
    }
  }
}