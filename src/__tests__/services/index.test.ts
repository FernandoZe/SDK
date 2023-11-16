import spies from 'chai-spies';
import chai, { expect } from 'chai';
import  chaiAsPromised from 'chai-as-promised';

import { account } from '../../configs';
import * as index from './../../services/index';
import { cardinalMock } from '../mocks';


chai.use(chaiAsPromised);
chai.use(spies);

describe('services/index', () => {

  beforeAll(()=>{
    (global as any).window = cardinalMock({});
    (global as any).document = {
      createElement: ()=>({}),
      body: {
        appendChild: function (script:any) {}
      }
    };

    chai.spy.on(index, 'initializeCardinalService');
  });

  it('validateService - should call initializeCardinalService correctly ', async ()=>{


    const accountSettingsMock = {
      isActive: true,
      service3DS: true,
      displayName: 'Pasteles Robles',
      _id: '60aecca067a7340f96d93794',
      songbirdUrl: 'https://songbirdstag.cardinalcommerce.com/edge/v1/songbird.js'
    };

    account.setData(accountSettingsMock);
    index.validateService();

    expect(index.initializeCardinalService).to.have.been.called;

  });
});
