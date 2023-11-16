import spies from 'chai-spies';
import  chai, { expect } from 'chai';
import  chaiAsPromised from 'chai-as-promised';

import http from './../../services/http';
import { account } from './../../configs';
import { configure } from './../../paygate';
import { Order, Payment } from '../../interfaces';
import * as service from './../../services/index';
import { ACCOUNT_FIXTURE, ORDER_FIXTURE } from '../mocks';

chai.use(chaiAsPromised);
chai.use(spies);
describe('http file', ()=>{

  let token  = '';

  beforeEach(()=>{
    chai.spy.on(service, 'validateService', ()=>({}));
  });

  afterEach(()=>{
    chai.spy.restore(service);
  });

  it('getAccountServices - should get account data correctly', async ()=>{

    await configure( ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);
    await http.getAccountServices();
    expect(account.state.displayName).to.be.an('string').length.greaterThan(1);
    expect(account.state._id).to.be.an('string').length.greaterThan(1);
    expect(service.validateService).to.have.been.called.min(1);
  });

  it('getAccountServices - should be rejected by Unauthorized', async ()=>{

    await configure( 'FAKE_TOKEN_10101010101', ACCOUNT_FIXTURE.endpoint);

    return expect(http.getAccountServices()).to.eventually.be.rejectedWith('Token invalido');
  });

  it('generateToken - should generate token correctly', async ()=>{

    await configure( ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);
    const _token = await http.generateToken({ amount: ORDER_FIXTURE.amount, referenceId: ORDER_FIXTURE.referenceId, payload: { ...ORDER_FIXTURE }});
    expect(_token).to.be.an('string').length.greaterThan(1);
    token = _token;
  });

  it('generateToken - should be rejected by Unauthorized ', async ()=>{

    await configure('FAKE_TOKEN_10101010101', ACCOUNT_FIXTURE.endpoint);

    return expect(http.generateToken({})).to.eventually.be.rejectedWith('Token invalido');
  });

  it('cardinalLookupRequest - should be rejected by description is a required field', async ()=>{

    await configure( ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);

    return expect(http.cardinalLookupRequest({} as Order)).to.eventually.be.rejectedWith('description is a required field');
  });

  it('cardinalDecode - should decode the token correctly', async ()=>{

    await configure( ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);
    const response = await http.cardinalDecode({ token });
    expect(response).to.have.property('Payload');

    const { Payload } = response;
    const { payload } = Payload;
    expect(payload.amount).to.equal(ORDER_FIXTURE.amount);
  });

  it('cardinalLookupRequest - should return orderDetails correctly ', async ()=>{

    await configure(ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);
    const response = await http.cardinalLookupRequest(ORDER_FIXTURE);

    expect(response).to.be.an('object');
    expect(response).to.have.property('OrderDetails');
    expect(response).to.have.property('Consumer');
    expect(response).to.have.property('lookupResponse');


  });

  it('makePayment - should be rejected by safeIdentifier es requerido', async ()=> {

    await configure( ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);

    return expect(http.makePayment({} as Order)).to.eventually.be.rejectedWith('safeIdentifier es requerido');

  });

  /*it('makePayment - should generate a payment with cardinal stack ', async ()=>{

    const paymentWithCardinal: Payment = {
      amount: 200,
      description: 'Prueba',
      cvv: '1234',
      cardinal: true,
      lastName: 'Martinez',
      firstName: 'Angel',
      validThru: '12/24',
      stack: {
        Amount: '22000',
        CAVV: 'AAABAWFlmQAAAABjRWWZEEFgFz8=',
        CurrencyCode: '340',
        ECIFlag: '05',
        XID: 'azI3UkJ4bXNXVUpDV0xXVE84UDA=',
        ThreeDSVersion: '1.0.2',
        CavvAlgorithm: '2',
        PAResStatus: 'Y',
        SignatureVerification: 'Y'
      },
      safeIdentifier: '4000000000000002'
    };

    await configure(ACCOUNT_FIXTURE._id, ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);
    const res = await  http.makePayment(paymentWithCardinal);
    expect(res).to.be.an('object').to.have.property('status').that.equal('APPROVED');
  });

  it('makePayment - should generate a payment without cardinal stack ', async ()=>{

    const paymentPayload: Payment = {
      amount: 200,
      description: 'Prueba',
      cvv: '1234',
      cardinal: true,
      lastName: 'Martinez',
      firstName: 'Angel',
      validThru: '12/24',
      safeIdentifier: '4000000000000002'
    };

    await configure(ACCOUNT_FIXTURE._id, ACCOUNT_FIXTURE.token, ACCOUNT_FIXTURE.endpoint);
    const res = await  http.makePayment(paymentPayload);
    expect(res).to.be.an('object').to.have.property('status').that.equal('APPROVED');
  });*/



});
