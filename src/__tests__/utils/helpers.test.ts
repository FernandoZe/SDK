import chai, { expect } from 'chai';
import { numerize } from './../../utils/helpers';

describe('helpers file ', ()=>{


  it('numerize - should convert a number with letters to just the number', ()=>{
    const numWithLetters = '20fff';
    const res  = numerize(numWithLetters);
    expect(res).to.be.an('number').equal(20);
  });

});
