import { lib, account } from '../configs';
import { logger } from '../utils/helpers';
import { KountService } from '../providers/kount/services';

const validateService = async (): Promise<any> => {
  const { antiFraud, service3DS } = account.state;

  if (antiFraud?.isActive) {
    const kount = new KountService(antiFraud);
    await kount.initialize();
  }

  if (service3DS?.isActive) {
    return initialize3DSService();
  }
};

const initialize3DSService = (): Promise<any> => {

  return new Promise((resolve, reject) => {
    const type = 'text/javascript';

    const { service3DS } = account.state;

    if(!service3DS) throw new Error('Cuenta no configurada.');

    if (service3DS.credentials && 'endpoint' in service3DS.credentials) {

      const src = service3DS.credentials.endpoint;
      const script: HTMLScriptElement = document.createElement('script');
      script.src = src;
      script.type = type;
      document.head.appendChild(script);
      script.addEventListener('load', () => { 
        logger('ADD 3DS SERVICE');
        resolve('ADD 3DS SERVICE');
      });
      script.addEventListener('error', e => {
        logger('FAILED TO ADD 3DS SERVICE');
        reject(`No se pudo agregar el servicio de 3DS: ${ e.error }`);
      });
    }
    logger('ADD 3DS SERVICE');
    resolve('ADD 3DS SERVICE');
  });

};

export { validateService, initialize3DSService };
