const crypto = require('crypto');
const bleach = require('bleach');
const this_3rdparty = require('validator');

const AppSettings = require('./../settings/service');
const QuerySettings = AppSettings.query;
const UserSettings = AppSettings.users;
const AppConstants = require('../settings/constants');
const Errors = require('./errors');

const Types = {
    EMAIL: 'email',
    STRING: 'string',
    DATE: 'date',
    PHONE: 'phone',
    BOOLEAN: 'boolean',
    INTEGER: 'integer',
    FLOAT: 'float'
};

const Alter = {
    LOWERCASE: 1,
    SANITIZE_STRING: 2,
    HASH: 3,
    PRETTIFY_NAME: 4
};

class Validator {
    constructor(rules) {
        this.rules = rules;
        this.type_validators = {};
        this.type_validators[Types.EMAIL] = this.isEmail.bind(this);
        this.type_validators[Types.STRING] = this.isString.bind(this);
        this.type_validators[Types.DATE] = this.isDate.bind(this);
        this.type_validators[Types.PHONE] = this.isPhone.bind(this);
        this.type_validators[Types.BOOLEAN] = this.isBoolean.bind(this);
        this.type_validators[Types.INTEGER] = this.isInteger.bind(this);
        this.type_validators[Types.FLOAT] = this.isFloat.bind(this);

        this.alter_table = {};
        this.alter_table[Alter.LOWERCASE] = this.toLowerCase.bind(this);
        this.alter_table[Alter.SANITIZE_STRING] = this.sanitizeString.bind(this);
        this.alter_table[Alter.HASH] = this.generateHash.bind(this);
        this.alter_table[Alter.PRETTIFY_NAME] = this.prettifyName.bind(this);
    }

    validate(data, rule, required) {
        if (!data) {
            if (required) throw Errors.MISSING_REQUIRED_PARAMETER;
            return data;
        }
        if (!this.validateByType(data, rule)) {
            console.log('validate by type error');
            throw Errors.INVALID_INPUT_DATA;
        }
        if (!this.validateByCondition(data, rule)) {
            console.log('validate by condition error');
            throw Errors.INVALID_INPUT_DATA;
        }
        return this.alterData(data, rule.alter);
    }

    validateAll(properties, options) {
        options = options || {};
        options.required_fields = options.required_fields || [];
        Object.keys(this.rules).forEach(rule => {
            properties[rule] = this.validate(properties[rule], this.rules[rule], options.required_fields.includes(rule));
        });
        return properties;
    }

    validateByType(data, rule) {
        if (!data) return false;
        if (!this.type_validators[rule.type]) return true;
        return this.type_validators[rule.type](data);
    }

    validateByCondition(data, rule) {
        const value = (typeof data === 'string') ? data.length : data;
        if (rule.hasOwnProperty('minlength') && value < rule.minlength) {
            return false;
        }
        if (rule.hasOwnProperty('maxlength') && value > rule.maxlength) {
            return false;
        }
        if (rule.prohibited_special_characters) {
            let reg = new RegExp(rule.prohibited_special_characters);
            return !reg.test(data);
        }
        return true;
    }

    alterData(data, alter) {
        if (!alter || !this.alter_table[alter]) return data;
        return this.alter_table[alter](data);
    }

    isURL(url, aggressive) {
        if (!url) return !aggressive;
        return this_3rdparty.isURL(url);
    }

    isEmail(email) {
        if (!email) return false;
        return this_3rdparty.isEmail(email);
    }

    isIP(ip) {
        if (!ip) return false;
        return this_3rdparty.isIP(ip);
    }

    isFloat(float) {
        return isFinite(parseFloat(float));
    }

    isInteger(num) {
        return isFinite(parseInt(num))
    }

    isDate(date) {
        return !isNaN(Date.parse(date));
    }

    isString(str) {
        return (typeof str === 'string');
    }

    isPhone(ph) {
        return (this.isString(ph) || this.isInteger(ph));
    }

    isBoolean(b) {
        return (typeof(b) === 'boolean') || (typeof(b) === 'string' && '10malefemaletruefalseyesno'.includes(b));
    }

    sanitizeQueryOffset(offset) {
        offset = parseInt(offset);
        if (!this.isInteger(offset)) {
            return QuerySettings.offset_min;
        }
        return offset >= QuerySettings.offset_min && offset <= QuerySettings.offset_max ? offset : QuerySettings.offset_min;
    }

    sanitizeQueryLimit(limit) {
        limit = parseInt(limit);
        if (!this.isInteger(limit)) {
            return QuerySettings.limit_max;
        }
        return limit >= QuerySettings.limit_min && limit <= QuerySettings.limit_max ? limit : QuerySettings.limit_max;
    }

    sanitizePassword(pass) {
        if (!pass) throw Error('no password');
        return crypto.createHash('sha1').update(pass + AppConstants.hash_salt).digest('hex');
    }

    toLowerCase(str) {
        return (str || '').toLowerCase();
    }

    sanitizeString(str) {
        return bleach.sanitize(str || '');
    }

    generateHash(str) {
        if (!str || typeof(str) !== 'string') return str;
        return crypto.createHash('sha1').update(str + AppConstants.hash_salt).digest('hex');
    }

    prettifyName(str) {
        return str; // TODO: implement
    }
}

module.exports = Validator;
module.exports.Types = Types;
module.exports.Alter = Alter;
