import spies from 'chai-spies';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as http from '../../services/http';
import Cardinal from '../../providers/cardinal';
import { ACCOUNT_FIXTURE, cardinalMock, ORDER_FIXTURE } from '../mocks';

chai.use(chaiAsPromised);
chai.use(spies);

describe('cardinal file', () => {
  it('configure - should be called cardinal configure sucessfully', async () => {

    const sessionId = '1234';

    (global as any).window = cardinalMock({ sessionId });
    chai.spy.on(http, 'cardinalLookupRequest', () => ({}));
    chai.spy.on(http, 'cardinalDecode', () => ({}));

    chai.spy.on((global as any).window.Cardinal, 'setup');
    chai.spy.on((global as any).window.Cardinal, 'configure');

    const cardinal = new Cardinal();
    const _sessionId = await cardinal.configure('prueba');

    expect(_sessionId).to.equal(sessionId);
    expect((global as any).window.Cardinal.setup).to.have.been.called.min(1);
    expect((global as any).window.Cardinal.configure).to.have.been.called.min(1);

    chai.spy.restore((global as any).window.Cardinal.setup);
    chai.spy.restore((global as any).window.Cardinal.configure);
    chai.spy.restore(http);

  });

  it('init - should call ccaLookup method successfully', async () => {

    const sessionId = '1234';

    (global as any).window = cardinalMock({ sessionId });

    chai.spy.on((global as any).window.Cardinal, 'setup');
    chai.spy.on((global as any).window.Cardinal, 'configure');
    chai.spy.on((global as any).window.Cardinal, 'on', () => ({ data: 'testing' }));
    chai.spy.on((global as any).window.Cardinal, 'continue');
    chai.spy.on(http, 'cardinalLookupRequest', () => ({}));
    chai.spy.on(http, 'cardinalDecode', () => ({}));

    const response = { message: 'is ok', data: { test: '2020' }};

    chai.spy.on(Cardinal.prototype, 'ccaLookup', () => Promise.resolve(response));

    const cardinal = new Cardinal();

    const res = await cardinal.init(ORDER_FIXTURE);

    expect(res).to.have.property('message');
    expect(res).to.have.property('data');

    const { data } = res;

    expect(data.test).to.be.equal(response.data.test);

    chai.spy.restore((global as any).window.Cardinal.setup);
    chai.spy.restore((global as any).window.Cardinal.configure);
    chai.spy.restore((global as any).window.Cardinal.on);
    chai.spy.restore((global as any).window.Cardinal.continue);
    chai.spy.restore(Cardinal.prototype);
    chai.spy.restore(http);

  });

  /*
  it('ccaLookup - should respond successfully', async()=>{

    const sessionId = '1234';

    const lookupRespose = {
      'OrderDetails': {
        'Amount': 2000,
        'CurrencyCode': '340',
        'TransactionId': '1KPxXAmEF760Yt4tdMc0',
        'OrderDescription': 'prueba',
        'OrderChannel': 'S',
        'OrderNumber': '29cb58df-3b0f-4827-ba50-b0a5fea5a93a'
      },
      'Consumer': {
        'Email1': 'angel@clinpays.com',
        'Account': {
          'CardCode': '258',
          'AccountNumber': '4000000000000002',
          'ExpirationYear': '2025',
          'ExpirationMonth': '10',
          'NameOnAccount': 'Angel Gonzalez'
        },
        'BillingAddress': {
          'Phone1': '+50487876625',
          'LastName': 'Gonzalez',
          'PostalCode': '21112',
          'FirstName': 'Angel',
          'CountryCode': '340',
          'City': 'Tegucigalpa',
          'State': 'FM',
          'Address1': 'Ojojona FM'
        },
        'ShippingAddress': {}
      },
      'lookupResponse': {
        'RawACSUrl': 'https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/pareq.jsp?vaa=b&gold=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'AuthenticationPath': 'ENROLLED',
        'CardBin': '400000',
        'ThreeDSVersion': '1.0.2',
        'ErrorDesc': '',
        'ACSUrl': 'https://0eafstag.cardinalcommerce.com/EAFService/jsp/v1/redirect',
        'ErrorNo': '0',
        'Payload': 'P.b5daaaf5ba63713376b08070bc12fa1b7213f4642086dc107b6d7e19cb07b96289ffaec2c885ee1cf2dec43cf01271203f68f4a83e95fd8392ed422122e792e7',
        'EciFlag': '07',
        'Enrolled': 'Y',
        'TransactionId': '1KPxXAmEF760Yt4tdMc0',
        'OrderId': '8000463415298663',
        'CardBrand': 'VISA'
      }
    };

    (global as any).window = cardinalMock({ ...lookupRespose });

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZWU3ZDc0MC02ZjVlLTQ4NjYtOGYwOS1lNWU4MjQ5ODdmY2UiLCJpc3MiOiI1YWY5YmM2MjZmZTNkMTE3NzRmYjg0ZWYiLCJQYXlsb2FkIjp7ImN2diI6IjI1OCIsImVtYWlsIjoiYW5nZWxAY2xpbnBheXMuY29tIiwibGFzdE5hbWUiOiJHb256YWxleiIsInZhbGlkVGhydSI6IjEwLzI1IiwiZmlyc3ROYW1lIjoiQW5nZWwiLCJkZXNjcmlwdGlvbiI6InBydWViYSIsIm1vYmlsZVBob25lIjoiKzUwNDg3ODc2NjI1Iiwib3JkZXJOdW1iZXIiOiIyOWNiNThkZi0zYjBmLTQ4MjctYmE1MC1iMGE1ZmVhNWE5M2EiLCJiaWxsaW5nQ2l0eSI6IlRlZ3VjaWdhbHBhIiwiY3VzdG9tZXJOYW1lIjoiQW5nZWwgR29uesOhbGV6IiwiYmlsbGluZ1N0YXRlIjoiRk0iLCJzYWZlSWRlbnRpZmllciI6IjQwMDAwMDAwMDAwMDAwMDIiLCJiaWxsaW5nQWRkcmVzczEiOiJPam9qb25hIEZNIiwiYmlsbGluZ0NvdW50cnlDb2RlIjoiMzQwIiwiYW1vdW50IjoyMH0sIk9yZ1VuaXRJZCI6IjVhZjliMjdmNmZlM2QxMTc3NGZiN2MzMCIsIlJlZmVyZW5jZUlkIjoiZGE2MTQwZjAtMjYyMi00M2U5LWJjZTMtYjgzYzNlNzM1YzllIiwiaWF0IjoxNjM3MDkzMjU1LCJPYmplY3RpZnlQYXlsb2FkIjp0cnVlfQ.iiQwWUGxtahRGJ7yBZmkaZiTDB1SAZUY3fKAmCa4qNA';

    //chai.spy.on((global as any).window.Cardinal, 'setup');
    //chai.spy.on((global as any).window.Cardinal, 'configure', ()=> token);
    chai.spy.on((global as any).window.Cardinal, 'on', ()=> lookupRespose );
    chai.spy.on((global as any).window.Cardinal, 'continue');


    chai.spy.on(http, 'cardinalLookupRequest', ()=>Promise.resolve(lookupRespose));
    //chai.spy.on(http, 'cardinalDecode', ()=>Promise.resolve({}));
    //chai.spy.on(Cardinal.prototype, 'ccaLookup', ()=> Promise.resolve(response));

    const cardinal = new Cardinal();

    //await  cardinal.configure(token);
    const res = await cardinal.init(ORDER_FIXTURE);



    chai.spy.restore((global as any).window.Cardinal.setup);
    //chai.spy.restore((global as any).window.Cardinal.configure);
    chai.spy.restore((global as any).window.Cardinal.on);
    chai.spy.restore((global as any).window.Cardinal.continue);
    //chai.spy.restore(Cardinal.prototype);
    chai.spy.restore(http);

  });
*/
});
