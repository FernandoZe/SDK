import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import http from './../../src/services/http';
import Cardinal from '../providers/cardinal';
import { lib, account } from './../../src/configs';
import { debug, configure_link, payOrder } from './../../src/paygate';
import { ACCOUNT_FIXTURE, ORDER_FIXTURE, cardinalMock, MOCK_ACCOUNT_STATE } from './mocks';
import { AccountState } from 'src/interfaces';

chai.use(spies);
chai.use(chaiAsPromised);

describe('Paygate file', () => {

  beforeAll(()=>{
    (global as any).document = {
      createElement: ()=>({ src: '', type: '' }),
      body: {
        appendChild: ()=>({})
      }
    };

  });

  beforeEach(() => {
    chai.spy.on(lib, ['setID', 'setToken', 'setDebug', 'setEndpoint', 'setNotification']);
  });

  afterEach(() => {
    chai.spy.restore(lib);
  });

  it('configure - should configure initial settings correctly', async () => {

    configure_link(MOCK_ACCOUNT_STATE, 'LOCAL');
    expect(lib.setToken).to.have.been.called.min(1);
    expect(lib.setEndpoint).to.have.been.called.min(1);

    expect(lib.setToken).to.have.been.called.with(ACCOUNT_FIXTURE.token);
    expect(lib.setEndpoint).to.have.been.called.with(ACCOUNT_FIXTURE.endpoint);
  });

  it('debug - should configure debug correctly', () => {

    debug(true);
    expect(lib.setDebug).to.have.been.called.min(1);
    expect(lib.setDebug).to.have.been.called.with(true);

    debug(false);
    expect(lib.setDebug).to.have.been.called.min(2);
    expect(lib.setDebug).to.have.been.called.with(false);

  });

  it('payOrder - should pay order without service3DS correctly', async () => {

    const accountSettingsMock: AccountState = {
      _id: '60aecca067a7340f96d93794',
      displayName: 'Pasteles Robles',
      commercialName: 'Pasteles Robles',
      isActive: true,
      terminal: '',
      antiFraud: {
        isActive: false,
        merchantId: ''
      },
      service3DS: {
        isActive: false,
        type: 'CARDINAL',
        credentials: {
          endpoint: '',
          apiKey: '',
          merchantId: '',
          transactionPwd: '',
          processorId: '',
          apiIdentifier: '',
          orgUnitId: '',
        },
        jwt: ''
      }
    };

    chai.spy.on(account, 'setData');
    chai.spy.on(http, 'makePayment', ()=> Promise.resolve(({})));
    chai.spy.on(http, 'getAccountServices', ()=> accountSettingsMock );

    account.setData(accountSettingsMock);

    await configure_link(accountSettingsMock, 'LOCAL');
    await payOrder(ORDER_FIXTURE);

    expect(account.setData).to.have.been.called.min(1);
    expect(http.makePayment).to.have.been.called.min(1);
    expect(http.getAccountServices).to.have.been.called.min(1);
    expect(account.state.service3DS?.isActive).to.be.a('boolean').equal(false);

    chai.spy.restore(http);
    chai.spy.restore(account);

  });

  it('payOrder - should pay order with service3DS correctly', async () => {

    const accountSettingsMock: AccountState = {
      _id: '60aecca067a7340f96d93794',
      displayName: 'Pasteles Robles',
      commercialName: 'Pasteles Robles',
      isActive: true,
      terminal: '',
      antiFraud: {
        isActive: false,
        merchantId: ''
      },
      service3DS: {
        isActive: true,
        type: 'CARDINAL',
        credentials: {
          endpoint: '',
          apiKey: '',
          merchantId: '',
          transactionPwd: '',
          processorId: '',
          apiIdentifier: '',
          orgUnitId: '',
        },
        jwt: ''
      }
    };

    const responseEncode = {
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MTViZTE2MS0yOTU3LTQ3YmYtOTUzMC0yMjY3NTcxY2U1MGEiLCJpc3MiOiI1YWY5YmM2MjZmZTNkMTE3NzRmYjg0ZWYiLCJQYXlsb2FkIjp7ImN2diI6IjI1OCIsImVtYWlsIjoiYW5nZWxAY2xpbnBheXMuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJ2YWxpZFRocnUiOiIxMC8yNSIsImZpcnN0TmFtZSI6IkpvaG4iLCJkZXNjcmlwdGlvbiI6InBydWViYSIsIm1vYmlsZVBob25lIjoiKzUwNDg3ODc2NjI1Iiwib3JkZXJOdW1iZXIiOiJlMGYzZGJlMy0xYzgyLTQxZDAtYmQ1NC01YmU5MDk2OGQzZDgiLCJiaWxsaW5nQ2l0eSI6IlRlZ3VjaWdhbHBhIiwiY3VzdG9tZXJOYW1lIjoiQW5nZWwgR29uesOhbGV6IiwiYmlsbGluZ1N0YXRlIjoiRk0iLCJzYWZlSWRlbnRpZmllciI6IjQwMDAwMDAwMDAwMDAwMDIiLCJiaWxsaW5nQWRkcmVzczEiOiJPam9qb25hIEZNIiwiYmlsbGluZ0NvdW50cnlDb2RlIjoiMzQwIiwiYW1vdW50IjoyMDB9LCJPcmdVbml0SWQiOiI1YWY5YjI3ZjZmZTNkMTE3NzRmYjdjMzAiLCJSZWZlcmVuY2VJZCI6ImIxMTcxNGZlLWU5MTQtNGI0My1hNjY1LWY0MGY2Y2MzNDBkOSIsImlhdCI6MTYzNzA3NzE4NCwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZX0.x_Mq9v87QpzTeEzX8s7elBbk5LAKPG5D6vBhEEMZcSc'
    };

    (global as any).window = cardinalMock({});
    (global as any).document = {
      createElement: ()=>({}),
      body: {
        appendChild: function (script:any) {}
      }
    };

    chai.spy.on(account, 'setData');
    chai.spy.on(Cardinal.prototype, 'init', ()=> ({}) );
    chai.spy.on(http, 'generateToken', ()=> responseEncode );
    chai.spy.on(http, 'makePayment', ()=> Promise.resolve(({})));
    chai.spy.on(Cardinal.prototype, 'configure', ()=> 'sessinID' );
    chai.spy.on(http, 'getAccountServices', ()=> accountSettingsMock );

    account.setData(accountSettingsMock);

    await configure_link(accountSettingsMock, 'LOCAL');
    await payOrder(ORDER_FIXTURE);

    expect(http.getAccountServices).to.have.been.called.min(1);
    expect(account.setData).to.have.been.called.min(1);
    expect(http.generateToken).to.have.been.called.min(1);
    expect(http.makePayment).to.have.been.called.min(1);
    expect(account.state.service3DS?.isActive).to.be.an('boolean').equal(true);

    chai.spy.restore(http);
    chai.spy.restore(account);
    chai.spy.restore(Cardinal);

  });

  it('payOrder - should be rejected error in getAccountServices ', async () => {


    const error = { message: 'no response was obtained' };
    chai.spy.on(http, 'getAccountServices', () => Promise.reject(error.message));

    await configure_link(MOCK_ACCOUNT_STATE, 'LOCAL');

    return expect(payOrder(ORDER_FIXTURE)).to.eventually.be.rejectedWith(error.message);

    chai.spy.restore(http);

  });

});
