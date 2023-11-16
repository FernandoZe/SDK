import { CommandHandler } from '../../../interfaces/CommandHandler';
import { CybersourceCommand } from '../commands/CybersourceCommand';
import api from '../../../services/http';
import { GetRequestConfigQueryHandler } from '../queries/get-request-config.handler';
import { CybersourceFinder } from '../queries/CybersourceFinder';

export class CybersourceHandler implements CommandHandler {

  async handle(cybersourceCommand: CybersourceCommand): Promise<any> {
    try {
      const cybersourceFinder = new CybersourceFinder(cybersourceCommand);
      const query = new GetRequestConfigQueryHandler(cybersourceFinder); 
      const requestConfig = query.execute();

      return api.cybersourceRequest(requestConfig);
    } catch (error: any) {
      
      return { isValidated: false, data: error.data };
    }
  }
}