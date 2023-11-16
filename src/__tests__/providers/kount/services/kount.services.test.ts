import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { KountService } from '../../../../providers/kount/services';
import { KOUNT_CREDENTIALS } from '../../../mocks';

chai.use(chaiAsPromised);
chai.use(spies);

const KOUNT_CREDENTIALS_EMPTY = {
  ddcUrl: '',
  merchantID: ''
};

describe('Test Kount Service Provider', () => {

  const kountService = new KountService(KOUNT_CREDENTIALS);

  beforeEach(() => chai.spy.restore());

  it('Should be instance of kountService', () => {
    expect(kountService)
      .to.be.a.instanceOf(KountService);
  });

  it('Should be reject initialize service because credentials is empty', async () => {

    const kountServiceWithoutCredentials = new KountService(KOUNT_CREDENTIALS_EMPTY);
    
    const MOCK_REJECT = {
      message: 'No se pudo agregar el servicio antifraude'
    };

    chai.spy.on(kountServiceWithoutCredentials, 'initialize', () => Promise.resolve(MOCK_REJECT));

    const response = await kountServiceWithoutCredentials.initialize();

    expect(response)
      .to.be.a('object')
      .to.include.all.keys('message');

    expect(response.message)
      .to.be.a('string')
      .to.equal(MOCK_REJECT.message);
  });

  it('Should be response initalize script with credentials', async () => {

    chai.spy.on(kountService, 'initialize', () => Promise.resolve({}));

    const response = await kountService.initialize();

    expect(response)
      .to.be.an('object');
  });
});

