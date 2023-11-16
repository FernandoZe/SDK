import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CybersourceCommand } from '../../../../providers/cybersource/commands/CybersourceCommand';
import { CYBERSOURCE_CREDENTIALS, ORDER_FIXTURE } from '../../../mocks';
import { RequestMethods } from '../../../../interfaces/utils/requestMethod.enum';

chai.use(chaiAsPromised);
chai.use(spies);

const CYBERSOURCE_CREDENTIALS_EMPTY = {
  keyId: '',
  secretKey: '',
  merchantId: ''
};

describe('Test Cybersources Provider', () => {

  const CybersourceCommandInstance = new CybersourceCommand(CYBERSOURCE_CREDENTIALS, ORDER_FIXTURE);
  
  it('Should be instance of CybersourceCommand', async () => {
    expect(CybersourceCommandInstance)
      .to.be.a.instanceOf(CybersourceCommand);

  });

  it('Should be rejected generate digest headers without credentials', async () => {
    const cybersourceWithoutCredentials = new CybersourceCommand(CYBERSOURCE_CREDENTIALS_EMPTY, ORDER_FIXTURE);
    const digest = cybersourceWithoutCredentials.digest;

    expect(digest).to.be.a('string');
  });

  it('Should be generate digest headers', async () => {

    const digest = CybersourceCommandInstance.digest;

    expect(digest)
      .to.be.a('string')
      .to.match(/(?:SHA-256=)/);
  });

  it('Should be rejected generate signature headers without credentials', async () => {
    const cybersourceWithoutCredentials = new CybersourceCommand(CYBERSOURCE_CREDENTIALS_EMPTY, ORDER_FIXTURE);
    const signature = cybersourceWithoutCredentials.signature;

    expect(signature).to.be.a('string');
  });

  it('Should be generate signature headers', async () => {
    const signature = CybersourceCommandInstance.signature;

    expect(signature)
      .to.be.a('string')
      .to.match(/(?:signature=)/);
  });

  it('Should be rejected get request host headers without credentials', async () => {
    const cybersourceWithoutCredentials = new CybersourceCommand(CYBERSOURCE_CREDENTIALS_EMPTY, ORDER_FIXTURE);
    const requestHost = cybersourceWithoutCredentials.requestHost;

    expect(requestHost).to.be.a('string');
  });

  it('Should be get request host headers', async () => {
    const requestHost = CybersourceCommandInstance.requestHost;

    expect(requestHost)
      .to.be.a('string')
      .to.match(/(?:api)/);
  });

  it('Should be rejected get method headers without credentials', async () => {
    const cybersourceWithoutCredentials = new CybersourceCommand(CYBERSOURCE_CREDENTIALS_EMPTY, ORDER_FIXTURE);
    const method = cybersourceWithoutCredentials.method;

    expect(method).to.be.a('string');
  });

  it('Should be get method http headers', async () => {
    const method = CybersourceCommandInstance.method;

    expect(method)
      .to.equal(RequestMethods.POST);
  });

  it('Should be rejected get resource headers without credentials', async () => {
    const cybersourceWithoutCredentials = new CybersourceCommand(CYBERSOURCE_CREDENTIALS_EMPTY, ORDER_FIXTURE);
    const resource = cybersourceWithoutCredentials.resource;

    expect(resource).to.be.a('string');
  });

  it('Should be get resource headers', async () => {
    const resource = CybersourceCommandInstance.resource;

    expect(resource)
      .to.be.a('string');
  });

});

