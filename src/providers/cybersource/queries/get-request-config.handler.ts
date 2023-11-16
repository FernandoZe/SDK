import { ConfigRequest } from '../../../interfaces';
import { CybersourceFinder } from './CybersourceFinder';

export class GetRequestConfigQueryHandler {
  
  constructor(private readonly cybersourceFinder: CybersourceFinder) {}

  execute(): ConfigRequest {
    return this.cybersourceFinder.getRequestConfig();
  }
}