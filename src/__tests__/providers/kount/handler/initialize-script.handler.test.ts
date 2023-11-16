import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { kountMock, KOUNT_CREDENTIALS } from '../../../mocks';
import { CreateScriptCommand, InitializeScriptCommand } from '../../../../providers/kount/commands';
import { CreateScriptHandler, InitializeScriptHandler } from '../../../../providers/kount/handler';

chai.use(chaiAsPromised);
chai.use(spies);

describe('Initialize script Kount', () => {
  const createScriptCommand = new CreateScriptCommand(KOUNT_CREDENTIALS);
  const createScriptHandler = new CreateScriptHandler();
  const initializeScriptCommand = new InitializeScriptCommand();
  const initializeScriptHandler = new InitializeScriptHandler();

  beforeEach(() => chai.spy.restore());

  it('Should be instance of CreateScriptCommand', () => {
    expect(createScriptCommand)
      .to.be.a.instanceOf(CreateScriptCommand);
  });

  it('Should be instance of CreateScriptHandler', () => {
    expect(createScriptHandler)
      .to.be.a.instanceOf(CreateScriptHandler);
  });

  it('Should be instance of InitializeScriptCommand', () => {
    expect(initializeScriptCommand)
      .to.be.a.instanceOf(InitializeScriptCommand);
  });

  it('Should be instance of initializeScriptHandler', () => {
    expect(initializeScriptHandler)
      .to.be.a.instanceOf(InitializeScriptHandler);
  });

  it('Should be called Kount script SDK sucessfully', async () => {

    const sessionId = '1234';

    (global as any).window = kountMock({ sessionId });

    chai.spy.on((global as any).window.Kount, 'ClientSDK');
    chai.spy.on((global as any).window.Kount, 'autoLoadEvents');

    //const _sessionId = await createScriptHandler.handle(createScriptCommand);

    await initializeScriptHandler.handle(initializeScriptCommand);

    //expect(_sessionId).to.equal(sessionId);
    expect((global as any).window.Kount.ClientSDK).to.have.been.called.min(1);
    expect((global as any).window.Kount.autoLoadEvents).to.have.been.called.min(1);

    chai.spy.restore((global as any).window.Kount.ClientSDK);
    chai.spy.restore((global as any).window.Kount.autoLoadEvents);
   
  });
});
