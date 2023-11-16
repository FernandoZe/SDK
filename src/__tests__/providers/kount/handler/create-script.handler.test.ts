import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CreateScriptCommand } from '../../../../providers/kount/commands';
import { CreateScriptHandler } from '../../../../providers/kount/handler';
import { KOUNT_CREDENTIALS } from '../../../mocks';

chai.use(chaiAsPromised);
chai.use(spies);

const KOUNT_CREDENTIALS_EMPTY = {
  ddcUrl: '',
  merchantID: ''
};

describe('Test Kount Provider', () => {

  const createScriptCommand = new CreateScriptCommand(KOUNT_CREDENTIALS);
  const createScriptHandler = new CreateScriptHandler();

  beforeEach(() => chai.spy.restore());

  it('Should be instance of CreateScriptCommand', () => {
    expect(createScriptCommand)
      .to.be.a.instanceOf(CreateScriptCommand);
  });

  it('Should be instance of CreateScriptHandler', () => {
    expect(createScriptHandler)
      .to.be.a.instanceOf(CreateScriptHandler);
  });

  it('Should be credentials object with ddcUrl and merchant id', () => {
    expect(createScriptCommand.kountCredentials)
      .to.be.an('object')
      .to.include.all.keys('ddcUrl', 'merchantID');

    const { ddcUrl,  merchantID } = createScriptCommand.kountCredentials;

    expect(ddcUrl)
      .to.be.a('string')
      .to.equal(KOUNT_CREDENTIALS.ddcUrl);

    expect(merchantID)
      .to.be.a('string')
      .to.equal(KOUNT_CREDENTIALS.merchantID);
  });

  it('Should be reject create script because credentials is empty', async () => {

    const createScriptCommandWithoutCredentials = new CreateScriptCommand(KOUNT_CREDENTIALS_EMPTY);
    const createScriptHandler = new CreateScriptHandler();

    const MOCK_REJECT = {
      message: 'No se pudo agregar el servicio antifraude'
    };

    chai.spy.on(createScriptHandler, 'handle', () => Promise.resolve(MOCK_REJECT));

    const response = await createScriptHandler.handle(createScriptCommandWithoutCredentials);

    expect(response)
      .to.be.a('object')
      .to.include.all.keys('message');

    expect(response.message)
      .to.be.a('string')
      .to.equal('No se pudo agregar el servicio antifraude');
  });

  it('Should be response create script with credentials', async () => {

    chai.spy.on(createScriptHandler, 'handle', () => Promise.resolve({}));

    const response = await createScriptHandler.handle(createScriptCommand);

    expect(response)
      .to.be.an('object');
  });
});

