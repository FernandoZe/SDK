import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CreateScriptCommand } from '../../../../providers/kount/commands';
import { KOUNT_CREDENTIALS } from '../../../mocks';

chai.use(chaiAsPromised);
chai.use(spies);

const KOUNT_CREDENTIALS_EMPTY = {
  ddcUrl: '',
  merchantID: ''
};

describe('Test Kount Provider', () => {

  const createScriptCommand = new CreateScriptCommand(KOUNT_CREDENTIALS);

  it('Should be instance of CreateScriptCommand', () => {
    expect(createScriptCommand)
      .to.be.a.instanceOf(CreateScriptCommand);
  });

  it('Should be credentials object with ddcUrl and merchant id', () => {
    expect(createScriptCommand.kountCredentials)
      .to.be.an('object')
      .to.include.all.keys('ddcUrl', 'merchantID');

    const { ddcUrl,  merchantID } = createScriptCommand.kountCredentials;

    expect(ddcUrl)
      .to.be.a('string')
      .to.match(/(?:https)/);

    expect(merchantID)
      .to.be.a('string')
      .that.not.empty;
  });

  it('Should be equal ddcUrl of mock', () => {
    expect(createScriptCommand.kountCredentials)
      .to.be.an('object')
      .to.include.all.keys('ddcUrl', 'merchantID');

    const { ddcUrl } = createScriptCommand.kountCredentials;

    expect(ddcUrl)
      .to.be.a('string')
      .to.equal(KOUNT_CREDENTIALS.ddcUrl);
  });

  it('Should be equal merchantID of mock', () => {
    expect(createScriptCommand.kountCredentials)
      .to.be.an('object')
      .to.include.all.keys('ddcUrl', 'merchantID');

    const { merchantID } = createScriptCommand.kountCredentials;

    expect(merchantID)
      .to.be.a('string')
      .to.equal(KOUNT_CREDENTIALS.merchantID);
  });

  it('Should be rejected because instance without credentials', () => {
    const createScriptCommandWithoutCredentials = new CreateScriptCommand(KOUNT_CREDENTIALS_EMPTY);

    expect(createScriptCommandWithoutCredentials.kountCredentials)
      .to.be.an('object')
      .to.include.all.keys('ddcUrl', 'merchantID');

    const { ddcUrl, merchantID } = createScriptCommandWithoutCredentials.kountCredentials;

    expect(ddcUrl)
      .to.be.a('string')
      .empty;

    expect(merchantID)
      .to.be.a('string')
      .empty; 
  });

});

