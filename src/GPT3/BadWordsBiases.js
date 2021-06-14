/*
    This file exports the bad word list as tokens ids with a negative bias value
 */

const {encode} = require("gpt-3-encoder");

const LIGHT = -25;
const MEDIUM = -50;
const HEAVY = -80;

const BAD_WORDS = {
    // General words
    "nigger": HEAVY,
    "moron": LIGHT,
    // Sexual words
    "porn": LIGHT,
    "sex": LIGHT,
    "anal": MEDIUM,
    "fag": HEAVY,
    "faggot": HEAVY,
    "dick": MEDIUM,
    "suck": MEDIUM,
    "cock": MEDIUM,
    "pussy": LIGHT,
    "fuck": MEDIUM,
    "bitch": MEDIUM,
    "penis": MEDIUM,
    "cum": MEDIUM,
    "semen": MEDIUM,
    "sperm": MEDIUM,
    // Religion related
    "religion": MEDIUM,
    "christianity": MEDIUM,
    "islam": HEAVY,
    "hinduism": MEDIUM,
    "buddhism": MEDIUM,
    "sikhism": MEDIUM,
    "taoism": MEDIUM,
    "judaism": MEDIUM,
    "confucianism": MEDIUM,
    "shinto": MEDIUM,
    "jainism": MEDIUM,
    "jews": HEAVY,
    "jewish": HEAVY,
};

const tokenized = {};
Object.keys(BAD_WORDS).forEach((word) => {
    encode(word).forEach((token) => {
        tokenized[token] = BAD_WORDS[word];
    })
});

module.exports.BAD_WORD_BIASES = tokenized;