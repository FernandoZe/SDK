import { expect } from 'chai';
import { cardinalMock } from '../mocks';


describe('utils/cardinalMock', ()=>{
  it('cardinalMock - should return cardinal mock object successfully', ()=>{
    const res = cardinalMock({});


    expect(res).to.be.an('object');
    expect(res).to.have.property('Cardinal');

    const { Cardinal } = res;

    expect(Cardinal).to.have.property('on');
    expect(Cardinal).to.have.property('setup');
    expect(Cardinal).to.have.property('continue');
    expect(Cardinal).to.have.property('configure');

    const result =  Cardinal.continue('test', { stack: true }, { amount: 20 });
    expect(result).to.have.property('type');
    expect(result).to.have.property('auth');
    expect(result).to.have.property('details');

  });
});
