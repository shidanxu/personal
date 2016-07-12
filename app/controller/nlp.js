var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var utils = {};

utils.refine = function(content) {
    console.log(content);
    console.log(tokenizer.tokenize(content));
    return content;
};

module.exports = utils;