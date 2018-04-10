const expect = require('expect');

const {isRealString} = require('../server/utils/validation');

describe('isRealString', () => {
    it('Should reject none-string value', () => {
        var res = isRealString(89);
        expect(res).toBe(false);
    });

    it('Should reject string with only spaces', () => {
        var res = isRealString(' ');
        expect(res).toBe(false);
    });

    it('Should allow string with non-spaces characters', () => {
        var res = isRealString(' Behi ');
        expect(res).toBe(true);
    });
});