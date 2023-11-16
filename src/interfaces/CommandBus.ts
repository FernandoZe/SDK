import { CommandHandler } from './CommandHandler';

export class CommandBus implements CommandHandler {
  private readonly handlers: { [key: string]: CommandHandler } = {};

  addHandler(commandName: string, commandHandler: CommandHandler): void {
    this.handlers[commandName] = commandHandler;
  }

  async handle(object: object) : Promise<any> {
    const commandName = object.constructor.name;
    const handler = this.handlers[commandName]; 

    if(handler === undefined) {
      throw new Error(`handler for ${commandName} not found`);
    }

    return handler.handle(object); 
  }
}