const expect = require('expect');

const {generateMessage} = require('../server/utils/message');

describe('generateMessage', () => {
    it('Should generate correct message object', () => {
       var from = 'Jen';
       var text = 'Some message';
       var messages = {from, text};

       expect(messages.createdAt).toBeDate;
       expect(messages).toEqual({from,text});

    });
});