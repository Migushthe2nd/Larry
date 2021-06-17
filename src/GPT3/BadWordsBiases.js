/*
    This file exports the bad word list as tokens ids with a negative bias value
 */

const {tokenizeToBiases} = require("./Personalities");
const {encode} = require("gpt-3-encoder");

const N_LIGHT = -2;
const N_MEDIUM = -10;
const N_HEAVY = -20;
const N_BANNED = -100;

const BAD_WORDS = {
    // General words
    "shit": N_LIGHT,
    "nigger": N_BANNED,
    "niggggad": N_BANNED,
    "nigae": N_BANNED,
    "nigea": N_BANNED,
    "nigga": N_BANNED,
    "moron": N_LIGHT,
    "drugs": N_HEAVY,
    "weed": N_MEDIUM,
    "cocaine": N_MEDIUM,
    // Sexual words
    "porn": N_LIGHT,
    "nude": N_LIGHT,
    "naked": N_LIGHT,
    "sex": N_LIGHT,
    "anal": N_MEDIUM,
    "fag": N_HEAVY,
    "faggot": N_BANNED,
    "dick": N_MEDIUM,
    "suck": N_MEDIUM,
    "cock": N_MEDIUM,
    "pussy": N_LIGHT,
    "fuck": N_MEDIUM,
    "bitch": N_MEDIUM,
    "penis": N_MEDIUM,
    "cum": N_MEDIUM,
    "semen": N_MEDIUM,
    "sperm": N_MEDIUM,
    "cbt": N_MEDIUM,
    // Religion related
    "religion": N_MEDIUM,
    "christianity": N_MEDIUM,
    "islam": N_HEAVY,
    "hinduism": N_MEDIUM,
    "buddhism": N_MEDIUM,
    "sikhism": N_MEDIUM,
    "taoism": N_MEDIUM,
    "judaism": N_MEDIUM,
    "confucianism": N_MEDIUM,
    "shinto": N_MEDIUM,
    "jainism": N_MEDIUM,
    "jews": N_HEAVY,
    "jewish": N_HEAVY,
};

module.exports.BAD_WORD_BIASES = tokenizeToBiases(BAD_WORDS);