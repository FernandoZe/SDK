import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CybersourceCommand } from '../../../../providers/cybersource/commands';
import { CYBERSOURCE_CREDENTIALS, ORDER_FIXTURE } from '../../../mocks';
import { CybersourceFinder } from '../../../../providers/cybersource/queries/CybersourceFinder';

chai.use(chaiAsPromised);
chai.use(spies);

describe('Test Cybersources Provider Handler', () => {
  const cybersourceCommand = new CybersourceCommand(CYBERSOURCE_CREDENTIALS, ORDER_FIXTURE);
  const cybersourceFinder = new CybersourceFinder(cybersourceCommand);

  beforeEach(() => chai.spy.restore());

  it('Should be instance of Cybersource Finder Query', async () => {
    expect(cybersourceFinder)
      .to.be.a.instanceOf(CybersourceFinder);
  });

  it('Should be call getRequestConfig method with credentials and response type should be Http (ConfigRequest)', async () => {
    const response = cybersourceFinder.getRequestConfig();

    expect(response)
      .to.be.an('object')
      .to.include.all.keys('url', 'data', 'headers');

    const { url, data, headers } = response;

    expect(url)
      .to.be.a('string')
      .to.match(/(?:https:)/);

    expect(data)
      .to.be.an('object')
      .to.include.all.keys('cvv', 'firstName', 'lastName', 'safeIdentifier');

    expect(headers)
      .to.be.an('object')
      .to.include.all.keys('date', 'digest', 'signature', 'host', 'v-c-merchant-id');

  });

});

