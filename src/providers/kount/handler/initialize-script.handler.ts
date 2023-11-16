import { CommandHandler } from '../../../interfaces/CommandHandler';
import { InitializeScriptCommand } from '../commands';

export class InitializeScriptHandler implements CommandHandler {
  async handle(initializeScriptCommand: InitializeScriptCommand): Promise<any> {

    return new Promise((resolve, reject) => {
      const client = new (window as any).ka.ClientSDK();
      client.autoLoadEvents();

      resolve(client);
    }).catch(error => error);
  }
}
