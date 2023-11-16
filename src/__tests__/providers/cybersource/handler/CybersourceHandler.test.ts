import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CybersourceCommand } from '../../../../providers/cybersource/commands';
import { CYBERSOURCE_CREDENTIALS, ORDER_FIXTURE } from '../../../mocks';
import { CybersourceHandler } from '../../../../providers/cybersource/handler/CybersourceHandler';

chai.use(chaiAsPromised);
chai.use(spies);

describe('Test Cybersources Provider Handler', () => {
  const cybersourceHandlerInstance = new CybersourceHandler();
  const cybersourceCommandInstance = new CybersourceCommand(CYBERSOURCE_CREDENTIALS, ORDER_FIXTURE);

  beforeEach(() => chai.spy.restore());
  
  it('Should be instance of Cybersource Command', async () => {
    expect(cybersourceCommandInstance)
      .to.be.a.instanceOf(CybersourceCommand); 
  });

  it('Should be instance of Cybersource Handler', async () => {
    const cybersourceHandlerInstance = new CybersourceHandler();

    expect(cybersourceHandlerInstance).to.be.a.instanceOf(CybersourceHandler);
  });

  it('Should be rejected call handle method with credentials', async () => {  
    const response = await cybersourceHandlerInstance.handle(cybersourceCommandInstance);

    expect(response)
      .to.be.an('object')
      .to.include.all.keys('isValidated', 'data');

    const { isValidated, data } = response; 

    expect(isValidated).to.be.a('boolean').to.equal(false); 
    expect(data).to.be.a.undefined; 
  });

  it('Should be call handle method with credentials', async () => {
    const MOCK_VALIDATE_RESPONSE = {
      status: 'AUTHENTICATION_SUCCESSFUL',
      paymentInformation: {
        card: { bin: '400000', type: 'VISA' }
      }
    };

    chai.spy.on(cybersourceHandlerInstance, 'handle', () => Promise.resolve(MOCK_VALIDATE_RESPONSE));

    const response = await cybersourceHandlerInstance.handle(cybersourceCommandInstance);

    expect(response)
      .to.be.an('object')
      .to.include.all.keys('status', 'paymentInformation');

    const { status, paymentInformation } = response; 

    expect(status)
      .to.be.a('string')
      .to.equal(MOCK_VALIDATE_RESPONSE.status);

    expect(paymentInformation)
      .to.be.an('object')
      .to.have.property('card');

    const { card } = paymentInformation;

    expect(card)
      .to.be.an('object')
      .to.include.all.keys('bin', 'type');

    expect(card.bin)
      .to.be.a('string')
      .to.equal(MOCK_VALIDATE_RESPONSE.paymentInformation.card.bin); 

    expect(card.type)
      .to.be.a('string')
      .to.equal(MOCK_VALIDATE_RESPONSE.paymentInformation.card.type); 
  });

});

