import { CreateScriptHandler } from '../handler';
import { KOUNT_CREDENTIALS } from 'src/interfaces';
import { InitializeScriptHandler } from '../handler';
import { CommandBus } from '../../../interfaces/CommandBus';
import { CreateScriptCommand, InitializeScriptCommand } from '../commands';

export class KountService {
  private readonly commandBus: CommandBus;

  constructor(protected credentials: KOUNT_CREDENTIALS) {
    this.commandBus = new CommandBus();
  }

  private async createScript() {
    this.commandBus.addHandler(CreateScriptCommand.name, new CreateScriptHandler());

    return this.commandBus.handle(new CreateScriptCommand(this.credentials));
  }

  async initialize() {
    await this.createScript();

    this.commandBus.addHandler(InitializeScriptCommand.name, new InitializeScriptHandler());

    return await this.commandBus.handle(new InitializeScriptCommand());
  }

}
