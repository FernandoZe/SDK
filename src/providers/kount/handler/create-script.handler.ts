import { v4 as uuid } from 'uuid';
import { CreateScriptCommand } from '../commands';
import { CommandHandler } from '../../../interfaces/CommandHandler';

export class CreateScriptHandler implements CommandHandler {
  async handle(createScriptCommand: CreateScriptCommand): Promise<any> {

    return new Promise((resolve, reject) => {
      const type = 'text/javascript';

      const { ddcUrl, merchantID } = createScriptCommand.kountCredentials;

      const script: HTMLScriptElement = document.createElement('script');
      const dataEvent: Attr = document.createAttribute('data-event');
      const body: HTMLElement = document.body;

      const src = `${ddcUrl}/collect/sdk?m=${merchantID}`;

      script.src = src;
      script.type = type;
      document.head.appendChild(script);

      body.classList.add('kaxsdc');
      dataEvent.nodeValue = 'load';
      body.setAttributeNode(dataEvent);

      script.addEventListener('load', resolve);
      script.addEventListener('error', e => reject(e.error));

    }).catch(error => { return { message: error }; });
  }
}
