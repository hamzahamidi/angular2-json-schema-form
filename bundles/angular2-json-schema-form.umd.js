(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('@angular/core'), require('lodash'), require('@angular/forms'), require('ajv'), require('@angular/platform-browser'), require('@angular/common'), require('@angular/flex-layout'), require('@angular/material')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs', '@angular/core', 'lodash', '@angular/forms', 'ajv', '@angular/platform-browser', '@angular/common', '@angular/flex-layout', '@angular/material'], factory) :
	(factory((global.angular2JsonSchemaForm = {}),global.rxjs,global.ng.core,global._,global.ng.forms,global.Ajv,global.ng.platformBrowser,global.ng.common,global.ng.flexLayout,global.ng.material));
}(this, (function (exports,rxjs,core,_,forms,Ajv,platformBrowser,common,flexLayout,material) { 'use strict';

function _executeValidators(control, validators, invert) {
    if (invert === void 0) { invert = false; }
    return validators.map(function (validator) { return validator(control, invert); });
}
function _executeAsyncValidators(control, validators, invert) {
    if (invert === void 0) { invert = false; }
    return validators.map(function (validator) { return validator(control, invert); });
}
function _mergeObjects() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var mergedObject = {};
    for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
        var currentObject = objects_1[_a];
        if (isObject(currentObject)) {
            for (var _b = 0, _c = Object.keys(currentObject); _b < _c.length; _b++) {
                var key = _c[_b];
                var currentValue = currentObject[key];
                var mergedValue = mergedObject[key];
                mergedObject[key] = !isDefined(mergedValue) ? currentValue :
                    key === 'not' && isBoolean(mergedValue, 'strict') &&
                        isBoolean(currentValue, 'strict') ? xor(mergedValue, currentValue) :
                        getType(mergedValue) === 'object' && getType(currentValue) === 'object' ?
                            _mergeObjects(mergedValue, currentValue) :
                            currentValue;
            }
        }
    }
    return mergedObject;
}
function _mergeErrors(arrayOfErrors) {
    var mergedErrors = _mergeObjects.apply(void 0, arrayOfErrors);
    return isEmpty(mergedErrors) ? null : mergedErrors;
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function hasValue(value) {
    return value !== undefined && value !== null && value !== '';
}
function isEmpty(value) {
    if (isArray(value)) {
        return !value.length;
    }
    if (isObject(value)) {
        return !Object.keys(value).length;
    }
    return value === undefined || value === null || value === '';
}
function isString(value) {
    return typeof value === 'string';
}
function isNumber(value, strict) {
    if (strict === void 0) { strict = false; }
    if (strict && typeof value !== 'number') {
        return false;
    }
    return !isNaN(value) && value !== value / 0;
}
function isInteger(value, strict) {
    if (strict === void 0) { strict = false; }
    if (strict && typeof value !== 'number') {
        return false;
    }
    return !isNaN(value) && value !== value / 0 && value % 1 === 0;
}
function isBoolean(value, option) {
    if (option === void 0) { option = null; }
    if (option === 'strict') {
        return value === true || value === false;
    }
    if (option === true) {
        return value === true || value === 1 || value === 'true' || value === '1';
    }
    if (option === false) {
        return value === false || value === 0 || value === 'false' || value === '0';
    }
    return value === true || value === 1 || value === 'true' || value === '1' ||
        value === false || value === 0 || value === 'false' || value === '0';
}
function isFunction(item) {
    return typeof item === 'function';
}
function isObject(item) {
    return item !== null && typeof item === 'object' &&
        Object.prototype.toString.call(item) === '[object Object]';
}
function isArray(item) {
    return Array.isArray(item) ||
        Object.prototype.toString.call(item) === '[object Array]';
}
function isDate(item) {
    return typeof item === 'object' &&
        Object.prototype.toString.call(item) === '[object Date]';
}
function isMap(item) {
    return typeof item === 'object' &&
        Object.prototype.toString.call(item) === '[object Map]';
}
function isSet(item) {
    return typeof item === 'object' &&
        Object.prototype.toString.call(item) === '[object Set]';
}

function getType(value, strict) {
    if (strict === void 0) { strict = false; }
    if (!isDefined(value)) {
        return 'null';
    }
    if (isArray(value)) {
        return 'array';
    }
    if (isObject(value)) {
        return 'object';
    }
    if (isBoolean(value, 'strict')) {
        return 'boolean';
    }
    if (isInteger(value, strict)) {
        return 'integer';
    }
    if (isNumber(value, strict)) {
        return 'number';
    }
    if (isString(value) || (!strict && isDate(value))) {
        return 'string';
    }
    return null;
}
function isType(value, type) {
    switch (type) {
        case 'string':
            return isString(value) || isDate(value);
        case 'number':
            return isNumber(value);
        case 'integer':
            return isInteger(value);
        case 'boolean':
            return isBoolean(value);
        case 'null':
            return !hasValue(value);
        default:
            console.error("isType error: \"" + type + "\" is not a recognized type.");
            return null;
    }
}
function isPrimitive(value) {
    return (isString(value) || isNumber(value) ||
        isBoolean(value, 'strict') || value === null);
}
function toJavaScriptType(value, types, strictIntegers) {
    if (strictIntegers === void 0) { strictIntegers = true; }
    if (!isDefined(value)) {
        return null;
    }
    if (isString(types)) {
        types = [types];
    }
    if (strictIntegers && inArray('integer', types)) {
        if (isInteger(value, 'strict')) {
            return value;
        }
        if (isInteger(value)) {
            return parseInt(value, 10);
        }
    }
    if (inArray('number', types) || (!strictIntegers && inArray('integer', types))) {
        if (isNumber(value, 'strict')) {
            return value;
        }
        if (isNumber(value)) {
            return parseFloat(value);
        }
    }
    if (inArray('string', types)) {
        if (isString(value)) {
            return value;
        }
        if (isDate(value)) {
            return value.toISOString().slice(0, 10);
        }
        if (isNumber(value)) {
            return value.toString();
        }
    }
    if (isDate(value) && (inArray('integer', types) || inArray('number', types))) {
        return value.getTime();
    }
    if (inArray('boolean', types)) {
        if (isBoolean(value, true)) {
            return true;
        }
        if (isBoolean(value, false)) {
            return false;
        }
    }
    return null;
}
function toSchemaType(value, types) {
    if (!isArray(types)) {
        types = [types];
    }
    if (types.includes('null') && !hasValue(value)) {
        return null;
    }
    if (types.includes('boolean') && !isBoolean(value, 'strict')) {
        return value;
    }
    if (types.includes('integer')) {
        var testValue = toJavaScriptType(value, 'integer');
        if (testValue !== null) {
            return +testValue;
        }
    }
    if (types.includes('number')) {
        var testValue = toJavaScriptType(value, 'number');
        if (testValue !== null) {
            return +testValue;
        }
    }
    if ((isString(value) || isNumber(value, 'strict')) &&
        types.includes('string')) {
        return toJavaScriptType(value, 'string');
    }
    if (types.includes('boolean') && isBoolean(value)) {
        return toJavaScriptType(value, 'boolean');
    }
    if (types.includes('string')) {
        if (value === null) {
            return '';
        }
        var testValue = toJavaScriptType(value, 'string');
        if (testValue !== null) {
            return testValue;
        }
    }
    if ((types.includes('number') ||
        types.includes('integer'))) {
        if (value === true) {
            return 1;
        }
        if (value === false || value === null || value === '') {
            return 0;
        }
    }
    if (types.includes('number')) {
        var testValue = parseFloat(value);
        if (!!testValue) {
            return testValue;
        }
    }
    if (types.includes('integer')) {
        var testValue = parseInt(value, 10);
        if (!!testValue) {
            return testValue;
        }
    }
    if (types.includes('boolean')) {
        return !!value;
    }
    if ((types.includes('number') ||
        types.includes('integer')) && !types.includes('null')) {
        return 0;
    }
}
function isPromise(object) {
    return !!object && typeof object.then === 'function';
}
function isObservable(object) {
    return !!object && typeof object.subscribe === 'function';
}
function _toPromise(object) {
    return isPromise(object) ? object : object.toPromise();
}
function toObservable(object) {
    var observable = isPromise(object) ? rxjs.from(object) : object;
    if (isObservable(observable)) {
        return observable;
    }
    console.error('toObservable error: Expected validator to return Promise or Observable.');
    return new rxjs.Observable();
}
function inArray(item, array, allIn) {
    if (allIn === void 0) { allIn = false; }
    if (!isDefined(item) || !isArray(array)) {
        return false;
    }
    return isArray(item) ?
        item[allIn ? 'every' : 'some'](function (subItem) { return array.includes(subItem); }) :
        array.includes(item);
}
function xor(value1, value2) {
    return (!!value1 && !value2) || (!value1 && !!value2);
}

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function addClasses(oldClasses, newClasses) {
    var badType = function (i) { return !isSet(i) && !isArray(i) && !isString(i); };
    if (badType(newClasses)) {
        return oldClasses;
    }
    if (badType(oldClasses)) {
        oldClasses = '';
    }
    var toSet = function (i) { return isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' ')); };
    var combinedSet = toSet(oldClasses);
    var newSet = toSet(newClasses);
    newSet.forEach(function (c) { return combinedSet.add(c); });
    if (isSet(oldClasses)) {
        return combinedSet;
    }
    if (isArray(oldClasses)) {
        return Array.from(combinedSet);
    }
    return Array.from(combinedSet).join(' ');
}
function copy(object, errors) {
    if (errors === void 0) { errors = false; }
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (isMap(object)) {
        return new Map(object);
    }
    if (isSet(object)) {
        return new Set(object);
    }
    if (isArray(object)) {
        return object.slice();
    }
    if (isObject(object)) {
        return __assign({}, object);
    }
    if (errors) {
        console.error('copy error: Object to copy must be a JavaScript object or value.');
    }
    return object;
}
function forEach(object, fn, recurse, rootObject, errors) {
    if (recurse === void 0) { recurse = false; }
    if (rootObject === void 0) { rootObject = object; }
    if (errors === void 0) { errors = false; }
    if (isEmpty(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof fn === 'function') {
        for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = object[key];
            if (recurse === 'bottom-up' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
            fn(value, key, object, rootObject);
            if (recurse === 'top-down' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
        }
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEach error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEach error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
}
function forEachCopy(object, fn, errors) {
    if (errors === void 0) { errors = false; }
    if (!hasValue(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
        var newObject = isArray(object) ? [] : {};
        for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
            var key = _a[_i];
            newObject[key] = fn(object[key], key, object);
        }
        return newObject;
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEachCopy error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEachCopy error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
}
function hasOwn(object, property) {
    if (!object || !['number', 'string', 'symbol'].includes(typeof property) ||
        (!isObject(object) && !isArray(object) && !isMap(object) && !isSet(object))) {
        return false;
    }
    if (isMap(object) || isSet(object)) {
        return object.has(property);
    }
    if (typeof property === 'number') {
        if (isArray(object)) {
            return object[property];
        }
        property = property + '';
    }
    return object.hasOwnProperty(property);
}
function mergeFilteredObject(targetObject, sourceObject, excludeKeys, keyFn, valFn) {
    if (excludeKeys === void 0) { excludeKeys = []; }
    if (keyFn === void 0) { keyFn = function (key) { return key; }; }
    if (valFn === void 0) { valFn = function (val) { return val; }; }
    if (!isObject(sourceObject)) {
        return targetObject;
    }
    if (!isObject(targetObject)) {
        targetObject = {};
    }
    for (var _i = 0, _a = Object.keys(sourceObject); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!inArray(key, excludeKeys) && isDefined(sourceObject[key])) {
            targetObject[keyFn(key)] = valFn(sourceObject[key]);
        }
    }
    return targetObject;
}
function uniqueItems() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var returnItems = [];
    for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
        var item = items_1[_a];
        if (!returnItems.includes(item)) {
            returnItems.push(item);
        }
    }
    return returnItems;
}
function commonItems() {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    var returnItems = null;
    var _loop_1 = function (array) {
        if (isString(array)) {
            array = [array];
        }
        returnItems = returnItems === null ? array.slice() :
            returnItems.filter(function (item) { return array.includes(item); });
        if (!returnItems.length) {
            return { value: [] };
        }
    };
    for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
        var array = arrays_1[_a];
        var state_1 = _loop_1(array);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return returnItems;
}
function fixTitle(name) {
    return name && toTitleCase(name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '));
}
function toTitleCase(input, forceWords) {
    if (!isString(input)) {
        return input;
    }
    var forceArray = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
        'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
        'vs', 'vs.', 'via'];
    if (isString(forceWords)) {
        forceWords = forceWords.split('|');
    }
    if (isArray(forceWords)) {
        forceArray = forceArray.concat(forceWords);
    }
    var forceArrayLower = forceArray.map(function (w) { return w.toLowerCase(); });
    var noInitialCase = input === input.toUpperCase() || input === input.toLowerCase();
    var prevLastChar = '';
    input = input.trim();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (word, idx) {
        if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
            return word;
        }
        else {
            var newWord = void 0;
            var forceWord = forceArray[forceArrayLower.indexOf(word.toLowerCase())];
            if (!forceWord) {
                if (noInitialCase) {
                    if (word.slice(1).search(/\../) !== -1) {
                        newWord = word.toLowerCase();
                    }
                    else {
                        newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
                    }
                }
                else {
                    newWord = word[0].toUpperCase() + word.slice(1);
                }
            }
            else if (forceWord === forceWord.toLowerCase() && (idx === 0 || idx + word.length === input.length ||
                prevLastChar === ':' || input[idx - 1].search(/[^\s-]/) !== -1 ||
                (input[idx - 1] !== '-' && input[idx + word.length] === '-'))) {
                newWord = forceWord[0].toUpperCase() + forceWord.slice(1);
            }
            else {
                newWord = forceWord;
            }
            prevLastChar = word.slice(-1);
            return newWord;
        }
    });
}

var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var JsonPointer = (function () {
    function JsonPointer() {
    }
    JsonPointer.get = function (object, pointer, startSlice, endSlice, getBoolean, errors) {
        if (startSlice === void 0) { startSlice = 0; }
        if (endSlice === void 0) { endSlice = null; }
        if (getBoolean === void 0) { getBoolean = false; }
        if (errors === void 0) { errors = false; }
        if (object === null) {
            return getBoolean ? false : undefined;
        }
        var keyArray = this.parse(pointer, errors);
        if (typeof object === 'object' && keyArray !== null) {
            var subObject = object;
            if (startSlice >= keyArray.length || endSlice <= -keyArray.length) {
                return object;
            }
            if (startSlice <= -keyArray.length) {
                startSlice = 0;
            }
            if (!isDefined(endSlice) || endSlice >= keyArray.length) {
                endSlice = keyArray.length;
            }
            keyArray = keyArray.slice(startSlice, endSlice);
            for (var _i = 0, keyArray_1 = keyArray; _i < keyArray_1.length; _i++) {
                var key = keyArray_1[_i];
                if (key === '-' && isArray(subObject) && subObject.length) {
                    key = subObject.length - 1;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject = subObject.get(key);
                }
                else if (typeof subObject === 'object' && subObject !== null &&
                    hasOwn(subObject, key)) {
                    subObject = subObject[key];
                }
                else {
                    if (errors) {
                        console.error("get error: \"" + key + "\" key not found in object.");
                        console.error(pointer);
                        console.error(object);
                    }
                    return getBoolean ? false : undefined;
                }
            }
            return getBoolean ? true : subObject;
        }
        if (errors && keyArray === null) {
            console.error("get error: Invalid JSON Pointer: " + pointer);
        }
        if (errors && typeof object !== 'object') {
            console.error('get error: Invalid object:');
            console.error(object);
        }
        return getBoolean ? false : undefined;
    };
    JsonPointer.getCopy = function (object, pointer, startSlice, endSlice, getBoolean, errors) {
        if (startSlice === void 0) { startSlice = 0; }
        if (endSlice === void 0) { endSlice = null; }
        if (getBoolean === void 0) { getBoolean = false; }
        if (errors === void 0) { errors = false; }
        var objectToCopy = this.get(object, pointer, startSlice, endSlice, getBoolean, errors);
        return this.forEachDeepCopy(objectToCopy);
    };
    JsonPointer.getFirst = function (items, defaultValue, getCopy) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (getCopy === void 0) { getCopy = false; }
        if (isEmpty(items)) {
            return;
        }
        if (isArray(items)) {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (isEmpty(item)) {
                    continue;
                }
                if (isArray(item) && item.length >= 2) {
                    if (isEmpty(item[0]) || isEmpty(item[1])) {
                        continue;
                    }
                    var value = getCopy ?
                        this.getCopy(item[0], item[1]) :
                        this.get(item[0], item[1]);
                    if (value) {
                        return value;
                    }
                    continue;
                }
                console.error('getFirst error: Input not in correct format.\n' +
                    'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
                return;
            }
            return defaultValue;
        }
        if (isMap(items)) {
            for (var _a = 0, items_2 = items; _a < items_2.length; _a++) {
                var _b = items_2[_a], object = _b[0], pointer = _b[1];
                if (object === null || !this.isJsonPointer(pointer)) {
                    continue;
                }
                var value = getCopy ?
                    this.getCopy(object, pointer) :
                    this.get(object, pointer);
                if (value) {
                    return value;
                }
            }
            return defaultValue;
        }
        console.error('getFirst error: Input not in correct format.\n' +
            'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
        return defaultValue;
    };
    JsonPointer.getFirstCopy = function (items, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var firstCopy = this.getFirst(items, defaultValue, true);
        return firstCopy;
    };
    JsonPointer.set = function (object, pointer, value, insert) {
        if (insert === void 0) { insert = false; }
        var keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            var subObject = object;
            for (var i = 0; i < keyArray.length - 1; ++i) {
                var key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject = subObject[key];
                }
            }
            var lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return object;
        }
        console.error("set error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    JsonPointer.setCopy = function (object, pointer, value, insert) {
        if (insert === void 0) { insert = false; }
        var keyArray = this.parse(pointer);
        if (keyArray !== null) {
            var newObject = copy(object);
            var subObject = newObject;
            for (var i = 0; i < keyArray.length - 1; ++i) {
                var key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject.set(key, copy(subObject.get(key)));
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject[key] = copy(subObject[key]);
                    subObject = subObject[key];
                }
            }
            var lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return newObject;
        }
        console.error("setCopy error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    JsonPointer.insert = function (object, pointer, value) {
        var updatedObject = this.set(object, pointer, value, true);
        return updatedObject;
    };
    JsonPointer.insertCopy = function (object, pointer, value) {
        var updatedObject = this.setCopy(object, pointer, value, true);
        return updatedObject;
    };
    JsonPointer.remove = function (object, pointer) {
        var keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            var lastKey = keyArray.pop();
            var parentObject = this.get(object, keyArray);
            if (isArray(parentObject)) {
                if (lastKey === '-') {
                    lastKey = parentObject.length - 1;
                }
                parentObject.splice(lastKey, 1);
            }
            else if (isObject(parentObject)) {
                delete parentObject[lastKey];
            }
            return object;
        }
        console.error("remove error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    JsonPointer.has = function (object, pointer) {
        var hasValue$$1 = this.get(object, pointer, 0, null, true);
        return hasValue$$1;
    };
    JsonPointer.dict = function (object) {
        var results = {};
        this.forEachDeep(object, function (value, pointer) {
            if (typeof value !== 'object') {
                results[pointer] = value;
            }
        });
        return results;
    };
    JsonPointer.forEachDeep = function (object, fn, bottomUp, pointer, rootObject) {
        if (fn === void 0) { fn = function (v) { return v; }; }
        if (bottomUp === void 0) { bottomUp = false; }
        if (pointer === void 0) { pointer = ''; }
        if (rootObject === void 0) { rootObject = object; }
        if (typeof fn !== 'function') {
            console.error("forEachDeep error: Iterator is not a function:", fn);
            return;
        }
        if (!bottomUp) {
            fn(object, pointer, rootObject);
        }
        if (isObject(object) || isArray(object)) {
            for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
                var key = _a[_i];
                var newPointer = pointer + '/' + this.escape(key);
                this.forEachDeep(object[key], fn, bottomUp, newPointer, rootObject);
            }
        }
        if (bottomUp) {
            fn(object, pointer, rootObject);
        }
    };
    JsonPointer.forEachDeepCopy = function (object, fn, bottomUp, pointer, rootObject) {
        if (fn === void 0) { fn = function (v) { return v; }; }
        if (bottomUp === void 0) { bottomUp = false; }
        if (pointer === void 0) { pointer = ''; }
        if (rootObject === void 0) { rootObject = object; }
        if (typeof fn !== 'function') {
            console.error("forEachDeepCopy error: Iterator is not a function:", fn);
            return null;
        }
        if (isObject(object) || isArray(object)) {
            var newObject = isArray(object) ? object.slice() : __assign$1({}, object);
            if (!bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            for (var _i = 0, _a = Object.keys(newObject); _i < _a.length; _i++) {
                var key = _a[_i];
                var newPointer = pointer + '/' + this.escape(key);
                newObject[key] = this.forEachDeepCopy(newObject[key], fn, bottomUp, newPointer, rootObject);
            }
            if (bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            return newObject;
        }
        else {
            return fn(object, pointer, rootObject);
        }
    };
    JsonPointer.escape = function (key) {
        var escaped = key.toString().replace(/~/g, '~0').replace(/\//g, '~1');
        return escaped;
    };
    JsonPointer.unescape = function (key) {
        var unescaped = key.toString().replace(/~1/g, '/').replace(/~0/g, '~');
        return unescaped;
    };
    JsonPointer.parse = function (pointer, errors) {
        if (errors === void 0) { errors = false; }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error("parse error: Invalid JSON Pointer: " + pointer);
            }
            return null;
        }
        if (isArray(pointer)) {
            return pointer;
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            if (pointer === '' || pointer === '/') {
                return [];
            }
            return pointer.slice(1).split('/').map(this.unescape);
        }
    };
    JsonPointer.compile = function (pointer, defaultValue, errors) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = ''; }
        if (errors === void 0) { errors = false; }
        if (pointer === '#') {
            return '';
        }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error("compile error: Invalid JSON Pointer: " + pointer);
            }
            return null;
        }
        if (isArray(pointer)) {
            if (pointer.length === 0) {
                return '';
            }
            return '/' + pointer.map(function (key) { return key === '' ? defaultValue : _this.escape(key); }).join('/');
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            return pointer;
        }
    };
    JsonPointer.toKey = function (pointer, errors) {
        if (errors === void 0) { errors = false; }
        var keyArray = this.parse(pointer, errors);
        if (keyArray === null) {
            return null;
        }
        if (!keyArray.length) {
            return '';
        }
        return keyArray[keyArray.length - 1];
    };
    JsonPointer.isJsonPointer = function (value) {
        if (isArray(value)) {
            return value.every(function (key) { return typeof key === 'string'; });
        }
        else if (isString(value)) {
            if (value === '' || value === '#') {
                return true;
            }
            if (value[0] === '/' || value.slice(0, 2) === '#/') {
                return !/(~[^01]|~$)/g.test(value);
            }
        }
        return false;
    };
    JsonPointer.isSubPointer = function (shortPointer, longPointer, trueIfMatching, errors) {
        if (trueIfMatching === void 0) { trueIfMatching = false; }
        if (errors === void 0) { errors = false; }
        if (!this.isJsonPointer(shortPointer) || !this.isJsonPointer(longPointer)) {
            if (errors) {
                var invalid = '';
                if (!this.isJsonPointer(shortPointer)) {
                    invalid += " 1: " + shortPointer;
                }
                if (!this.isJsonPointer(longPointer)) {
                    invalid += " 2: " + longPointer;
                }
                console.error("isSubPointer error: Invalid JSON Pointer " + invalid);
            }
            return;
        }
        shortPointer = this.compile(shortPointer, '', errors);
        longPointer = this.compile(longPointer, '', errors);
        return shortPointer === longPointer ? trueIfMatching :
            shortPointer + "/" === longPointer.slice(0, shortPointer.length + 1);
    };
    JsonPointer.toIndexedPointer = function (genericPointer, indexArray, arrayMap) {
        if (arrayMap === void 0) { arrayMap = null; }
        if (this.isJsonPointer(genericPointer) && isArray(indexArray)) {
            var indexedPointer_1 = this.compile(genericPointer);
            if (isMap(arrayMap)) {
                var arrayIndex_1 = 0;
                return indexedPointer_1.replace(/\/\-(?=\/|$)/g, function (key, stringIndex) {
                    return arrayMap.has(indexedPointer_1.slice(0, stringIndex)) ?
                        '/' + indexArray[arrayIndex_1++] : key;
                });
            }
            else {
                for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
                    var pointerIndex = indexArray_1[_i];
                    indexedPointer_1 = indexedPointer_1.replace('/-', '/' + pointerIndex);
                }
                return indexedPointer_1;
            }
        }
        if (!this.isJsonPointer(genericPointer)) {
            console.error("toIndexedPointer error: Invalid JSON Pointer: " + genericPointer);
        }
        if (!isArray(indexArray)) {
            console.error("toIndexedPointer error: Invalid indexArray: " + indexArray);
        }
    };
    
    JsonPointer.toGenericPointer = function (indexedPointer, arrayMap) {
        if (arrayMap === void 0) { arrayMap = new Map(); }
        if (this.isJsonPointer(indexedPointer) && isMap(arrayMap)) {
            var pointerArray = this.parse(indexedPointer);
            for (var i = 1; i < pointerArray.length; i++) {
                var subPointer = this.compile(pointerArray.slice(0, i));
                if (arrayMap.has(subPointer) &&
                    arrayMap.get(subPointer) <= +pointerArray[i]) {
                    pointerArray[i] = '-';
                }
            }
            return this.compile(pointerArray);
        }
        if (!this.isJsonPointer(indexedPointer)) {
            console.error("toGenericPointer error: invalid JSON Pointer: " + indexedPointer);
        }
        if (!isMap(arrayMap)) {
            console.error("toGenericPointer error: invalid arrayMap: " + arrayMap);
        }
    };
    JsonPointer.toControlPointer = function (dataPointer, formGroup, controlMustExist) {
        if (controlMustExist === void 0) { controlMustExist = false; }
        var dataPointerArray = this.parse(dataPointer);
        var controlPointerArray = [];
        var subGroup = formGroup;
        if (dataPointerArray !== null) {
            for (var _i = 0, dataPointerArray_1 = dataPointerArray; _i < dataPointerArray_1.length; _i++) {
                var key = dataPointerArray_1[_i];
                if (hasOwn(subGroup, 'controls')) {
                    controlPointerArray.push('controls');
                    subGroup = subGroup.controls;
                }
                if (isArray(subGroup) && (key === '-')) {
                    controlPointerArray.push((subGroup.length - 1).toString());
                    subGroup = subGroup[subGroup.length - 1];
                }
                else if (hasOwn(subGroup, key)) {
                    controlPointerArray.push(key);
                    subGroup = subGroup[key];
                }
                else if (controlMustExist) {
                    console.error("toControlPointer error: Unable to find \"" + key + "\" item in FormGroup.");
                    console.error(dataPointer);
                    console.error(formGroup);
                    return;
                }
                else {
                    controlPointerArray.push(key);
                    subGroup = { controls: {} };
                }
            }
            return this.compile(controlPointerArray);
        }
        console.error("toControlPointer error: Invalid JSON Pointer: " + dataPointer);
    };
    JsonPointer.toSchemaPointer = function (dataPointer, schema) {
        if (this.isJsonPointer(dataPointer) && typeof schema === 'object') {
            var pointerArray = this.parse(dataPointer);
            if (!pointerArray.length) {
                return '';
            }
            var firstKey = pointerArray.shift();
            if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
                if ((schema.properties || {})[firstKey]) {
                    return "/properties/" + this.escape(firstKey) +
                        this.toSchemaPointer(pointerArray, schema.properties[firstKey]);
                }
                else if (schema.additionalProperties) {
                    return '/additionalProperties' +
                        this.toSchemaPointer(pointerArray, schema.additionalProperties);
                }
            }
            if ((schema.type === 'array' || schema.items) &&
                (isNumber(firstKey) || firstKey === '-' || firstKey === '')) {
                var arrayItem = firstKey === '-' || firstKey === '' ? 0 : +firstKey;
                if (isArray(schema.items)) {
                    if (arrayItem < schema.items.length) {
                        return '/items/' + arrayItem +
                            this.toSchemaPointer(pointerArray, schema.items[arrayItem]);
                    }
                    else if (schema.additionalItems) {
                        return '/additionalItems' +
                            this.toSchemaPointer(pointerArray, schema.additionalItems);
                    }
                }
                else if (isObject(schema.items)) {
                    return '/items' + this.toSchemaPointer(pointerArray, schema.items);
                }
                else if (isObject(schema.additionalItems)) {
                    return '/additionalItems' +
                        this.toSchemaPointer(pointerArray, schema.additionalItems);
                }
            }
            console.error("toSchemaPointer error: Data pointer " + dataPointer + " " +
                ("not compatible with schema " + schema));
            return null;
        }
        if (!this.isJsonPointer(dataPointer)) {
            console.error("toSchemaPointer error: Invalid JSON Pointer: " + dataPointer);
        }
        if (typeof schema !== 'object') {
            console.error("toSchemaPointer error: Invalid JSON Schema: " + schema);
        }
        return null;
    };
    JsonPointer.toDataPointer = function (schemaPointer, schema, errors) {
        if (errors === void 0) { errors = false; }
        if (this.isJsonPointer(schemaPointer) && typeof schema === 'object' &&
            this.has(schema, schemaPointer)) {
            var pointerArray = this.parse(schemaPointer);
            if (!pointerArray.length) {
                return '';
            }
            var firstKey = pointerArray.shift();
            if (firstKey === 'properties' ||
                (firstKey === 'items' && isArray(schema.items))) {
                var secondKey = pointerArray.shift();
                var pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
                return pointerSuffix === null ? null : '/' + secondKey + pointerSuffix;
            }
            else if (firstKey === 'additionalItems' ||
                (firstKey === 'items' && isObject(schema.items))) {
                var pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey]);
                return pointerSuffix === null ? null : '/-' + pointerSuffix;
            }
            else if (['allOf', 'anyOf', 'oneOf'].includes(firstKey)) {
                var secondKey = pointerArray.shift();
                return this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
            }
            else if (firstKey === 'not') {
                return this.toDataPointer(pointerArray, schema[firstKey]);
            }
            else if (['contains', 'definitions', 'dependencies', 'additionalItems',
                'additionalProperties', 'patternProperties', 'propertyNames'].includes(firstKey)) {
                if (errors) {
                    console.error("toDataPointer error: Ambiguous location");
                }
            }
            return '';
        }
        if (errors) {
            if (!this.isJsonPointer(schemaPointer)) {
                console.error("toDataPointer error: Invalid JSON Pointer: " + schemaPointer);
            }
            if (typeof schema !== 'object') {
                console.error("toDataPointer error: Invalid JSON Schema: " + schema);
            }
            if (typeof schema !== 'object') {
                console.error("toDataPointer error: Pointer " + schemaPointer + " invalid for Schema: " + schema);
            }
        }
        return null;
    };
    JsonPointer.parseObjectPath = function (path) {
        if (isArray(path)) {
            return path;
        }
        if (this.isJsonPointer(path)) {
            return this.parse(path);
        }
        if (typeof path === 'string') {
            var index = 0;
            var parts = [];
            while (index < path.length) {
                var nextDot = path.indexOf('.', index);
                var nextOB = path.indexOf('[', index);
                if (nextDot === -1 && nextOB === -1) {
                    parts.push(path.slice(index));
                    index = path.length;
                }
                else if (nextDot !== -1 && (nextDot < nextOB || nextOB === -1)) {
                    parts.push(path.slice(index, nextDot));
                    index = nextDot + 1;
                }
                else {
                    if (nextOB > index) {
                        parts.push(path.slice(index, nextOB));
                        index = nextOB;
                    }
                    var quote = path.charAt(nextOB + 1);
                    if (quote === '"' || quote === "'") {
                        var nextCB = path.indexOf(quote + ']', nextOB);
                        while (nextCB !== -1 && path.charAt(nextCB - 1) === '\\') {
                            nextCB = path.indexOf(quote + ']', nextCB + 2);
                        }
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 2, nextCB)
                            .replace(new RegExp('\\' + quote, 'g'), quote));
                        index = nextCB + 2;
                    }
                    else {
                        var nextCB = path.indexOf(']', nextOB);
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 1, nextCB));
                        index = nextCB + 1;
                    }
                    if (path.charAt(index) === '.') {
                        index++;
                    }
                }
            }
            return parts;
        }
        console.error('parseObjectPath error: Input object path must be a string.');
    };
    JsonPointer.decorators = [
        { type: core.Injectable },
    ];
    return JsonPointer;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var errorObject = { e: {} };

/** PURE_IMPORTS_START _errorObject PURE_IMPORTS_END */
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject.e = e;
        return errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction$1(x) {
    return typeof x === 'function';
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = /*@__PURE__*/ new Error();
            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
    setTimeout(function () { throw err; });
}

/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError(err);
        }
    },
    complete: function () { }
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray$1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject$1(x) {
    return x != null && typeof x === 'object';
}

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var UnsubscriptionError = /*@__PURE__*/ (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        var _this = _super.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '') || this;
        _this.errors = errors;
        _this.name = 'UnsubscriptionError';
        Object.setPrototypeOf(_this, UnsubscriptionError.prototype);
        return _this;
    }
    return UnsubscriptionError;
}(Error));

/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
var Subscription = /*@__PURE__*/ (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        while (_parent) {
            _parent.remove(this);
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction$1(_unsubscribe)) {
            var trial = tryCatch(_unsubscribe).call(this);
            if (trial === errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
            }
        }
        if (isArray$1(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject$1(sub)) {
                    var trial = tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject.e;
                        if (err instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function') {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            this._parent = parent;
        }
        else if (!_parents) {
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
    ? /*@__PURE__*/ Symbol.for('rxSubscriber')
    : '@@rxSubscriber';

/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
var Subscriber = /*@__PURE__*/ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (isTrustedSubscriber(destinationOrNext)) {
                        var trustedSubscriber = destinationOrNext[rxSubscriber]();
                        _this.syncErrorThrowable = trustedSubscriber.syncErrorThrowable;
                        _this.destination = trustedSubscriber;
                        trustedSubscriber.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription));
var SafeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction$1(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== empty) {
                context = Object.create(observerOrNext);
                if (isFunction$1(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
function isTrustedSubscriber(obj) {
    return obj instanceof Subscriber || ('syncErrorThrowable' in obj && obj[rxSubscriber]);
}

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
var OuterSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
var InnerSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        _this.index = 0;
        return _this;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber]) {
            return nextOrObserver[rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber(empty);
    }
    return new Subscriber(nextOrObserver, error, complete);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop() { }

/** PURE_IMPORTS_START _noop PURE_IMPORTS_END */

function pipeFromArray(fns) {
    if (!fns) {
        return noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

/** PURE_IMPORTS_START _util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
var Observable = /*@__PURE__*/ (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable$$1 = new Observable();
        observable$$1.source = this;
        observable$$1.operator = operator;
        return observable$$1;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var subscribeToArray = function (array) {
    return function (subscriber) {
        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        if (!subscriber.closed) {
            subscriber.complete();
        }
    };
};

/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
var subscribeToPromise = function (promise) {
    return function (subscriber) {
        promise.then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, hostReportError);
        return subscriber;
    };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = /*@__PURE__*/ getSymbolIterator();

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
var subscribeToIterable = function (iterable) {
    return function (subscriber) {
        var iterator$$1 = iterable[iterator]();
        do {
            var item = iterator$$1.next();
            if (item.done) {
                subscriber.complete();
                break;
            }
            subscriber.next(item.value);
            if (subscriber.closed) {
                break;
            }
        } while (true);
        if (typeof iterator$$1.return === 'function') {
            subscriber.add(function () {
                if (iterator$$1.return) {
                    iterator$$1.return();
                }
            });
        }
        return subscriber;
    };
};

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
var subscribeToObservable = function (obj) {
    return function (subscriber) {
        var obs = obj[observable]();
        if (typeof obs.subscribe !== 'function') {
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        }
        else {
            return obs.subscribe(subscriber);
        }
    };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise$1(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}

/** PURE_IMPORTS_START _Observable,_subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
var subscribeTo = function (result) {
    if (result instanceof Observable) {
        return function (subscriber) {
            if (result._isScalar) {
                subscriber.next(result.value);
                subscriber.complete();
                return undefined;
            }
            else {
                return result.subscribe(subscriber);
            }
        };
    }
    else if (result && typeof result[observable] === 'function') {
        return subscribeToObservable(result);
    }
    else if (isArrayLike(result)) {
        return subscribeToArray(result);
    }
    else if (isPromise$1(result)) {
        return subscribeToPromise(result);
    }
    else if (result && typeof result[iterator] === 'function') {
        return subscribeToIterable(result);
    }
    else {
        var value = isObject$1(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected."
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};

/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo PURE_IMPORTS_END */
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    return subscribeTo(result)(destination);
}

/** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var AuditSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(AuditSubscriber, _super);
    function AuditSubscriber(destination, durationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.durationSelector = durationSelector;
        _this.hasValue = false;
        return _this;
    }
    AuditSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            var duration = tryCatch(this.durationSelector)(value);
            if (duration === errorObject) {
                this.destination.error(errorObject.e);
            }
            else {
                var innerSubscription = subscribeToResult(this, duration);
                if (!innerSubscription || innerSubscription.closed) {
                    this.clearThrottle();
                }
                else {
                    this.add(this.throttled = innerSubscription);
                }
            }
        }
    };
    AuditSubscriber.prototype.clearThrottle = function () {
        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    };
    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    };
    AuditSubscriber.prototype.notifyComplete = function () {
        this.clearThrottle();
    };
    return AuditSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var Action = /*@__PURE__*/ (function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return this;
    };
    return Action;
}(Subscription));

/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
var AsyncAction = /*@__PURE__*/ (function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (this.closed) {
            return this;
        }
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        return clearInterval(id) && undefined || undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(Action));

var Scheduler = /*@__PURE__*/ (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = Date.now ? Date.now : function () { return +new Date(); };
    return Scheduler;
}());

/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
var AsyncScheduler = /*@__PURE__*/ (function (_super) {
    __extends(AsyncScheduler, _super);
    function AsyncScheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        var _this = _super.call(this, SchedulerAction, function () {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                return AsyncScheduler.delegate.now();
            }
            else {
                return now();
            }
        }) || this;
        _this.actions = [];
        _this.active = false;
        _this.scheduled = undefined;
        return _this;
    }
    AsyncScheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
        }
        else {
            return _super.prototype.schedule.call(this, work, delay, state);
        }
    };
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift());
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler));

/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);

/** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
function isNumeric(val) {
    return !isArray$1(val) && (val - parseFloat(val) + 1) >= 0;
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}

/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */

/** PURE_IMPORTS_START _scheduler_async,_audit,_observable_timer PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var BufferSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(BufferSubscriber, _super);
    function BufferSubscriber(destination, closingNotifier) {
        var _this = _super.call(this, destination) || this;
        _this.buffer = [];
        _this.add(subscribeToResult(_this, closingNotifier));
        return _this;
    }
    BufferSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    };
    return BufferSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var BufferCountSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.buffer = [];
        return _this;
    }
    BufferCountSubscriber.prototype._next = function (value) {
        var buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    };
    BufferCountSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    return BufferCountSubscriber;
}(Subscriber));
var BufferSkipCountSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(BufferSkipCountSubscriber, _super);
    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.startBufferEvery = startBufferEvery;
        _this.buffers = [];
        _this.count = 0;
        return _this;
    }
    BufferSkipCountSubscriber.prototype._next = function (value) {
        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (var i = buffers.length; i--;) {
            var buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    };
    BufferSkipCountSubscriber.prototype._complete = function () {
        var _a = this, buffers = _a.buffers, destination = _a.destination;
        while (buffers.length > 0) {
            var buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        _super.prototype._complete.call(this);
    };
    return BufferSkipCountSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_scheduler_async,_Subscriber,_util_isScheduler PURE_IMPORTS_END */

var Context = /*@__PURE__*/ (function () {
    function Context() {
        this.buffer = [];
    }
    return Context;
}());
var BufferTimeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(BufferTimeSubscriber, _super);
    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.bufferTimeSpan = bufferTimeSpan;
        _this.bufferCreationInterval = bufferCreationInterval;
        _this.maxBufferSize = maxBufferSize;
        _this.scheduler = scheduler;
        _this.contexts = [];
        var context = _this.openContext();
        _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (_this.timespanOnly) {
            var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
            _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
        else {
            var closeState = { subscriber: _this, context: context };
            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
            _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
        return _this;
    }
    BufferTimeSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        var filledBufferContext;
        for (var i = 0; i < len; i++) {
            var context_1 = contexts[i];
            var buffer = context_1.buffer;
            buffer.push(value);
            if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context_1;
            }
        }
        if (filledBufferContext) {
            this.onBufferFull(filledBufferContext);
        }
    };
    BufferTimeSubscriber.prototype._error = function (err) {
        this.contexts.length = 0;
        _super.prototype._error.call(this, err);
    };
    BufferTimeSubscriber.prototype._complete = function () {
        var _a = this, contexts = _a.contexts, destination = _a.destination;
        while (contexts.length > 0) {
            var context_2 = contexts.shift();
            destination.next(context_2.buffer);
        }
        _super.prototype._complete.call(this);
    };
    BufferTimeSubscriber.prototype._unsubscribe = function () {
        this.contexts = null;
    };
    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
        this.closeContext(context);
        var closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (!this.closed && this.timespanOnly) {
            context = this.openContext();
            var bufferTimeSpan = this.bufferTimeSpan;
            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    };
    BufferTimeSubscriber.prototype.openContext = function () {
        var context = new Context();
        this.contexts.push(context);
        return context;
    };
    BufferTimeSubscriber.prototype.closeContext = function (context) {
        this.destination.next(context.buffer);
        var contexts = this.contexts;
        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
            contexts.splice(contexts.indexOf(context), 1);
        }
    };
    return BufferTimeSubscriber;
}(Subscriber));
function dispatchBufferTimeSpanOnly(state) {
    var subscriber = state.subscriber;
    var prevContext = state.context;
    if (prevContext) {
        subscriber.closeContext(prevContext);
    }
    if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
    var context = subscriber.openContext();
    var action = this;
    if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(arg) {
    var subscriber = arg.subscriber, context = arg.context;
    subscriber.closeContext(context);
}

/** PURE_IMPORTS_START tslib,_Subscription,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */

var BufferToggleSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(BufferToggleSubscriber, _super);
    function BufferToggleSubscriber(destination, openings, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.openings = openings;
        _this.closingSelector = closingSelector;
        _this.contexts = [];
        _this.add(subscribeToResult(_this, openings));
        return _this;
    }
    BufferToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    };
    BufferToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context_1 = contexts.shift();
            context_1.subscription.unsubscribe();
            context_1.buffer = null;
            context_1.subscription = null;
        }
        this.contexts = null;
        _super.prototype._error.call(this, err);
    };
    BufferToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context_2 = contexts.shift();
            this.destination.next(context_2.buffer);
            context_2.subscription.unsubscribe();
            context_2.buffer = null;
            context_2.subscription = null;
        }
        this.contexts = null;
        _super.prototype._complete.call(this);
    };
    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    };
    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
        this.closeBuffer(innerSub.context);
    };
    BufferToggleSubscriber.prototype.openBuffer = function (value) {
        try {
            var closingSelector = this.closingSelector;
            var closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    };
    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
        var contexts = this.contexts;
        if (contexts && context) {
            var buffer = context.buffer, subscription = context.subscription;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    };
    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
        var contexts = this.contexts;
        var buffer = [];
        var subscription = new Subscription();
        var context = { buffer: buffer, subscription: subscription };
        contexts.push(context);
        var innerSubscription = subscribeToResult(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    };
    return BufferToggleSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var BufferWhenSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(BufferWhenSubscriber, _super);
    function BufferWhenSubscriber(destination, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.closingSelector = closingSelector;
        _this.subscribing = false;
        _this.openBuffer();
        return _this;
    }
    BufferWhenSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferWhenSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    BufferWhenSubscriber.prototype._unsubscribe = function () {
        this.buffer = null;
        this.subscribing = false;
    };
    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    };
    BufferWhenSubscriber.prototype.notifyComplete = function () {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    };
    BufferWhenSubscriber.prototype.openBuffer = function () {
        var closingSubscription = this.closingSubscription;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        var buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier = tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject) {
            this.error(errorObject.e);
        }
        else {
            closingSubscription = new Subscription();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(subscribeToResult(this, closingNotifier));
            this.subscribing = false;
        }
    };
    return BufferWhenSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var CatchSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
        var _this = _super.call(this, destination) || this;
        _this.selector = selector;
        _this.caught = caught;
        return _this;
    }
    CatchSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var result = void 0;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err2) {
                _super.prototype.error.call(this, err2);
                return;
            }
            this._unsubscribeAndRecycle();
            this.add(subscribeToResult(this, result));
        }
    };
    return CatchSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToArray PURE_IMPORTS_END */
function fromArray(input, scheduler) {
    if (!scheduler) {
        return new Observable(subscribeToArray(input));
    }
    else {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            var i = 0;
            sub.add(scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                    return;
                }
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    sub.add(this.schedule());
                }
            }));
            return sub;
        });
    }
}

/** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
var NONE = {};

var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, resultSelector) {
        var _this = _super.call(this, destination) || this;
        _this.resultSelector = resultSelector;
        _this.active = 0;
        _this.values = [];
        _this.observables = [];
        return _this;
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(NONE);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond
            ? 0
            : oldVal === NONE ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.resultSelector) {
                this._tryResultSelector(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
        var result;
        try {
            result = this.resultSelector.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START _observable_combineLatest PURE_IMPORTS_END */

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToPromise PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator,_util_subscribeToIterable PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable,_util_subscribeToObservable PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable,_util_isPromise,_util_isArrayLike,_util_isInteropObservable,_util_isIterable,_fromArray,_fromPromise,_fromIterable,_fromObservable,_util_subscribeTo PURE_IMPORTS_END */

/** PURE_IMPORTS_START _util_isArray,_observable_combineLatest,_observable_from PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
function empty$1(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
    return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
}

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function scalar(value) {
    var result = new Observable(function (subscriber) {
        subscriber.next(value);
        subscriber.complete();
    });
    result._isScalar = true;
    result.value = value;
    return result;
}

/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_empty,_scalar PURE_IMPORTS_END */
function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = args[args.length - 1];
    if (isScheduler(scheduler)) {
        args.pop();
    }
    else {
        scheduler = undefined;
    }
    switch (args.length) {
        case 0:
            return empty$1(scheduler);
        case 1:
            return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
        default:
            return fromArray(args, scheduler);
    }
}

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
var MapOperator = /*@__PURE__*/ (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());
var MapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.count = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_map,_observable_from PURE_IMPORTS_END */

var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START  PURE_IMPORTS_END */

/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */

/** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

/** PURE_IMPORTS_START _util_isScheduler,_of,_from,_operators_concatAll PURE_IMPORTS_END */

/** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */

/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

/** PURE_IMPORTS_START _concatMap PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var CountSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.count = 0;
        _this.index = 0;
        return _this;
    }
    CountSubscriber.prototype._next = function (value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
        var result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    };
    CountSubscriber.prototype._complete = function () {
        this.destination.next(this.count);
        this.destination.complete();
    };
    return CountSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var DebounceSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DebounceSubscriber, _super);
    function DebounceSubscriber(destination, durationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.durationSelector = durationSelector;
        _this.hasValue = false;
        _this.durationSubscription = null;
        return _this;
    }
    DebounceSubscriber.prototype._next = function (value) {
        try {
            var result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DebounceSubscriber.prototype._complete = function () {
        this.emitValue();
        this.destination.complete();
    };
    DebounceSubscriber.prototype._tryNext = function (value, duration) {
        var subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = subscribeToResult(this, duration);
        if (subscription && !subscription.closed) {
            this.add(this.durationSubscription = subscription);
        }
    };
    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    DebounceSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    DebounceSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            var value = this.value;
            var subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            this.value = null;
            this.hasValue = false;
            _super.prototype._next.call(this, value);
        }
    };
    return DebounceSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */

var DebounceTimeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.dueTime = dueTime;
        _this.scheduler = scheduler;
        _this.debouncedSubscription = null;
        _this.lastValue = null;
        _this.hasValue = false;
        return _this;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
        this.debouncedNext();
        this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
        this.clearDebounce();
        if (this.hasValue) {
            var lastValue = this.lastValue;
            this.lastValue = null;
            this.hasValue = false;
            this.destination.next(lastValue);
        }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
        var debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    };
    return DebounceTimeSubscriber;
}(Subscriber));
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var DefaultIfEmptySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
        var _this = _super.call(this, destination) || this;
        _this.defaultValue = defaultValue;
        _this.isEmpty = true;
        return _this;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
        this.isEmpty = false;
        this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
}(Subscriber));

/** PURE_IMPORTS_START  PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function throwError(error, scheduler) {
    if (!scheduler) {
        return new Observable(function (subscriber) { return subscriber.error(error); });
    }
    else {
        return new Observable(function (subscriber) { return scheduler.schedule(dispatch$1, 0, { error: error, subscriber: subscriber }); });
    }
}
function dispatch$1(_a) {
    var error = _a.error, subscriber = _a.subscriber;
    subscriber.error(error);
}

/** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
var Notification = /*@__PURE__*/ (function () {
    function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return of(this.value);
            case 'E':
                return throwError(this.error);
            case 'C':
                return empty$1();
        }
        throw new Error('unexpected notification kind value');
    };
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    };
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
        return Notification.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}());

/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_Subscriber,_Notification PURE_IMPORTS_END */

var DelaySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DelaySubscriber, _super);
    function DelaySubscriber(destination, delay, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.delay = delay;
        _this.scheduler = scheduler;
        _this.queue = [];
        _this.active = false;
        _this.errored = false;
        return _this;
    }
    DelaySubscriber.dispatch = function (state) {
        var source = state.source;
        var queue = source.queue;
        var scheduler = state.scheduler;
        var destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay_1);
        }
        else {
            this.unsubscribe();
            source.active = false;
        }
    };
    DelaySubscriber.prototype._schedule = function (scheduler) {
        this.active = true;
        this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    };
    DelaySubscriber.prototype.scheduleNotification = function (notification) {
        if (this.errored === true) {
            return;
        }
        var scheduler = this.scheduler;
        var message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    };
    DelaySubscriber.prototype._next = function (value) {
        this.scheduleNotification(Notification.createNext(value));
    };
    DelaySubscriber.prototype._error = function (err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
    };
    DelaySubscriber.prototype._complete = function () {
        this.scheduleNotification(Notification.createComplete());
    };
    return DelaySubscriber;
}(Subscriber));
var DelayMessage = /*@__PURE__*/ (function () {
    function DelayMessage(time, notification) {
        this.time = time;
        this.notification = notification;
    }
    return DelayMessage;
}());

/** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var DelayWhenSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.delayDurationSelector = delayDurationSelector;
        _this.completed = false;
        _this.delayNotifierSubscriptions = [];
        return _this;
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        var value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
        try {
            var delayNotifier = this.delayDurationSelector(value);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DelayWhenSubscriber.prototype._complete = function () {
        this.completed = true;
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
        subscription.unsubscribe();
        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        if (subscriptionIdx !== -1) {
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
        }
        return subscription.outerValue;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
        var notifierSubscription = subscribeToResult(this, delayNotifier, value);
        if (notifierSubscription && !notifierSubscription.closed) {
            this.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
        }
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    };
    return DelayWhenSubscriber;
}(OuterSubscriber));
var SubscriptionDelayObservable = /*@__PURE__*/ (function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subscriptionDelay = subscriptionDelay;
        return _this;
    }
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
}(Observable));
var SubscriptionDelaySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.source = source;
        _this.sourceSubscribed = false;
        return _this;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
        this.unsubscribe();
        this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    };
    return SubscriptionDelaySubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var DeMaterializeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
        value.observe(this.destination);
    };
    return DeMaterializeSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var DistinctSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DistinctSubscriber, _super);
    function DistinctSubscriber(destination, keySelector, flushes) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.values = new Set();
        if (flushes) {
            _this.add(subscribeToResult(_this, flushes));
        }
        return _this;
    }
    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.clear();
    };
    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DistinctSubscriber.prototype._next = function (value) {
        if (this.keySelector) {
            this._useKeySelector(value);
        }
        else {
            this._finalizeNext(value, value);
        }
    };
    DistinctSubscriber.prototype._useKeySelector = function (value) {
        var key;
        var destination = this.destination;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this._finalizeNext(key, value);
    };
    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
        var values = this.values;
        if (!values.has(key)) {
            values.add(key);
            this.destination.next(value);
        }
    };
    return DistinctSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */

var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.hasKey = false;
        if (typeof compare === 'function') {
            _this.compare = compare;
        }
        return _this;
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
        return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
        var keySelector = this.keySelector;
        var key = value;
        if (keySelector) {
            key = tryCatch(this.keySelector)(value);
            if (key === errorObject) {
                return this.destination.error(errorObject.e);
            }
        }
        var result = false;
        if (this.hasKey) {
            result = tryCatch(this.compare)(this.key, key);
            if (result === errorObject) {
                return this.destination.error(errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    };
    return DistinctUntilChangedSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _distinctUntilChanged PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var ArgumentOutOfRangeError = /*@__PURE__*/ (function (_super) {
    __extends(ArgumentOutOfRangeError, _super);
    function ArgumentOutOfRangeError() {
        var _this = _super.call(this, 'argument out of range') || this;
        _this.name = 'ArgumentOutOfRangeError';
        Object.setPrototypeOf(_this, ArgumentOutOfRangeError.prototype);
        return _this;
    }
    return ArgumentOutOfRangeError;
}(Error));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var FilterSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.count = 0;
        return _this;
    }
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */

var TapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TapSubscriber, _super);
    function TapSubscriber(destination, observerOrNext, error, complete) {
        var _this = _super.call(this, destination) || this;
        _this._tapNext = noop;
        _this._tapError = noop;
        _this._tapComplete = noop;
        _this._tapError = error || noop;
        _this._tapComplete = complete || noop;
        if (isFunction$1(observerOrNext)) {
            _this._context = _this;
            _this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            _this._context = observerOrNext;
            _this._tapNext = observerOrNext.next || noop;
            _this._tapError = observerOrNext.error || noop;
            _this._tapComplete = observerOrNext.complete || noop;
        }
        return _this;
    }
    TapSubscriber.prototype._next = function (value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    TapSubscriber.prototype._error = function (err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    TapSubscriber.prototype._complete = function () {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    };
    return TapSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var EmptyError = /*@__PURE__*/ (function (_super) {
    __extends(EmptyError, _super);
    function EmptyError() {
        var _this = _super.call(this, 'no elements in sequence') || this;
        _this.name = 'EmptyError';
        Object.setPrototypeOf(_this, EmptyError.prototype);
        return _this;
    }
    return EmptyError;
}(Error));

/** PURE_IMPORTS_START _tap,_util_EmptyError PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */

var TakeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        var count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _util_ArgumentOutOfRangeError,_filter,_throwIfEmpty,_defaultIfEmpty,_take PURE_IMPORTS_END */

/** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var EverySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(EverySubscriber, _super);
    function EverySubscriber(destination, predicate, thisArg, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.source = source;
        _this.index = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    };
    EverySubscriber.prototype._next = function (value) {
        var result = false;
        try {
            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (!result) {
            this.notifyComplete(false);
        }
    };
    EverySubscriber.prototype._complete = function () {
        this.notifyComplete(true);
    };
    return EverySubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var SwitchFirstSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SwitchFirstSubscriber, _super);
    function SwitchFirstSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasCompleted = false;
        _this.hasSubscription = false;
        return _this;
    }
    SwitchFirstSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(subscribeToResult(this, value));
        }
    };
    SwitchFirstSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    };
    SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return SwitchFirstSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */

var ExhaustMapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ExhaustMapSubscriber, _super);
    function ExhaustMapSubscriber(destination, project) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.hasSubscription = false;
        _this.hasCompleted = false;
        _this.index = 0;
        return _this;
    }
    ExhaustMapSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.tryNext(value);
        }
    };
    ExhaustMapSubscriber.prototype.tryNext = function (value) {
        var index = this.index++;
        var destination = this.destination;
        try {
            var result = this.project(value, index);
            this.hasSubscription = true;
            this.add(subscribeToResult(this, result, value, index));
        }
        catch (err) {
            destination.error(err);
        }
    };
    ExhaustMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    };
    ExhaustMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    ExhaustMapSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    ExhaustMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return ExhaustMapSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var ExpandSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.scheduler = scheduler;
        _this.index = 0;
        _this.active = 0;
        _this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            _this.buffer = [];
        }
        return _this;
    }
    ExpandSubscriber.dispatch = function (arg) {
        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
        subscriber.subscribeToProjection(result, value, index);
    };
    ExpandSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        var index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            var result = tryCatch(this.project)(value, index);
            if (result === errorObject) {
                destination.error(errorObject.e);
            }
            else if (!this.scheduler) {
                this.subscribeToProjection(result, value, index);
            }
            else {
                var state = { subscriber: this, result: result, value: value, index: index };
                this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
        this.active++;
        this.add(subscribeToResult(this, result, value, index));
    };
    ExpandSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    };
    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    return ExpandSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */

var FinallySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(FinallySubscriber, _super);
    function FinallySubscriber(destination, callback) {
        var _this = _super.call(this, destination) || this;
        _this.add(new Subscription(callback));
        return _this;
    }
    return FinallySubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var FindValueSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.yieldIndex = yieldIndex;
        _this.thisArg = thisArg;
        _this.index = 0;
        return _this;
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    FindValueSubscriber.prototype._next = function (value) {
        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
        var index = this.index++;
        try {
            var result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    FindValueSubscriber.prototype._complete = function () {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    };
    return FindValueSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _operators_find PURE_IMPORTS_END */

/** PURE_IMPORTS_START _util_EmptyError,_filter,_take,_defaultIfEmpty,_throwIfEmpty,_util_identity PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var ObjectUnsubscribedError = /*@__PURE__*/ (function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var _this = _super.call(this, 'object unsubscribed') || this;
        _this.name = 'ObjectUnsubscribedError';
        Object.setPrototypeOf(_this, ObjectUnsubscribedError.prototype);
        return _this;
    }
    return ObjectUnsubscribedError;
}(Error));

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var SubjectSubscription = /*@__PURE__*/ (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription));

/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(Subscriber));
var Subject = /*@__PURE__*/ (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = /*@__PURE__*/ (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));

/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */

var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.elementSelector = elementSelector;
        _this.durationSelector = durationSelector;
        _this.subjectSelector = subjectSelector;
        _this.groups = null;
        _this.attemptedToUnsubscribe = false;
        _this.count = 0;
        return _this;
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        var group = groups.get(key);
        var element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            group = (this.subjectSelector ? this.subjectSelector() : new Subject());
            groups.set(key, group);
            var groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                var duration = void 0;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(Subscriber));
var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        var _this = _super.call(this, group) || this;
        _this.key = key;
        _this.group = group;
        _this.parent = parent;
        return _this;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.complete();
    };
    GroupDurationSubscriber.prototype._unsubscribe = function () {
        var _a = this, parent = _a.parent, key = _a.key;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    };
    return GroupDurationSubscriber;
}(Subscriber));
var GroupedObservable = /*@__PURE__*/ (function (_super) {
    __extends(GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.groupSubject = groupSubject;
        _this.refCountSubscription = refCountSubscription;
        return _this;
    }
    GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new Subscription();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(Observable));
var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        parent.count++;
        return _this;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(Subscription));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var IgnoreElementsSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
    };
    return IgnoreElementsSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var IsEmptySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(IsEmptySubscriber, _super);
    function IsEmptySubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
        var destination = this.destination;
        destination.next(isEmpty);
        destination.complete();
    };
    IsEmptySubscriber.prototype._next = function (value) {
        this.notifyComplete(false);
    };
    IsEmptySubscriber.prototype._complete = function () {
        this.notifyComplete(true);
    };
    return IsEmptySubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */

var TakeLastSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TakeLastSubscriber, _super);
    function TakeLastSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.ring = new Array();
        _this.count = 0;
        return _this;
    }
    TakeLastSubscriber.prototype._next = function (value) {
        var ring = this.ring;
        var total = this.total;
        var count = this.count++;
        if (ring.length < total) {
            ring.push(value);
        }
        else {
            var index = count % total;
            ring[index] = value;
        }
    };
    TakeLastSubscriber.prototype._complete = function () {
        var destination = this.destination;
        var count = this.count;
        if (count > 0) {
            var total = this.count >= this.total ? this.total : this.count;
            var ring = this.ring;
            for (var i = 0; i < total; i++) {
                var idx = (count++) % total;
                destination.next(ring[idx]);
            }
        }
        destination.complete();
    };
    return TakeLastSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _util_EmptyError,_filter,_takeLast,_throwIfEmpty,_defaultIfEmpty,_util_identity PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var MapToSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
        var _this = _super.call(this, destination) || this;
        _this.value = value;
        return _this;
    }
    MapToSubscriber.prototype._next = function (x) {
        this.destination.next(this.value);
    };
    return MapToSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */

var MaterializeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    MaterializeSubscriber.prototype._next = function (value) {
        this.destination.next(Notification.createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
        var destination = this.destination;
        destination.next(Notification.createError(err));
        destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
        var destination = this.destination;
        destination.next(Notification.createComplete());
        destination.complete();
    };
    return MaterializeSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var ScanSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
        var _this = _super.call(this, destination) || this;
        _this.accumulator = accumulator;
        _this._seed = _seed;
        _this.hasSeed = hasSeed;
        _this.index = 0;
        return _this;
    }
    Object.defineProperty(ScanSubscriber.prototype, "seed", {
        get: function () {
            return this._seed;
        },
        set: function (value) {
            this.hasSeed = true;
            this._seed = value;
        },
        enumerable: true,
        configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
        if (!this.hasSeed) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    };
    ScanSubscriber.prototype._tryNext = function (value) {
        var index = this.index++;
        var result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    };
    return ScanSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _scan,_takeLast,_defaultIfEmpty,_util_pipe PURE_IMPORTS_END */

/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */

/** PURE_IMPORTS_START _observable_merge PURE_IMPORTS_END */

/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */

var MergeScanSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MergeScanSubscriber, _super);
    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
        var _this = _super.call(this, destination) || this;
        _this.accumulator = accumulator;
        _this.acc = acc;
        _this.concurrent = concurrent;
        _this.hasValue = false;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
    }
    MergeScanSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            var index = this.index++;
            var ish = tryCatch(this.accumulator)(this.acc, value);
            var destination = this.destination;
            if (ish === errorObject) {
                destination.error(errorObject.e);
            }
            else {
                this.active++;
                this._innerSub(ish, value, index);
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult(this, ish, value, index));
    };
    MergeScanSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    };
    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var destination = this.destination;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    };
    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    };
    return MergeScanSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function refCount() {
    return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
    };
}
var RefCountOperator = /*@__PURE__*/ (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
var ConnectableObservable = /*@__PURE__*/ (function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subjectFactory = subjectFactory;
        _this._refCount = 0;
        _this._isComplete = false;
        return _this;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new Subscription();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription.EMPTY;
            }
            else {
                this._connection = connection;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return refCount()(this);
    };
    return ConnectableObservable;
}(Observable));

var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this.connectable._isComplete = true;
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(SubjectSubscriber));
var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount$$1 = connectable._refCount;
        if (refCount$$1 <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount$$1 - 1;
        if (refCount$$1 > 1) {
            this.connection = null;
            return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */

var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        var _this = _super.call(this, destination) || this;
        _this.scheduler = scheduler;
        _this.delay = delay;
        return _this;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
        var notification = arg.notification, destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(Notification.createError(err));
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(Notification.createComplete());
    };
    return ObserveOnSubscriber;
}(Subscriber));
var ObserveOnMessage = /*@__PURE__*/ (function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}());

/** PURE_IMPORTS_START tslib,_observable_from,_util_isArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */


var OnErrorResumeNextSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(OnErrorResumeNextSubscriber, _super);
    function OnErrorResumeNextSubscriber(destination, nextSources) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.nextSources = nextSources;
        return _this;
    }
    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._error = function (err) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._complete = function () {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
        var next = this.nextSources.shift();
        if (next) {
            this.add(subscribeToResult(this, next));
        }
        else {
            this.destination.complete();
        }
    };
    return OnErrorResumeNextSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasPrev = false;
        return _this;
    }
    PairwiseSubscriber.prototype._next = function (value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
    };
    return PairwiseSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START  PURE_IMPORTS_END */

/** PURE_IMPORTS_START _util_not,_filter PURE_IMPORTS_END */

/** PURE_IMPORTS_START _map PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Subject,_multicast PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
var BehaviorSubject = /*@__PURE__*/ (function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return this._value;
        }
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
}(Subject));

/** PURE_IMPORTS_START _BehaviorSubject,_multicast PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
var AsyncSubject = /*@__PURE__*/ (function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.hasNext = false;
        _this.hasCompleted = false;
        return _this;
    }
    AsyncSubject.prototype._subscribe = function (subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return Subscription.EMPTY;
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype.next = function (value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    };
    AsyncSubject.prototype.error = function (error) {
        if (!this.hasCompleted) {
            _super.prototype.error.call(this, error);
        }
    };
    AsyncSubject.prototype.complete = function () {
        this.hasCompleted = true;
        if (this.hasNext) {
            _super.prototype.next.call(this, this.value);
        }
        _super.prototype.complete.call(this);
    };
    return AsyncSubject;
}(Subject));

/** PURE_IMPORTS_START _AsyncSubject,_multicast PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
var QueueAction = /*@__PURE__*/ (function (_super) {
    __extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return (delay > 0 || this.closed) ?
            _super.prototype.execute.call(this, state, delay) :
            this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        return scheduler.flush(this);
    };
    return QueueAction;
}(AsyncAction));

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
var QueueScheduler = /*@__PURE__*/ (function (_super) {
    __extends(QueueScheduler, _super);
    function QueueScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueScheduler;
}(AsyncScheduler));

/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);

/** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
var ReplaySubject = /*@__PURE__*/ (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
        }
        if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            _this._infiniteTimeWindow = true;
            _this.next = _this.nextInfiniteTimeWindow;
        }
        else {
            _this.next = _this.nextTimeWindow;
        }
        return _this;
    }
    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
        var _events = this._events;
        _events.push(value);
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype.nextTimeWindow = function (value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.isStopped || this.hasError) {
            subscription = Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(Subject));
var ReplayEvent = /*@__PURE__*/ (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());

/** PURE_IMPORTS_START _ReplaySubject,_multicast PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var RaceSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasFirst = false;
        _this.observables = [];
        _this.subscriptions = [];
        return _this;
    }
    RaceSubscriber.prototype._next = function (observable) {
        this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (var i = 0; i < len && !this.hasFirst; i++) {
                var observable = observables[i];
                var subscription = subscribeToResult(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    var subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    };
    return RaceSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START _util_isArray,_observable_race PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber,_observable_empty PURE_IMPORTS_END */

var RepeatSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RepeatSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var RepeatWhenSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
        var _this = _super.call(this, destination) || this;
        _this.notifier = notifier;
        _this.source = source;
        _this.sourceIsBeingSubscribedTo = true;
        return _this;
    }
    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    };
    RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        if (this.sourceIsBeingSubscribedTo === false) {
            return _super.prototype.complete.call(this);
        }
    };
    RepeatWhenSubscriber.prototype.complete = function () {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return _super.prototype.complete.call(this);
            }
            this._unsubscribeAndRecycle();
            this.notifications.next();
        }
    };
    RepeatWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
        var _unsubscribe = this._unsubscribe;
        this._unsubscribe = null;
        _super.prototype._unsubscribeAndRecycle.call(this);
        this._unsubscribe = _unsubscribe;
        return this;
    };
    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
        this.notifications = new Subject();
        var retries = tryCatch(this.notifier)(this.notifications);
        if (retries === errorObject) {
            return _super.prototype.complete.call(this);
        }
        this.retries = retries;
        this.retriesSubscription = subscribeToResult(this, retries);
    };
    return RepeatWhenSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var RetrySubscriber = /*@__PURE__*/ (function (_super) {
    __extends(RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RetrySubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.error.call(this, err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RetrySubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var RetryWhenSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
        var _this = _super.call(this, destination) || this;
        _this.notifier = notifier;
        _this.source = source;
        return _this;
    }
    RetryWhenSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var errors = this.errors;
            var retries = this.retries;
            var retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new Subject();
                retries = tryCatch(this.notifier)(errors);
                if (retries === errorObject) {
                    return _super.prototype.error.call(this, errorObject.e);
                }
                retriesSubscription = subscribeToResult(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this._unsubscribeAndRecycle();
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    };
    RetryWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _unsubscribe = this._unsubscribe;
        this._unsubscribe = null;
        this._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        this.source.subscribe(this);
    };
    return RetryWhenSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var SampleSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SampleSubscriber, _super);
    function SampleSubscriber() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasValue = false;
        return _this;
    }
    SampleSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    };
    return SampleSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */

var SampleTimeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, period, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.period = period;
        _this.scheduler = scheduler;
        _this.hasValue = false;
        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
        return _this;
    }
    SampleTimeSubscriber.prototype._next = function (value) {
        this.lastValue = value;
        this.hasValue = true;
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    };
    return SampleTimeSubscriber;
}(Subscriber));
function dispatchNotification(state) {
    var subscriber = state.subscriber, period = state.period;
    subscriber.notifyNext();
    this.schedule(state, period);
}

/** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */

var SequenceEqualSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparor) {
        var _this = _super.call(this, destination) || this;
        _this.compareTo = compareTo;
        _this.comparor = comparor;
        _this._a = [];
        _this._b = [];
        _this._oneComplete = false;
        _this.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
        return _this;
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype._complete = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
        var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
        while (_a.length > 0 && _b.length > 0) {
            var a = _a.shift();
            var b = _b.shift();
            var areEqual = false;
            if (comparor) {
                areEqual = tryCatch(comparor)(a, b);
                if (areEqual === errorObject) {
                    this.destination.error(errorObject.e);
                }
            }
            else {
                areEqual = a === b;
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    };
    return SequenceEqualSubscriber;
}(Subscriber));
var SequenceEqualCompareToSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        return _this;
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
        this.parent.nextB(value);
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
        this.parent.error(err);
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
        this.parent._complete();
    };
    return SequenceEqualCompareToSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */

/** PURE_IMPORTS_START _ReplaySubject PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subscriber,_util_EmptyError PURE_IMPORTS_END */

var SingleSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.seenValue = false;
        _this.index = 0;
        return _this;
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    };
    SingleSubscriber.prototype._next = function (value) {
        var index = this.index++;
        if (this.predicate) {
            this.tryNext(value, index);
        }
        else {
            this.applySingleValue(value);
        }
    };
    SingleSubscriber.prototype.tryNext = function (value, index) {
        try {
            if (this.predicate(value, index, this.source)) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    SingleSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new EmptyError);
        }
    };
    return SingleSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var SkipSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError PURE_IMPORTS_END */

var SkipLastSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SkipLastSubscriber, _super);
    function SkipLastSubscriber(destination, _skipCount) {
        var _this = _super.call(this, destination) || this;
        _this._skipCount = _skipCount;
        _this._count = 0;
        _this._ring = new Array(_skipCount);
        return _this;
    }
    SkipLastSubscriber.prototype._next = function (value) {
        var skipCount = this._skipCount;
        var count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            var currentIndex = count % skipCount;
            var ring = this._ring;
            var oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    };
    return SkipLastSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var SkipUntilSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
        var _this = _super.call(this, destination) || this;
        _this.hasValue = false;
        _this.add(_this.innerSubscription = subscribeToResult(_this, notifier));
        return _this;
    }
    SkipUntilSubscriber.prototype._next = function (value) {
        if (this.hasValue) {
            _super.prototype._next.call(this, value);
        }
    };
    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.hasValue = true;
        if (this.innerSubscription) {
            this.innerSubscription.unsubscribe();
        }
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
    };
    return SkipUntilSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var SkipWhileSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.skipping = true;
        _this.index = 0;
        return _this;
    }
    SkipWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
        try {
            var result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    return SkipWhileSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var nextHandle = 1;
var tasksByHandle = {};
function runIfPresent(handle) {
    var cb = tasksByHandle[handle];
    if (cb) {
        cb();
    }
}
var Immediate = {
    setImmediate: function (cb) {
        var handle = nextHandle++;
        tasksByHandle[handle] = cb;
        Promise.resolve().then(function () { return runIfPresent(handle); });
        return handle;
    },
    clearImmediate: function (handle) {
        delete tasksByHandle[handle];
    },
};

/** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
var AsapAction = /*@__PURE__*/ (function (_super) {
    __extends(AsapAction, _super);
    function AsapAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
    };
    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            Immediate.clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    };
    return AsapAction;
}(AsyncAction));

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
var AsapScheduler = /*@__PURE__*/ (function (_super) {
    __extends(AsapScheduler, _super);
    function AsapScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsapScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsapScheduler;
}(AsyncScheduler));

/** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
var asap = /*@__PURE__*/ new AsapScheduler(AsapAction);

/** PURE_IMPORTS_START tslib,_Observable,_scheduler_asap,_util_isNumeric PURE_IMPORTS_END */
var SubscribeOnObservable = /*@__PURE__*/ (function (_super) {
    __extends(SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
        if (delayTime === void 0) {
            delayTime = 0;
        }
        if (scheduler === void 0) {
            scheduler = asap;
        }
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.delayTime = delayTime;
        _this.scheduler = scheduler;
        if (!isNumeric(delayTime) || delayTime < 0) {
            _this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            _this.scheduler = asap;
        }
        return _this;
    }
    SubscribeOnObservable.create = function (source, delay, scheduler) {
        if (delay === void 0) {
            delay = 0;
        }
        if (scheduler === void 0) {
            scheduler = asap;
        }
        return new SubscribeOnObservable(source, delay, scheduler);
    };
    SubscribeOnObservable.dispatch = function (arg) {
        var source = arg.source, subscriber = arg.subscriber;
        return this.add(source.subscribe(subscriber));
    };
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
        var delay = this.delayTime;
        var source = this.source;
        var scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source: source, subscriber: subscriber
        });
    };
    return SubscribeOnObservable;
}(Observable));

/** PURE_IMPORTS_START _observable_SubscribeOnObservable PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */

var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.index = 0;
        return _this;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = subscribeToResult(this, result, value, index));
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    return SwitchMapSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START _switchMap,_util_identity PURE_IMPORTS_END */

/** PURE_IMPORTS_START _switchMap PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
    };
    return TakeUntilSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var TakeWhileSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.index = 0;
        return _this;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        var result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
        var destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    };
    return TakeWhileSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */


var ThrottleSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.durationSelector = durationSelector;
        _this._leading = _leading;
        _this._trailing = _trailing;
        _this._hasValue = false;
        return _this;
    }
    ThrottleSubscriber.prototype._next = function (value) {
        this._hasValue = true;
        this._sendValue = value;
        if (!this._throttled) {
            if (this._leading) {
                this.send();
            }
            else {
                this.throttle(value);
            }
        }
    };
    ThrottleSubscriber.prototype.send = function () {
        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
        if (_hasValue) {
            this.destination.next(_sendValue);
            this.throttle(_sendValue);
        }
        this._hasValue = false;
        this._sendValue = null;
    };
    ThrottleSubscriber.prototype.throttle = function (value) {
        var duration = this.tryDurationSelector(value);
        if (duration) {
            this.add(this._throttled = subscribeToResult(this, duration));
        }
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    };
    ThrottleSubscriber.prototype.throttlingDone = function () {
        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
        if (_throttled) {
            _throttled.unsubscribe();
        }
        this._throttled = null;
        if (_trailing) {
            this.send();
        }
    };
    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.throttlingDone();
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
        this.throttlingDone();
    };
    return ThrottleSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async,_throttle PURE_IMPORTS_END */

var ThrottleTimeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ThrottleTimeSubscriber, _super);
    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
        var _this = _super.call(this, destination) || this;
        _this.duration = duration;
        _this.scheduler = scheduler;
        _this.leading = leading;
        _this.trailing = trailing;
        _this._hasTrailingValue = false;
        _this._trailingValue = null;
        return _this;
    }
    ThrottleTimeSubscriber.prototype._next = function (value) {
        if (this.throttled) {
            if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
        else {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext$1, this.duration, { subscriber: this }));
            if (this.leading) {
                this.destination.next(value);
            }
        }
    };
    ThrottleTimeSubscriber.prototype._complete = function () {
        if (this._hasTrailingValue) {
            this.destination.next(this._trailingValue);
            this.destination.complete();
        }
        else {
            this.destination.complete();
        }
    };
    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
        var throttled = this.throttled;
        if (throttled) {
            if (this.trailing && this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this._trailingValue = null;
                this._hasTrailingValue = false;
            }
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    };
    return ThrottleTimeSubscriber;
}(Subscriber));
function dispatchNext$1(arg) {
    var subscriber = arg.subscriber;
    subscriber.clearThrottle();
}

/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

/** PURE_IMPORTS_START _scheduler_async,_scan,_observable_defer,_map PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var TimeoutError = /*@__PURE__*/ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError() {
        var _this = _super.call(this, 'Timeout has occurred') || this;
        _this.name = 'TimeoutError';
        Object.setPrototypeOf(_this, TimeoutError.prototype);
        return _this;
    }
    return TimeoutError;
}(Error));

/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var TimeoutWithSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.absoluteTimeout = absoluteTimeout;
        _this.waitFor = waitFor;
        _this.withObservable = withObservable;
        _this.scheduler = scheduler;
        _this.action = null;
        _this.scheduleTimeout();
        return _this;
    }
    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
        var withObservable = subscriber.withObservable;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(subscribeToResult(subscriber, withObservable));
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var action = this.action;
        if (action) {
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
        }
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        _super.prototype._next.call(this, value);
    };
    TimeoutWithSubscriber.prototype._unsubscribe = function () {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
    };
    return TimeoutWithSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START _scheduler_async,_util_TimeoutError,_timeoutWith,_observable_throwError PURE_IMPORTS_END */

/** PURE_IMPORTS_START _scheduler_async,_map PURE_IMPORTS_END */

/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var WindowSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.window = new Subject();
        destination.next(_this.window);
        return _this;
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this._complete();
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
    };
    WindowSubscriber.prototype._unsubscribe = function () {
        this.window = null;
    };
    WindowSubscriber.prototype.openWindow = function () {
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var destination = this.destination;
        var newWindow = this.window = new Subject();
        destination.next(newWindow);
    };
    return WindowSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subscriber,_Subject PURE_IMPORTS_END */

var WindowCountSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.windowSize = windowSize;
        _this.startWindowEvery = startWindowEvery;
        _this.windows = [new Subject()];
        _this.count = 0;
        destination.next(_this.windows[0]);
        return _this;
    }
    WindowCountSubscriber.prototype._next = function (value) {
        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        var destination = this.destination;
        var windowSize = this.windowSize;
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len && !this.closed; i++) {
            windows[i].next(value);
        }
        var c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0 && !this.closed) {
            var window_1 = new Subject();
            windows.push(window_1);
            destination.next(window_1);
        }
    };
    WindowCountSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().error(err);
            }
        }
        this.destination.error(err);
    };
    WindowCountSubscriber.prototype._complete = function () {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().complete();
            }
        }
        this.destination.complete();
    };
    WindowCountSubscriber.prototype._unsubscribe = function () {
        this.count = 0;
        this.windows = null;
    };
    return WindowCountSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START tslib,_Subject,_scheduler_async,_Subscriber,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */

var CountedSubject = /*@__PURE__*/ (function (_super) {
    __extends(CountedSubject, _super);
    function CountedSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._numberOfNextedValues = 0;
        return _this;
    }
    CountedSubject.prototype.next = function (value) {
        this._numberOfNextedValues++;
        _super.prototype.next.call(this, value);
    };
    Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
        get: function () {
            return this._numberOfNextedValues;
        },
        enumerable: true,
        configurable: true
    });
    return CountedSubject;
}(Subject));
var WindowTimeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(WindowTimeSubscriber, _super);
    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.windowTimeSpan = windowTimeSpan;
        _this.windowCreationInterval = windowCreationInterval;
        _this.maxWindowSize = maxWindowSize;
        _this.scheduler = scheduler;
        _this.windows = [];
        var window = _this.openWindow();
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            var closeState = { subscriber: _this, window: window, context: null };
            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
            _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
            _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
        return _this;
    }
    WindowTimeSubscriber.prototype._next = function (value) {
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len; i++) {
            var window_1 = windows[i];
            if (!window_1.closed) {
                window_1.next(value);
                if (window_1.numberOfNextedValues >= this.maxWindowSize) {
                    this.closeWindow(window_1);
                }
            }
        }
    };
    WindowTimeSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    };
    WindowTimeSubscriber.prototype._complete = function () {
        var windows = this.windows;
        while (windows.length > 0) {
            var window_2 = windows.shift();
            if (!window_2.closed) {
                window_2.complete();
            }
        }
        this.destination.complete();
    };
    WindowTimeSubscriber.prototype.openWindow = function () {
        var window = new CountedSubject();
        this.windows.push(window);
        var destination = this.destination;
        destination.next(window);
        return window;
    };
    WindowTimeSubscriber.prototype.closeWindow = function (window) {
        window.complete();
        var windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    };
    return WindowTimeSubscriber;
}(Subscriber));
function dispatchWindowTimeSpanOnly(state) {
    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
    if (window) {
        subscriber.closeWindow(window);
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
    var window = subscriber.openWindow();
    var action = this;
    var context = { action: action, subscription: null };
    var timeSpanState = { subscriber: subscriber, window: window, context: context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(state) {
    var subscriber = state.subscriber, window = state.window, context = state.context;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}

/** PURE_IMPORTS_START tslib,_Subject,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var WindowToggleSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.openings = openings;
        _this.closingSelector = closingSelector;
        _this.contexts = [];
        _this.add(_this.openSubscription = subscribeToResult(_this, openings, openings));
        return _this;
    }
    WindowToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        if (contexts) {
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    };
    WindowToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context_1 = contexts[index];
                context_1.window.error(err);
                context_1.subscription.unsubscribe();
            }
        }
        _super.prototype._error.call(this, err);
    };
    WindowToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context_2 = contexts[index];
                context_2.window.complete();
                context_2.subscription.unsubscribe();
            }
        }
        _super.prototype._complete.call(this);
    };
    WindowToggleSubscriber.prototype._unsubscribe = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context_3 = contexts[index];
                context_3.window.unsubscribe();
                context_3.subscription.unsubscribe();
            }
        }
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            var closingSelector = this.closingSelector;
            var closingNotifier = tryCatch(closingSelector)(innerValue);
            if (closingNotifier === errorObject) {
                return this.error(errorObject.e);
            }
            else {
                var window_1 = new Subject();
                var subscription = new Subscription();
                var context_4 = { window: window_1, subscription: subscription };
                this.contexts.push(context_4);
                var innerSubscription = subscribeToResult(this, closingNotifier, context_4);
                if (innerSubscription.closed) {
                    this.closeWindow(this.contexts.length - 1);
                }
                else {
                    innerSubscription.context = context_4;
                    subscription.add(innerSubscription);
                }
                this.destination.next(window_1);
            }
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
        this.error(err);
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
        if (index === -1) {
            return;
        }
        var contexts = this.contexts;
        var context = contexts[index];
        var window = context.window, subscription = context.subscription;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    };
    return WindowToggleSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var WindowSubscriber$1 = /*@__PURE__*/ (function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.closingSelector = closingSelector;
        _this.openWindow();
        return _this;
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
        if (innerSub === void 0) {
            innerSub = null;
        }
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var window = this.window = new Subject();
        this.destination.next(window);
        var closingNotifier = tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject) {
            var err = errorObject.e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
        }
    };
    return WindowSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var WithLatestFromSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
        var _this = _super.call(this, destination) || this;
        _this.observables = observables;
        _this.project = project;
        _this.toRespond = [];
        var len = observables.length;
        _this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            _this.toRespond.push(i);
        }
        for (var i = 0; i < len; i++) {
            var observable = observables[i];
            _this.add(subscribeToResult(_this, observable, observable, i));
        }
        return _this;
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
        if (this.toRespond.length === 0) {
            var args = [value].concat(this.values);
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return WithLatestFromSubscriber;
}(OuterSubscriber));

/** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */

var ZipSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, resultSelector, values) {
        if (values === void 0) {
            values = Object.create(null);
        }
        var _this = _super.call(this, destination) || this;
        _this.iterators = [];
        _this.active = 0;
        _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
        _this.values = values;
        return _this;
    }
    ZipSubscriber.prototype._next = function (value) {
        var iterators = this.iterators;
        if (isArray$1(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[iterator] === 'function') {
            iterators.push(new StaticIterator(value[iterator]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    };
    ZipSubscriber.prototype._complete = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (var i = 0; i < len; i++) {
            var iterator$$1 = iterators[i];
            if (iterator$$1.stillUnsubscribed) {
                this.add(iterator$$1.subscribe(iterator$$1, i));
            }
            else {
                this.active--;
            }
        }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    ZipSubscriber.prototype.checkIterators = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        for (var i = 0; i < len; i++) {
            var iterator$$1 = iterators[i];
            if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
                return;
            }
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
            var iterator$$1 = iterators[i];
            var result = iterator$$1.next();
            if (iterator$$1.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.resultSelector) {
            this._tryresultSelector(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    };
    ZipSubscriber.prototype._tryresultSelector = function (args) {
        var result;
        try {
            result = this.resultSelector.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return ZipSubscriber;
}(Subscriber));
var StaticIterator = /*@__PURE__*/ (function () {
    function StaticIterator(iterator$$1) {
        this.iterator = iterator$$1;
        this.nextResult = iterator$$1.next();
    }
    StaticIterator.prototype.hasValue = function () {
        return true;
    };
    StaticIterator.prototype.next = function () {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
        var nextResult = this.nextResult;
        return nextResult && nextResult.done;
    };
    return StaticIterator;
}());
var StaticArrayIterator = /*@__PURE__*/ (function () {
    function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    StaticArrayIterator.prototype[iterator] = function () {
        return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    };
    StaticArrayIterator.prototype.hasValue = function () {
        return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
        return this.array.length === this.index;
    };
    return StaticArrayIterator;
}());
var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
    __extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        _this.observable = observable;
        _this.stillUnsubscribed = true;
        _this.buffer = [];
        _this.isComplete = false;
        return _this;
    }
    ZipBufferIterator.prototype[iterator] = function () {
        return this;
    };
    ZipBufferIterator.prototype.next = function () {
        var buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    };
    ZipBufferIterator.prototype.hasValue = function () {
        return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
        return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
        return subscribeToResult(this, this.observable, this, index);
    };
    return ZipBufferIterator;
}(OuterSubscriber));

/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

/** PURE_IMPORTS_START  PURE_IMPORTS_END */

var jsonSchemaFormatTests = {
    'date': /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
    'time': /^[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
    'date-time': /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d(?::[0-5]\d)?(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
    'email': /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    'hostname': /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*$/i,
    'ipv4': /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    'ipv6': /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    'uri': /^(?:[a-z][a-z0-9+-.]*)(?::|\/)\/?[^\s]*$/i,
    'uri-reference': /^(?:(?:[a-z][a-z0-9+-.]*:)?\/\/)?[^\s]*$/i,
    'uri-template': /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    'url': /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i,
    'uuid': /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    'color': /^\s*(#(?:[\da-f]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}\d*\.?\d+\)|hsl\(\d{1,3}(?:,\s*\d{1,3}%){2}\)|hsla\(\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\))\s*$/gi,
    'json-pointer': /^(?:\/(?:[^~/]|~0|~1)*)*$|^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    'relative-json-pointer': /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    'regex': function (str) {
        if (/[^\\]\\Z/.test(str)) {
            return false;
        }
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    }
};

var JsonValidators = (function () {
    function JsonValidators() {
    }
    JsonValidators.required = function (input) {
        if (input === undefined) {
            input = true;
        }
        switch (input) {
            case true:
                return function (control, invert) {
                    if (invert === void 0) { invert = false; }
                    if (invert) {
                        return null;
                    }
                    return hasValue(control.value) ? null : { 'required': true };
                };
            case false:
                return JsonValidators.nullValidator;
            default:
                return hasValue(input.value) ? null : { 'required': true };
        }
    };
    
    JsonValidators.type = function (requiredType) {
        if (!hasValue(requiredType)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isValid = isArray(requiredType) ?
                requiredType.some(function (type) { return isType(currentValue, type); }) :
                isType(currentValue, requiredType);
            return xor(isValid, invert) ?
                null : { 'type': { requiredType: requiredType, currentValue: currentValue } };
        };
    };
    JsonValidators.enum = function (allowedValues) {
        if (!isArray(allowedValues)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isEqual = function (enumValue, inputValue) {
                return enumValue === inputValue ||
                    (isNumber(enumValue) && +inputValue === +enumValue) ||
                    (isBoolean(enumValue, 'strict') &&
                        toJavaScriptType(inputValue, 'boolean') === enumValue) ||
                    (enumValue === null && !hasValue(inputValue)) ||
                    _.isEqual(enumValue, inputValue);
            };
            var isValid = isArray(currentValue) ?
                currentValue.every(function (inputValue) { return allowedValues.some(function (enumValue) {
                    return isEqual(enumValue, inputValue);
                }); }) :
                allowedValues.some(function (enumValue) { return isEqual(enumValue, currentValue); });
            return xor(isValid, invert) ?
                null : { 'enum': { allowedValues: allowedValues, currentValue: currentValue } };
        };
    };
    JsonValidators.const = function (requiredValue) {
        if (!hasValue(requiredValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isEqual = function (constValue, inputValue) {
                return constValue === inputValue ||
                    isNumber(constValue) && +inputValue === +constValue ||
                    isBoolean(constValue, 'strict') &&
                        toJavaScriptType(inputValue, 'boolean') === constValue ||
                    constValue === null && !hasValue(inputValue);
            };
            var isValid = isEqual(requiredValue, currentValue);
            return xor(isValid, invert) ?
                null : { 'const': { requiredValue: requiredValue, currentValue: currentValue } };
        };
    };
    JsonValidators.minLength = function (minimumLength) {
        if (!hasValue(minimumLength)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentLength = isString(control.value) ? control.value.length : 0;
            var isValid = currentLength >= minimumLength;
            return xor(isValid, invert) ?
                null : { 'minLength': { minimumLength: minimumLength, currentLength: currentLength } };
        };
    };
    
    JsonValidators.maxLength = function (maximumLength) {
        if (!hasValue(maximumLength)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            var currentLength = isString(control.value) ? control.value.length : 0;
            var isValid = currentLength <= maximumLength;
            return xor(isValid, invert) ?
                null : { 'maxLength': { maximumLength: maximumLength, currentLength: currentLength } };
        };
    };
    
    JsonValidators.pattern = function (pattern, wholeString) {
        if (wholeString === void 0) { wholeString = false; }
        if (!hasValue(pattern)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var regex;
            var requiredPattern;
            if (typeof pattern === 'string') {
                requiredPattern = (wholeString) ? "^" + pattern + "$" : pattern;
                regex = new RegExp(requiredPattern);
            }
            else {
                requiredPattern = pattern.toString();
                regex = pattern;
            }
            var currentValue = control.value;
            var isValid = isString(currentValue) ? regex.test(currentValue) : false;
            return xor(isValid, invert) ?
                null : { 'pattern': { requiredPattern: requiredPattern, currentValue: currentValue } };
        };
    };
    JsonValidators.format = function (requiredFormat) {
        if (!hasValue(requiredFormat)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var isValid;
            var currentValue = control.value;
            if (isString(currentValue)) {
                var formatTest = jsonSchemaFormatTests[requiredFormat];
                if (typeof formatTest === 'object') {
                    isValid = formatTest.test(currentValue);
                }
                else if (typeof formatTest === 'function') {
                    isValid = formatTest(currentValue);
                }
                else {
                    console.error("format validator error: \"" + requiredFormat + "\" is not a recognized format.");
                    isValid = true;
                }
            }
            else {
                isValid = ['date', 'time', 'date-time'].includes(requiredFormat) &&
                    Object.prototype.toString.call(currentValue) === '[object Date]';
            }
            return xor(isValid, invert) ?
                null : { 'format': { requiredFormat: requiredFormat, currentValue: currentValue } };
        };
    };
    JsonValidators.minimum = function (minimumValue) {
        if (!hasValue(minimumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isValid = !isNumber(currentValue) || currentValue >= minimumValue;
            return xor(isValid, invert) ?
                null : { 'minimum': { minimumValue: minimumValue, currentValue: currentValue } };
        };
    };
    JsonValidators.exclusiveMinimum = function (exclusiveMinimumValue) {
        if (!hasValue(exclusiveMinimumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isValid = !isNumber(currentValue) || +currentValue < exclusiveMinimumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMinimum': { exclusiveMinimumValue: exclusiveMinimumValue, currentValue: currentValue } };
        };
    };
    JsonValidators.maximum = function (maximumValue) {
        if (!hasValue(maximumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isValid = !isNumber(currentValue) || +currentValue <= maximumValue;
            return xor(isValid, invert) ?
                null : { 'maximum': { maximumValue: maximumValue, currentValue: currentValue } };
        };
    };
    JsonValidators.exclusiveMaximum = function (exclusiveMaximumValue) {
        if (!hasValue(exclusiveMaximumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isValid = !isNumber(currentValue) || +currentValue < exclusiveMaximumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMaximum': { exclusiveMaximumValue: exclusiveMaximumValue, currentValue: currentValue } };
        };
    };
    JsonValidators.multipleOf = function (multipleOfValue) {
        if (!hasValue(multipleOfValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentValue = control.value;
            var isValid = isNumber(currentValue) &&
                currentValue % multipleOfValue === 0;
            return xor(isValid, invert) ?
                null : { 'multipleOf': { multipleOfValue: multipleOfValue, currentValue: currentValue } };
        };
    };
    JsonValidators.minProperties = function (minimumProperties) {
        if (!hasValue(minimumProperties)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentProperties = Object.keys(control.value).length || 0;
            var isValid = currentProperties >= minimumProperties;
            return xor(isValid, invert) ?
                null : { 'minProperties': { minimumProperties: minimumProperties, currentProperties: currentProperties } };
        };
    };
    JsonValidators.maxProperties = function (maximumProperties) {
        if (!hasValue(maximumProperties)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            var currentProperties = Object.keys(control.value).length || 0;
            var isValid = currentProperties <= maximumProperties;
            return xor(isValid, invert) ?
                null : { 'maxProperties': { maximumProperties: maximumProperties, currentProperties: currentProperties } };
        };
    };
    JsonValidators.dependencies = function (dependencies) {
        if (getType(dependencies) !== 'object' || isEmpty(dependencies)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var allErrors = _mergeObjects(forEachCopy(dependencies, function (value, requiringField) {
                if (!hasValue(control.value[requiringField])) {
                    return null;
                }
                var requiringFieldErrors = {};
                var requiredFields;
                var properties = {};
                if (getType(dependencies[requiringField]) === 'array') {
                    requiredFields = dependencies[requiringField];
                }
                else if (getType(dependencies[requiringField]) === 'object') {
                    requiredFields = dependencies[requiringField]['required'] || [];
                    properties = dependencies[requiringField]['properties'] || {};
                }
                for (var _i = 0, requiredFields_1 = requiredFields; _i < requiredFields_1.length; _i++) {
                    var requiredField = requiredFields_1[_i];
                    if (xor(!hasValue(control.value[requiredField]), invert)) {
                        requiringFieldErrors[requiredField] = { 'required': true };
                    }
                }
                requiringFieldErrors = _mergeObjects(requiringFieldErrors, forEachCopy(properties, function (requirements, requiredField) {
                    var requiredFieldErrors = _mergeObjects(forEachCopy(requirements, function (requirement, parameter) {
                        var validator = null;
                        if (requirement === 'maximum' || requirement === 'minimum') {
                            var exclusive = !!requirements['exclusiveM' + requirement.slice(1)];
                            validator = JsonValidators[requirement](parameter, exclusive);
                        }
                        else if (typeof JsonValidators[requirement] === 'function') {
                            validator = JsonValidators[requirement](parameter);
                        }
                        return !isDefined(validator) ?
                            null : validator(control.value[requiredField]);
                    }));
                    return isEmpty(requiredFieldErrors) ?
                        null : (_a = {}, _a[requiredField] = requiredFieldErrors, _a);
                    var _a;
                }));
                return isEmpty(requiringFieldErrors) ?
                    null : (_a = {}, _a[requiringField] = requiringFieldErrors, _a);
                var _a;
            }));
            return isEmpty(allErrors) ? null : allErrors;
        };
    };
    JsonValidators.minItems = function (minimumItems) {
        if (!hasValue(minimumItems)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var currentItems = isArray(control.value) ? control.value.length : 0;
            var isValid = currentItems >= minimumItems;
            return xor(isValid, invert) ?
                null : { 'minItems': { minimumItems: minimumItems, currentItems: currentItems } };
        };
    };
    JsonValidators.maxItems = function (maximumItems) {
        if (!hasValue(maximumItems)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            var currentItems = isArray(control.value) ? control.value.length : 0;
            var isValid = currentItems <= maximumItems;
            return xor(isValid, invert) ?
                null : { 'maxItems': { maximumItems: maximumItems, currentItems: currentItems } };
        };
    };
    JsonValidators.uniqueItems = function (unique) {
        if (unique === void 0) { unique = true; }
        if (!unique) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var sorted = control.value.slice().sort();
            var duplicateItems = [];
            for (var i = 1; i < sorted.length; i++) {
                if (sorted[i - 1] === sorted[i] && duplicateItems.includes(sorted[i])) {
                    duplicateItems.push(sorted[i]);
                }
            }
            var isValid = !duplicateItems.length;
            return xor(isValid, invert) ?
                null : { 'uniqueItems': { duplicateItems: duplicateItems } };
        };
    };
    JsonValidators.contains = function (requiredItem) {
        if (requiredItem === void 0) { requiredItem = true; }
        if (!requiredItem) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value) || !isArray(control.value)) {
                return null;
            }
            var currentItems = control.value;
            var isValid = true;
            return xor(isValid, invert) ?
                null : { 'contains': { requiredItem: requiredItem, currentItems: currentItems } };
        };
    };
    JsonValidators.nullValidator = function (control) {
        return null;
    };
    JsonValidators.composeAnyOf = function (validators) {
        if (!validators) {
            return null;
        }
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            var arrayOfErrors = _executeValidators(control, presentValidators, invert).filter(isDefined);
            var isValid = validators.length > arrayOfErrors.length;
            return xor(isValid, invert) ?
                null : _mergeObjects.apply(void 0, arrayOfErrors.concat([{ 'anyOf': !invert }]));
        };
    };
    JsonValidators.composeOneOf = function (validators) {
        if (!validators) {
            return null;
        }
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            var arrayOfErrors = _executeValidators(control, presentValidators);
            var validControls = validators.length - arrayOfErrors.filter(isDefined).length;
            var isValid = validControls === 1;
            if (xor(isValid, invert)) {
                return null;
            }
            var arrayOfValids = _executeValidators(control, presentValidators, invert);
            return _mergeObjects.apply(void 0, arrayOfErrors.concat(arrayOfValids, [{ 'oneOf': !invert }]));
        };
    };
    JsonValidators.composeAllOf = function (validators) {
        if (!validators) {
            return null;
        }
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            var combinedErrors = _mergeErrors(_executeValidators(control, presentValidators, invert));
            var isValid = combinedErrors === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(combinedErrors, { 'allOf': !invert });
        };
    };
    JsonValidators.composeNot = function (validator) {
        if (!validator) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            var error = validator(control, !invert);
            var isValid = error === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(error, { 'not': !invert });
        };
    };
    JsonValidators.compose = function (validators) {
        if (!validators) {
            return null;
        }
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            return _mergeErrors(_executeValidators(control, presentValidators, invert));
        };
    };
    
    JsonValidators.composeAsync = function (validators) {
        if (!validators) {
            return null;
        }
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control) {
            var observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return map.call(rxjs.forkJoin(observables), _mergeErrors);
        };
    };
    JsonValidators.min = function (min) {
        if (!hasValue(min)) {
            return JsonValidators.nullValidator;
        }
        return function (control) {
            if (isEmpty(control.value) || isEmpty(min)) {
                return null;
            }
            var value = parseFloat(control.value);
            var actual = control.value;
            return isNaN(value) || value >= min ? null : { 'min': { min: min, actual: actual } };
        };
    };
    JsonValidators.max = function (max) {
        if (!hasValue(max)) {
            return JsonValidators.nullValidator;
        }
        return function (control) {
            if (isEmpty(control.value) || isEmpty(max)) {
                return null;
            }
            var value = parseFloat(control.value);
            var actual = control.value;
            return isNaN(value) || value <= max ? null : { 'max': { max: max, actual: actual } };
        };
    };
    JsonValidators.requiredTrue = function (control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        return control.value === true ? null : { 'required': true };
    };
    JsonValidators.email = function (control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    };
    return JsonValidators;
}());

var __assign$3 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function mergeSchemas() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    schemas = schemas.filter(function (schema) { return !isEmpty(schema); });
    if (schemas.some(function (schema) { return !isObject(schema); })) {
        return null;
    }
    var combinedSchema = {};
    for (var _a = 0, schemas_1 = schemas; _a < schemas_1.length; _a++) {
        var schema = schemas_1[_a];
        var _loop_1 = function (key) {
            var combinedValue = combinedSchema[key];
            var schemaValue = schema[key];
            if (!hasOwn(combinedSchema, key) || _.isEqual(combinedValue, schemaValue)) {
                combinedSchema[key] = schemaValue;
            }
            else {
                switch (key) {
                    case 'allOf':
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.allOf = mergeSchemas.apply(void 0, combinedValue.concat(schemaValue));
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'additionalItems':
                    case 'additionalProperties':
                    case 'contains':
                    case 'propertyNames':
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema[key] = mergeSchemas(combinedValue, schemaValue);
                        }
                        else if (key === 'additionalProperties' &&
                            (combinedValue === false || schemaValue === false)) {
                            combinedSchema.combinedSchema = false;
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'anyOf':
                    case 'oneOf':
                    case 'enum':
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema[key] = combinedValue.filter(function (item1) {
                                return schemaValue.findIndex(function (item2) { return _.isEqual(item1, item2); }) > -1;
                            });
                            if (!combinedSchema[key].length) {
                                return { value: { allOf: schemas.slice() } };
                            }
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'definitions':
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            var combinedObject = __assign$3({}, combinedValue);
                            for (var _i = 0, _a = Object.keys(schemaValue); _i < _a.length; _i++) {
                                var subKey = _a[_i];
                                if (!hasOwn(combinedObject, subKey) ||
                                    _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                }
                                else {
                                    return { value: { allOf: schemas.slice() } };
                                }
                            }
                            combinedSchema.definitions = combinedObject;
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'dependencies':
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            var combinedObject = __assign$3({}, combinedValue);
                            for (var _b = 0, _c = Object.keys(schemaValue); _b < _c.length; _b++) {
                                var subKey = _c[_b];
                                if (!hasOwn(combinedObject, subKey) ||
                                    _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                }
                                else if (isArray(schemaValue[subKey]) && isArray(combinedObject[subKey])) {
                                    combinedObject[subKey] = uniqueItems.apply(void 0, combinedObject[subKey].concat(schemaValue[subKey]));
                                }
                                else if ((isArray(schemaValue[subKey]) || isObject(schemaValue[subKey])) &&
                                    (isArray(combinedObject[subKey]) || isObject(combinedObject[subKey]))) {
                                    var required = isArray(combinedSchema.required) ?
                                        combinedSchema.required : [];
                                    var combinedDependency = isArray(combinedObject[subKey]) ?
                                        { required: uniqueItems.apply(void 0, required.concat([combinedObject[subKey]])) } :
                                        combinedObject[subKey];
                                    var schemaDependency = isArray(schemaValue[subKey]) ?
                                        { required: uniqueItems.apply(void 0, required.concat([schemaValue[subKey]])) } :
                                        schemaValue[subKey];
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedDependency, schemaDependency);
                                }
                                else {
                                    return { value: { allOf: schemas.slice() } };
                                }
                            }
                            combinedSchema.dependencies = combinedObject;
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'items':
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items = combinedValue.filter(function (item1) {
                                return schemaValue.findIndex(function (item2) { return _.isEqual(item1, item2); }) > -1;
                            });
                            if (!combinedSchema.items.length) {
                                return { value: { allOf: schemas.slice() } };
                            }
                        }
                        else if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items = mergeSchemas(combinedValue, schemaValue);
                        }
                        else if (isArray(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items =
                                combinedValue.map(function (item) { return mergeSchemas(item, schemaValue); });
                        }
                        else if (isObject(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items =
                                schemaValue.map(function (item) { return mergeSchemas(item, combinedValue); });
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'multipleOf':
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            var gcd_1 = function (x, y) { return !y ? x : gcd_1(y, x % y); };
                            var lcm = function (x, y) { return (x * y) / gcd_1(x, y); };
                            combinedSchema.multipleOf = lcm(combinedValue, schemaValue);
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'maximum':
                    case 'exclusiveMaximum':
                    case 'maxLength':
                    case 'maxItems':
                    case 'maxProperties':
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            combinedSchema[key] = Math.min(combinedValue, schemaValue);
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'minimum':
                    case 'exclusiveMinimum':
                    case 'minLength':
                    case 'minItems':
                    case 'minProperties':
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            combinedSchema[key] = Math.max(combinedValue, schemaValue);
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'not':
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            var notAnyOf = [combinedValue, schemaValue]
                                .reduce(function (notAnyOfArray, notSchema) {
                                return isArray(notSchema.anyOf) &&
                                    Object.keys(notSchema).length === 1 ? notAnyOfArray.concat(notSchema.anyOf) : notAnyOfArray.concat([notSchema]);
                            }, []);
                            combinedSchema.not = { anyOf: notAnyOf };
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'patternProperties':
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            var combinedObject = __assign$3({}, combinedValue);
                            for (var _d = 0, _e = Object.keys(schemaValue); _d < _e.length; _d++) {
                                var subKey = _e[_d];
                                if (!hasOwn(combinedObject, subKey) ||
                                    _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                }
                                else if (isObject(schemaValue[subKey]) && isObject(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { value: { allOf: schemas.slice() } };
                                }
                            }
                            combinedSchema.patternProperties = combinedObject;
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'properties':
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            var combinedObject_1 = __assign$3({}, combinedValue);
                            if (hasOwn(schemaValue, 'additionalProperties')) {
                                Object.keys(combinedValue)
                                    .filter(function (combinedKey) { return !Object.keys(schemaValue).includes(combinedKey); })
                                    .forEach(function (nonMatchingKey) {
                                    if (schemaValue.additionalProperties === false) {
                                        delete combinedObject_1[nonMatchingKey];
                                    }
                                    else if (isObject(schemaValue.additionalProperties)) {
                                        combinedObject_1[nonMatchingKey] = mergeSchemas(combinedObject_1[nonMatchingKey], schemaValue.additionalProperties);
                                    }
                                });
                            }
                            for (var _f = 0, _g = Object.keys(schemaValue); _f < _g.length; _f++) {
                                var subKey = _g[_f];
                                if (_.isEqual(combinedObject_1[subKey], schemaValue[subKey]) || (!hasOwn(combinedObject_1, subKey) &&
                                    !hasOwn(combinedObject_1, 'additionalProperties'))) {
                                    combinedObject_1[subKey] = schemaValue[subKey];
                                }
                                else if (!hasOwn(combinedObject_1, subKey) &&
                                    hasOwn(combinedObject_1, 'additionalProperties')) {
                                    if (isObject(combinedObject_1.additionalProperties)) {
                                        combinedObject_1[subKey] = mergeSchemas(combinedObject_1.additionalProperties, schemaValue[subKey]);
                                    }
                                }
                                else if (isObject(schemaValue[subKey]) &&
                                    isObject(combinedObject_1[subKey])) {
                                    combinedObject_1[subKey] =
                                        mergeSchemas(combinedObject_1[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { value: { allOf: schemas.slice() } };
                                }
                            }
                            combinedSchema.properties = combinedObject_1;
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'required':
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.required = uniqueItems.apply(void 0, combinedValue.concat(schemaValue));
                        }
                        else if (typeof schemaValue === 'boolean' &&
                            typeof combinedValue === 'boolean') {
                            combinedSchema.required = !!combinedValue || !!schemaValue;
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case '$schema':
                    case '$id':
                    case 'id':
                        break;
                    case 'title':
                    case 'description':
                        combinedSchema[key] = schemaValue;
                        break;
                    case 'type':
                        if ((isArray(schemaValue) || isString(schemaValue)) &&
                            (isArray(combinedValue) || isString(combinedValue))) {
                            var combinedTypes = commonItems(combinedValue, schemaValue);
                            if (!combinedTypes.length) {
                                return { value: { allOf: schemas.slice() } };
                            }
                            combinedSchema.type = combinedTypes.length > 1 ? combinedTypes : combinedTypes[0];
                        }
                        else {
                            return { value: { allOf: schemas.slice() } };
                        }
                        break;
                    case 'uniqueItems':
                        combinedSchema.uniqueItems = !!combinedValue || !!schemaValue;
                        break;
                    default: return { value: { allOf: schemas.slice() } };
                }
            }
        };
        for (var _b = 0, _c = Object.keys(schema); _b < _c.length; _b++) {
            var key = _c[_b];
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    return combinedSchema;
}

var __assign$4 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function buildSchemaFromLayout(layout) {
    return;
}
function buildSchemaFromData(data, requireAllFields, isRoot) {
    if (requireAllFields === void 0) { requireAllFields = false; }
    if (isRoot === void 0) { isRoot = true; }
    var newSchema = {};
    var getFieldType = function (value) {
        var fieldType = getType(value, 'strict');
        return { integer: 'number', null: 'string' }[fieldType] || fieldType;
    };
    var buildSubSchema = function (value) {
        return buildSchemaFromData(value, requireAllFields, false);
    };
    if (isRoot) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
    }
    newSchema.type = getFieldType(data);
    if (newSchema.type === 'object') {
        newSchema.properties = {};
        if (requireAllFields) {
            newSchema.required = [];
        }
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            newSchema.properties[key] = buildSubSchema(data[key]);
            if (requireAllFields) {
                newSchema.required.push(key);
            }
        }
    }
    else if (newSchema.type === 'array') {
        newSchema.items = data.map(buildSubSchema);
        if ((new Set(data.map(getFieldType))).size === 1) {
            newSchema.items = newSchema.items.reduce(function (a, b) { return (__assign$4({}, a, b)); }, {});
        }
        if (requireAllFields) {
            newSchema.minItems = 1;
        }
    }
    return newSchema;
}
function getFromSchema(schema, dataPointer, returnType) {
    if (returnType === void 0) { returnType = 'schema'; }
    var dataPointerArray = JsonPointer.parse(dataPointer);
    if (dataPointerArray === null) {
        console.error("getFromSchema error: Invalid JSON Pointer: " + dataPointer);
        return null;
    }
    var subSchema = schema;
    var schemaPointer = [];
    var length = dataPointerArray.length;
    if (returnType.slice(0, 6) === 'parent') {
        dataPointerArray.length--;
    }
    for (var i = 0; i < length; ++i) {
        var key = dataPointerArray[i];
        var subSchemaFound = false;
        if (typeof subSchema !== 'object') {
            console.error("getFromSchema error: Unable to find \"" + key + "\" key in schema.");
            console.error(schema);
            console.error(dataPointer);
            return null;
        }
        if (subSchema.type === 'array' && (!isNaN(key) || key === '-')) {
            if (hasOwn(subSchema, 'items')) {
                if (isObject(subSchema.items)) {
                    subSchemaFound = true;
                    subSchema = subSchema.items;
                    schemaPointer.push('items');
                }
                else if (isArray(subSchema.items)) {
                    if (!isNaN(key) && subSchema.items.length >= +key) {
                        subSchemaFound = true;
                        subSchema = subSchema.items[+key];
                        schemaPointer.push('items', key);
                    }
                }
            }
            if (!subSchemaFound && isObject(subSchema.additionalItems)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalItems;
                schemaPointer.push('additionalItems');
            }
            else if (subSchema.additionalItems !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalItems');
            }
        }
        else if (subSchema.type === 'object') {
            if (isObject(subSchema.properties) && hasOwn(subSchema.properties, key)) {
                subSchemaFound = true;
                subSchema = subSchema.properties[key];
                schemaPointer.push('properties', key);
            }
            else if (isObject(subSchema.additionalProperties)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalProperties;
                schemaPointer.push('additionalProperties');
            }
            else if (subSchema.additionalProperties !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalProperties');
            }
        }
        if (!subSchemaFound) {
            console.error("getFromSchema error: Unable to find \"" + key + "\" item in schema.");
            console.error(schema);
            console.error(dataPointer);
            return;
        }
    }
    return returnType.slice(-7) === 'Pointer' ? schemaPointer : subSchema;
}
function removeRecursiveReferences(pointer, recursiveRefMap, arrayMap) {
    if (arrayMap === void 0) { arrayMap = new Map(); }
    if (!pointer) {
        return '';
    }
    var genericPointer = JsonPointer.toGenericPointer(JsonPointer.compile(pointer), arrayMap);
    if (genericPointer.indexOf('/') === -1) {
        return genericPointer;
    }
    var possibleReferences = true;
    while (possibleReferences) {
        possibleReferences = false;
        recursiveRefMap.forEach(function (toPointer, fromPointer) {
            if (JsonPointer.isSubPointer(toPointer, fromPointer)) {
                while (JsonPointer.isSubPointer(fromPointer, genericPointer, true)) {
                    genericPointer = JsonPointer.toGenericPointer(toPointer + genericPointer.slice(fromPointer.length), arrayMap);
                    possibleReferences = true;
                }
            }
        });
    }
    return genericPointer;
}
function getInputType(schema, layoutNode) {
    if (layoutNode === void 0) { layoutNode = null; }
    var controlType = JsonPointer.getFirst([
        [schema, '/x-schema-form/type'],
        [schema, '/x-schema-form/widget/component'],
        [schema, '/x-schema-form/widget'],
        [schema, '/widget/component'],
        [schema, '/widget']
    ]);
    if (isString(controlType)) {
        return checkInlineType(controlType, schema, layoutNode);
    }
    var schemaType = schema.type;
    if (schemaType) {
        if (isArray(schemaType)) {
            schemaType =
                inArray('object', schemaType) && hasOwn(schema, 'properties') ? 'object' :
                    inArray('array', schemaType) && hasOwn(schema, 'items') ? 'array' :
                        inArray('array', schemaType) && hasOwn(schema, 'additionalItems') ? 'array' :
                            inArray('string', schemaType) ? 'string' :
                                inArray('number', schemaType) ? 'number' :
                                    inArray('integer', schemaType) ? 'integer' :
                                        inArray('boolean', schemaType) ? 'boolean' : 'unknown';
        }
        if (schemaType === 'boolean') {
            return 'checkbox';
        }
        if (schemaType === 'object') {
            if (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) {
                return 'section';
            }
            if (hasOwn(schema, '$ref')) {
                return '$ref';
            }
        }
        if (schemaType === 'array') {
            var itemsObject = JsonPointer.getFirst([
                [schema, '/items'],
                [schema, '/additionalItems']
            ]) || {};
            return hasOwn(itemsObject, 'enum') && schema.maxItems !== 1 ?
                checkInlineType('checkboxes', schema, layoutNode) : 'array';
        }
        if (schemaType === 'null') {
            return 'none';
        }
        if (JsonPointer.has(layoutNode, '/options/titleMap') ||
            hasOwn(schema, 'enum') || getTitleMapFromOneOf(schema, null, true)) {
            return 'select';
        }
        if (schemaType === 'number' || schemaType === 'integer') {
            return (schemaType === 'integer' || hasOwn(schema, 'multipleOf')) &&
                hasOwn(schema, 'maximum') && hasOwn(schema, 'minimum') ? 'range' : schemaType;
        }
        if (schemaType === 'string') {
            return {
                'color': 'color',
                'date': 'date',
                'date-time': 'datetime-local',
                'email': 'email',
                'uri': 'url',
            }[schema.format] || 'text';
        }
    }
    if (hasOwn(schema, '$ref')) {
        return '$ref';
    }
    if (isArray(schema.oneOf) || isArray(schema.anyOf)) {
        return 'one-of';
    }
    console.error("getInputType error: Unable to determine input type for " + schemaType);
    console.error('schema', schema);
    if (layoutNode) {
        console.error('layoutNode', layoutNode);
    }
    return 'none';
}
function checkInlineType(controlType, schema, layoutNode) {
    if (layoutNode === void 0) { layoutNode = null; }
    if (!isString(controlType) || (controlType.slice(0, 8) !== 'checkbox' && controlType.slice(0, 5) !== 'radio')) {
        return controlType;
    }
    if (JsonPointer.getFirst([
        [layoutNode, '/inline'],
        [layoutNode, '/options/inline'],
        [schema, '/inline'],
        [schema, '/x-schema-form/inline'],
        [schema, '/x-schema-form/options/inline'],
        [schema, '/x-schema-form/widget/inline'],
        [schema, '/x-schema-form/widget/component/inline'],
        [schema, '/x-schema-form/widget/component/options/inline'],
        [schema, '/widget/inline'],
        [schema, '/widget/component/inline'],
        [schema, '/widget/component/options/inline'],
    ]) === true) {
        return controlType.slice(0, 5) === 'radio' ?
            'radios-inline' : 'checkboxes-inline';
    }
    else {
        return controlType;
    }
}
function isInputRequired(schema, schemaPointer) {
    if (!isObject(schema)) {
        console.error('isInputRequired error: Input schema must be an object.');
        return false;
    }
    var listPointerArray = JsonPointer.parse(schemaPointer);
    if (isArray(listPointerArray)) {
        if (!listPointerArray.length) {
            return schema.required === true;
        }
        var keyName = listPointerArray.pop();
        var nextToLastKey = listPointerArray[listPointerArray.length - 1];
        if (['properties', 'additionalProperties', 'patternProperties', 'items', 'additionalItems']
            .includes(nextToLastKey)) {
            listPointerArray.pop();
        }
        var parentSchema = JsonPointer.get(schema, listPointerArray) || {};
        if (isArray(parentSchema.required)) {
            return parentSchema.required.includes(keyName);
        }
        if (parentSchema.type === 'array') {
            return hasOwn(parentSchema, 'minItems') &&
                isNumber(keyName) &&
                +parentSchema.minItems > +keyName;
        }
    }
    return false;
}

function updateInputOptions(layoutNode, schema, jsf) {
    if (!isObject(layoutNode) || !isObject(layoutNode.options)) {
        return;
    }
    var newOptions = {};
    var fixUiKeys = function (key) { return key.slice(0, 3).toLowerCase() === 'ui:' ? key.slice(3) : key; };
    mergeFilteredObject(newOptions, jsf.formOptions.defautWidgetOptions, [], fixUiKeys);
    [[JsonPointer.get(schema, '/ui:widget/options'), []],
        [JsonPointer.get(schema, '/ui:widget'), []],
        [schema, [
                'additionalProperties', 'additionalItems', 'properties', 'items',
                'required', 'type', 'x-schema-form', '$ref'
            ]],
        [JsonPointer.get(schema, '/x-schema-form/options'), []],
        [JsonPointer.get(schema, '/x-schema-form'), ['items', 'options']],
        [layoutNode, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ]],
        [layoutNode.options, []],
    ].forEach(function (_a) {
        var object = _a[0], excludeKeys = _a[1];
        return mergeFilteredObject(newOptions, object, excludeKeys, fixUiKeys);
    });
    if (!hasOwn(newOptions, 'titleMap')) {
        var newTitleMap = null;
        newTitleMap = getTitleMapFromOneOf(schema, newOptions.flatList);
        if (newTitleMap) {
            newOptions.titleMap = newTitleMap;
        }
        if (!hasOwn(newOptions, 'titleMap') && !hasOwn(newOptions, 'enum') && hasOwn(schema, 'items')) {
            if (JsonPointer.has(schema, '/items/titleMap')) {
                newOptions.titleMap = schema.items.titleMap;
            }
            else if (JsonPointer.has(schema, '/items/enum')) {
                newOptions.enum = schema.items.enum;
                if (!hasOwn(newOptions, 'enumNames') && JsonPointer.has(schema, '/items/enumNames')) {
                    newOptions.enumNames = schema.items.enumNames;
                }
            }
            else if (JsonPointer.has(schema, '/items/oneOf')) {
                newTitleMap = getTitleMapFromOneOf(schema.items, newOptions.flatList);
                if (newTitleMap) {
                    newOptions.titleMap = newTitleMap;
                }
            }
        }
    }
    if (schema.type === 'integer' && !hasValue(newOptions.multipleOf)) {
        newOptions.multipleOf = 1;
    }
    if (JsonPointer.has(newOptions, '/autocomplete/source')) {
        newOptions.typeahead = newOptions.autocomplete;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/source')) {
        newOptions.typeahead = newOptions.tagsinput;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/typeahead/source')) {
        newOptions.typeahead = newOptions.tagsinput.typeahead;
    }
    layoutNode.options = newOptions;
}
function getTitleMapFromOneOf(schema, flatList, validateOnly) {
    if (schema === void 0) { schema = {}; }
    if (flatList === void 0) { flatList = null; }
    if (validateOnly === void 0) { validateOnly = false; }
    var titleMap = null;
    var oneOf = schema.oneOf || schema.anyOf || null;
    if (isArray(oneOf) && oneOf.every(function (item) { return item.title; })) {
        if (oneOf.every(function (item) { return isArray(item.enum) && item.enum.length === 1; })) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(function (item) { return ({ name: item.title, value: item.enum[0] }); });
        }
        else if (oneOf.every(function (item) { return item.const; })) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(function (item) { return ({ name: item.title, value: item.const }); });
        }
        if (flatList !== false && (titleMap || [])
            .filter(function (title) { return ((title || {}).name || '').indexOf(': '); }).length > 1) {
            var newTitleMap_1 = titleMap.map(function (title) {
                var _a = title.name.split(/: (.+)/), group = _a[0], name = _a[1];
                return group && name ? __assign$4({}, title, { group: group, name: name }) : title;
            });
            if (flatList === true || newTitleMap_1.some(function (title, index) { return index &&
                hasOwn(title, 'group') && title.group === newTitleMap_1[index - 1].group; })) {
                titleMap = newTitleMap_1;
            }
        }
    }
    return validateOnly ? false : titleMap;
}
function getControlValidators(schema) {
    if (!isObject(schema)) {
        return null;
    }
    var validators = {};
    if (hasOwn(schema, 'type')) {
        switch (schema.type) {
            case 'string':
                forEach(['pattern', 'format', 'minLength', 'maxLength'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'number':
            case 'integer':
                forEach(['Minimum', 'Maximum'], function (ucLimit) {
                    var eLimit = 'exclusive' + ucLimit;
                    var limit = ucLimit.toLowerCase();
                    if (hasOwn(schema, limit)) {
                        var exclusive = hasOwn(schema, eLimit) && schema[eLimit] === true;
                        validators[limit] = [schema[limit], exclusive];
                    }
                });
                forEach(['multipleOf', 'type'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'object':
                forEach(['minProperties', 'maxProperties', 'dependencies'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'array':
                forEach(['minItems', 'maxItems', 'uniqueItems'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
        }
    }
    if (hasOwn(schema, 'enum')) {
        validators.enum = [schema.enum];
    }
    return validators;
}
function resolveSchemaReferences(schema, schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, arrayMap) {
    if (!isObject(schema)) {
        console.error('resolveSchemaReferences error: schema must be an object.');
        return;
    }
    var refLinks = new Set();
    var refMapSet = new Set();
    var refMap = new Map();
    var recursiveRefMap = new Map();
    var refLibrary = {};
    JsonPointer.forEachDeep(schema, function (subSchema, subSchemaPointer) {
        if (hasOwn(subSchema, '$ref') && isString(subSchema['$ref'])) {
            var refPointer = JsonPointer.compile(subSchema['$ref']);
            refLinks.add(refPointer);
            refMapSet.add(subSchemaPointer + '~~' + refPointer);
            refMap.set(subSchemaPointer, refPointer);
        }
    });
    refLinks.forEach(function (ref) { return refLibrary[ref] = getSubSchema(schema, ref); });
    var checkRefLinks = true;
    while (checkRefLinks) {
        checkRefLinks = false;
        Array.from(refMap).forEach(function (_a) {
            var fromRef1 = _a[0], toRef1 = _a[1];
            return Array.from(refMap)
                .filter(function (_a) {
                var fromRef2 = _a[0], toRef2 = _a[1];
                return JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
                    !JsonPointer.isSubPointer(toRef2, toRef1, true) &&
                    !refMapSet.has(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
            })
                .forEach(function (_a) {
                var fromRef2 = _a[0], toRef2 = _a[1];
                refMapSet.add(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
                checkRefLinks = true;
            });
        });
    }
    Array.from(refMapSet)
        .map(function (refLink) { return refLink.split('~~'); })
        .filter(function (_a) {
        var fromRef = _a[0], toRef = _a[1];
        return JsonPointer.isSubPointer(toRef, fromRef);
    })
        .forEach(function (_a) {
        var fromRef = _a[0], toRef = _a[1];
        return recursiveRefMap.set(fromRef, toRef);
    });
    Array.from(refMap)
        .filter(function (_a) {
        var fromRef1 = _a[0], toRef1 = _a[1];
        return Array.from(recursiveRefMap.keys())
            .every(function (fromRef2) { return !JsonPointer.isSubPointer(fromRef1, fromRef2, true); });
    })
        .forEach(function (_a) {
        var fromRef1 = _a[0], toRef1 = _a[1];
        return Array.from(recursiveRefMap)
            .filter(function (_a) {
            var fromRef2 = _a[0], toRef2 = _a[1];
            return !recursiveRefMap.has(fromRef1 + fromRef2.slice(toRef1.length)) &&
                JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
                !JsonPointer.isSubPointer(toRef1, fromRef1, true);
        })
            .forEach(function (_a) {
            var fromRef2 = _a[0], toRef2 = _a[1];
            return recursiveRefMap.set(fromRef1 + fromRef2.slice(toRef1.length), fromRef1 + toRef2.slice(toRef1.length));
        });
    });
    var compiledSchema = __assign$4({}, schema);
    delete compiledSchema.definitions;
    compiledSchema =
        getSubSchema(compiledSchema, '', refLibrary, recursiveRefMap);
    JsonPointer.forEachDeep(compiledSchema, function (subSchema, subSchemaPointer) {
        if (isString(subSchema['$ref'])) {
            var refPointer = JsonPointer.compile(subSchema['$ref']);
            if (!JsonPointer.isSubPointer(refPointer, subSchemaPointer, true)) {
                refPointer = removeRecursiveReferences(subSchemaPointer, recursiveRefMap);
                JsonPointer.set(compiledSchema, subSchemaPointer, { $ref: "#" + refPointer });
            }
            if (!hasOwn(schemaRefLibrary, 'refPointer')) {
                schemaRefLibrary[refPointer] = !refPointer.length ? compiledSchema :
                    getSubSchema(compiledSchema, refPointer, schemaRefLibrary, recursiveRefMap);
            }
            if (!schemaRecursiveRefMap.has(subSchemaPointer)) {
                schemaRecursiveRefMap.set(subSchemaPointer, refPointer);
            }
            var fromDataRef = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!dataRecursiveRefMap.has(fromDataRef)) {
                var toDataRef = JsonPointer.toDataPointer(refPointer, compiledSchema);
                dataRecursiveRefMap.set(fromDataRef, toDataRef);
            }
        }
        if (subSchema.type === 'array' &&
            (hasOwn(subSchema, 'items') || hasOwn(subSchema, 'additionalItems'))) {
            var dataPointer = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!arrayMap.has(dataPointer)) {
                var tupleItems = isArray(subSchema.items) ? subSchema.items.length : 0;
                arrayMap.set(dataPointer, tupleItems);
            }
        }
    }, true);
    return compiledSchema;
}
function getSubSchema(schema, pointer, schemaRefLibrary, schemaRecursiveRefMap, usedPointers) {
    if (schemaRefLibrary === void 0) { schemaRefLibrary = null; }
    if (schemaRecursiveRefMap === void 0) { schemaRecursiveRefMap = null; }
    if (usedPointers === void 0) { usedPointers = []; }
    if (!schemaRefLibrary || !schemaRecursiveRefMap) {
        return JsonPointer.getCopy(schema, pointer);
    }
    if (typeof pointer !== 'string') {
        pointer = JsonPointer.compile(pointer);
    }
    usedPointers = usedPointers.concat([pointer]);
    var newSchema = null;
    if (pointer === '') {
        newSchema = _.cloneDeep(schema);
    }
    else {
        var shortPointer = removeRecursiveReferences(pointer, schemaRecursiveRefMap);
        if (shortPointer !== pointer) {
            usedPointers = usedPointers.concat([shortPointer]);
        }
        newSchema = JsonPointer.getFirstCopy([
            [schemaRefLibrary, [shortPointer]],
            [schema, pointer],
            [schema, shortPointer]
        ]);
    }
    return JsonPointer.forEachDeepCopy(newSchema, function (subSchema, subPointer) {
        if (isObject(subSchema)) {
            if (isString(subSchema.$ref)) {
                var refPointer_1 = JsonPointer.compile(subSchema.$ref);
                if (refPointer_1.length && usedPointers.every(function (ptr) {
                    return !JsonPointer.isSubPointer(refPointer_1, ptr, true);
                })) {
                    var refSchema = getSubSchema(schema, refPointer_1, schemaRefLibrary, schemaRecursiveRefMap, usedPointers);
                    if (Object.keys(subSchema).length === 1) {
                        return refSchema;
                    }
                    else {
                        var extraKeys = __assign$4({}, subSchema);
                        delete extraKeys.$ref;
                        return mergeSchemas(refSchema, extraKeys);
                    }
                }
            }
            if (isArray(subSchema.allOf)) {
                return combineAllOf(subSchema);
            }
            if (subSchema.type === 'array' && isArray(subSchema.required)) {
                return fixRequiredArrayProperties(subSchema);
            }
        }
        return subSchema;
    }, true, pointer);
}
function combineAllOf(schema) {
    if (!isObject(schema) || !isArray(schema.allOf)) {
        return schema;
    }
    var mergedSchema = mergeSchemas.apply(void 0, schema.allOf);
    if (Object.keys(schema).length > 1) {
        var extraKeys = __assign$4({}, schema);
        delete extraKeys.allOf;
        mergedSchema = mergeSchemas(mergedSchema, extraKeys);
    }
    return mergedSchema;
}
function fixRequiredArrayProperties(schema) {
    if (schema.type === 'array' && isArray(schema.required)) {
        var itemsObject_1 = hasOwn(schema.items, 'properties') ? 'items' :
            hasOwn(schema.additionalItems, 'properties') ? 'additionalItems' : null;
        if (itemsObject_1 && !hasOwn(schema[itemsObject_1], 'required') && (hasOwn(schema[itemsObject_1], 'additionalProperties') ||
            schema.required.every(function (key) { return hasOwn(schema[itemsObject_1].properties, key); }))) {
            schema = _.cloneDeep(schema);
            schema[itemsObject_1].required = schema.required;
            delete schema.required;
        }
    }
    return schema;
}

var __assign$5 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

function convertSchemaToDraft6(schema, options) {
    if (options === void 0) { options = {}; }
    var draft = options.draft || null;
    var changed = options.changed || false;
    if (typeof schema !== 'object') {
        return schema;
    }
    if (typeof schema.map === 'function') {
        return schema.map(function (subSchema) { return convertSchemaToDraft6(subSchema, { changed: changed, draft: draft }); }).slice();
    }
    var newSchema = __assign$5({}, schema);
    var simpleTypes = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
    if (typeof newSchema.$schema === 'string' &&
        /http\:\/\/json\-schema\.org\/draft\-0\d\/schema\#/.test(newSchema.$schema)) {
        draft = newSchema.$schema[30];
    }
    if (newSchema.contentEncoding) {
        newSchema.media = { binaryEncoding: newSchema.contentEncoding };
        delete newSchema.contentEncoding;
        changed = true;
    }
    if (typeof newSchema.extends === 'object') {
        newSchema.allOf = typeof newSchema.extends.map === 'function' ?
            newSchema.extends.map(function (subSchema) { return convertSchemaToDraft6(subSchema, { changed: changed, draft: draft }); }) :
            [convertSchemaToDraft6(newSchema.extends, { changed: changed, draft: draft })];
        delete newSchema.extends;
        changed = true;
    }
    if (newSchema.disallow) {
        if (typeof newSchema.disallow === 'string') {
            newSchema.not = { type: newSchema.disallow };
        }
        else if (typeof newSchema.disallow.map === 'function') {
            newSchema.not = {
                anyOf: newSchema.disallow
                    .map(function (type) { return typeof type === 'object' ? type : { type: type }; })
            };
        }
        delete newSchema.disallow;
        changed = true;
    }
    if (typeof newSchema.dependencies === 'object' &&
        Object.keys(newSchema.dependencies)
            .some(function (key) { return typeof newSchema.dependencies[key] === 'string'; })) {
        newSchema.dependencies = __assign$5({}, newSchema.dependencies);
        Object.keys(newSchema.dependencies)
            .filter(function (key) { return typeof newSchema.dependencies[key] === 'string'; })
            .forEach(function (key) { return newSchema.dependencies[key] = [newSchema.dependencies[key]]; });
        changed = true;
    }
    if (typeof newSchema.maxDecimal === 'number') {
        newSchema.multipleOf = 1 / Math.pow(10, newSchema.maxDecimal);
        delete newSchema.divisibleBy;
        changed = true;
        if (!draft || draft === 2) {
            draft = 1;
        }
    }
    if (typeof newSchema.divisibleBy === 'number') {
        newSchema.multipleOf = newSchema.divisibleBy;
        delete newSchema.divisibleBy;
        changed = true;
    }
    if (typeof newSchema.minimum === 'number' && newSchema.minimumCanEqual === false) {
        newSchema.exclusiveMinimum = newSchema.minimum;
        delete newSchema.minimum;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    else if (typeof newSchema.minimumCanEqual === 'boolean') {
        delete newSchema.minimumCanEqual;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    if (typeof newSchema.minimum === 'number' && newSchema.exclusiveMinimum === true) {
        newSchema.exclusiveMinimum = newSchema.minimum;
        delete newSchema.minimum;
        changed = true;
    }
    else if (typeof newSchema.exclusiveMinimum === 'boolean') {
        delete newSchema.exclusiveMinimum;
        changed = true;
    }
    if (typeof newSchema.maximum === 'number' && newSchema.maximumCanEqual === false) {
        newSchema.exclusiveMaximum = newSchema.maximum;
        delete newSchema.maximum;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    else if (typeof newSchema.maximumCanEqual === 'boolean') {
        delete newSchema.maximumCanEqual;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    if (typeof newSchema.maximum === 'number' && newSchema.exclusiveMaximum === true) {
        newSchema.exclusiveMaximum = newSchema.maximum;
        delete newSchema.maximum;
        changed = true;
    }
    else if (typeof newSchema.exclusiveMaximum === 'boolean') {
        delete newSchema.exclusiveMaximum;
        changed = true;
    }
    if (typeof newSchema.properties === 'object') {
        var properties_1 = __assign$5({}, newSchema.properties);
        var requiredKeys_1 = Array.isArray(newSchema.required) ?
            new Set(newSchema.required) : new Set();
        if (draft === 1 || draft === 2 ||
            Object.keys(properties_1).some(function (key) { return properties_1[key].optional === true; })) {
            Object.keys(properties_1)
                .filter(function (key) { return properties_1[key].optional !== true; })
                .forEach(function (key) { return requiredKeys_1.add(key); });
            changed = true;
            if (!draft) {
                draft = 2;
            }
        }
        if (Object.keys(properties_1).some(function (key) { return properties_1[key].required === true; })) {
            Object.keys(properties_1)
                .filter(function (key) { return properties_1[key].required === true; })
                .forEach(function (key) { return requiredKeys_1.add(key); });
            changed = true;
        }
        if (requiredKeys_1.size) {
            newSchema.required = Array.from(requiredKeys_1);
        }
        if (Object.keys(properties_1).some(function (key) { return properties_1[key].requires; })) {
            var dependencies_1 = typeof newSchema.dependencies === 'object' ? __assign$5({}, newSchema.dependencies) : {};
            Object.keys(properties_1)
                .filter(function (key) { return properties_1[key].requires; })
                .forEach(function (key) { return dependencies_1[key] =
                typeof properties_1[key].requires === 'string' ?
                    [properties_1[key].requires] : properties_1[key].requires; });
            newSchema.dependencies = dependencies_1;
            changed = true;
            if (!draft) {
                draft = 2;
            }
        }
        newSchema.properties = properties_1;
    }
    if (typeof newSchema.optional === 'boolean') {
        delete newSchema.optional;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    if (newSchema.requires) {
        delete newSchema.requires;
    }
    if (typeof newSchema.required === 'boolean') {
        delete newSchema.required;
    }
    if (typeof newSchema.id === 'string' && !newSchema.$id) {
        if (newSchema.id.slice(-1) === '#') {
            newSchema.id = newSchema.id.slice(0, -1);
        }
        newSchema.$id = newSchema.id + '-CONVERTED-TO-DRAFT-06#';
        delete newSchema.id;
        changed = true;
    }
    if (newSchema.type && (typeof newSchema.type.every === 'function' ?
        !newSchema.type.every(function (type) { return simpleTypes.includes(type); }) :
        !simpleTypes.includes(newSchema.type))) {
        changed = true;
    }
    if (typeof newSchema.$schema === 'string' &&
        /http\:\/\/json\-schema\.org\/draft\-0[1-4]\/schema\#/.test(newSchema.$schema)) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
        changed = true;
    }
    else if (changed && typeof newSchema.$schema === 'string') {
        var addToDescription = 'Converted to draft 6 from ' + newSchema.$schema;
        if (typeof newSchema.description === 'string' && newSchema.description.length) {
            newSchema.description += '\n' + addToDescription;
        }
        else {
            newSchema.description = addToDescription;
        }
        delete newSchema.$schema;
    }
    if (newSchema.type && (typeof newSchema.type.every === 'function' ?
        !newSchema.type.every(function (type) { return simpleTypes.includes(type); }) :
        !simpleTypes.includes(newSchema.type))) {
        if (newSchema.type.length === 1) {
            newSchema.type = newSchema.type[0];
        }
        if (typeof newSchema.type === 'string') {
            if (newSchema.type === 'any') {
                newSchema.type = simpleTypes;
            }
            else {
                delete newSchema.type;
            }
        }
        else if (typeof newSchema.type === 'object') {
            if (typeof newSchema.type.every === 'function') {
                if (newSchema.type.every(function (type) { return typeof type === 'string'; })) {
                    newSchema.type = newSchema.type.some(function (type) { return type === 'any'; }) ?
                        newSchema.type = simpleTypes :
                        newSchema.type.filter(function (type) { return simpleTypes.includes(type); });
                }
                else if (newSchema.type.length > 1) {
                    var arrayKeys = ['additionalItems', 'items', 'maxItems', 'minItems', 'uniqueItems', 'contains'];
                    var numberKeys = ['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum'];
                    var objectKeys = ['maxProperties', 'minProperties', 'required', 'additionalProperties',
                        'properties', 'patternProperties', 'dependencies', 'propertyNames'];
                    var stringKeys = ['maxLength', 'minLength', 'pattern', 'format'];
                    var filterKeys_1 = {
                        'array': numberKeys.concat(objectKeys, stringKeys),
                        'integer': arrayKeys.concat(objectKeys, stringKeys),
                        'number': arrayKeys.concat(objectKeys, stringKeys),
                        'object': arrayKeys.concat(numberKeys, stringKeys),
                        'string': arrayKeys.concat(numberKeys, objectKeys),
                        'all': arrayKeys.concat(numberKeys, objectKeys, stringKeys),
                    };
                    var anyOf = [];
                    var _loop_1 = function (type) {
                        var newType = typeof type === 'string' ? { type: type } : __assign$5({}, type);
                        Object.keys(newSchema)
                            .filter(function (key) { return !newType.hasOwnProperty(key) &&
                            !(filterKeys_1[newType.type] || filterKeys_1.all).concat(['type', 'default']).includes(key); })
                            .forEach(function (key) { return newType[key] = newSchema[key]; });
                        anyOf.push(newType);
                    };
                    for (var _i = 0, _a = newSchema.type; _i < _a.length; _i++) {
                        var type = _a[_i];
                        _loop_1(type);
                    }
                    newSchema = newSchema.hasOwnProperty('default') ?
                        { anyOf: anyOf, default: newSchema.default } : { anyOf: anyOf };
                }
                else {
                    var typeSchema = newSchema.type;
                    delete newSchema.type;
                    Object.assign(newSchema, typeSchema);
                }
            }
        }
        else {
            delete newSchema.type;
        }
    }
    Object.keys(newSchema)
        .filter(function (key) { return typeof newSchema[key] === 'object'; })
        .forEach(function (key) {
        if (['definitions', 'dependencies', 'properties', 'patternProperties']
            .includes(key) && typeof newSchema[key].map !== 'function') {
            var newKey_1 = {};
            Object.keys(newSchema[key]).forEach(function (subKey) { return newKey_1[subKey] =
                convertSchemaToDraft6(newSchema[key][subKey], { changed: changed, draft: draft }); });
            newSchema[key] = newKey_1;
        }
        else if (['items', 'additionalItems', 'additionalProperties',
            'allOf', 'anyOf', 'oneOf', 'not'].includes(key)) {
            newSchema[key] = convertSchemaToDraft6(newSchema[key], { changed: changed, draft: draft });
        }
        else {
            newSchema[key] = _.cloneDeep(newSchema[key]);
        }
    });
    return newSchema;
}

var __assign$6 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function buildFormGroupTemplate(jsf, nodeValue, setValues, schemaPointer, dataPointer, templatePointer) {
    if (nodeValue === void 0) { nodeValue = null; }
    if (setValues === void 0) { setValues = true; }
    if (schemaPointer === void 0) { schemaPointer = ''; }
    if (dataPointer === void 0) { dataPointer = ''; }
    if (templatePointer === void 0) { templatePointer = ''; }
    var schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (setValues) {
        if (!isDefined(nodeValue) && (jsf.formOptions.setSchemaDefaults === true ||
            (jsf.formOptions.setSchemaDefaults === 'auto' && isEmpty(jsf.formValues)))) {
            nodeValue = JsonPointer.get(jsf.schema, schemaPointer + '/default');
        }
    }
    else {
        nodeValue = null;
    }
    var schemaType = JsonPointer.get(schema, '/type');
    var controlType = (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) &&
        schemaType === 'object' ? 'FormGroup' :
        (hasOwn(schema, 'items') || hasOwn(schema, 'additionalItems')) &&
            schemaType === 'array' ? 'FormArray' :
            !schemaType && hasOwn(schema, '$ref') ? '$ref' : 'FormControl';
    var shortDataPointer = removeRecursiveReferences(dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    var nodeOptions = jsf.dataMap.get(shortDataPointer);
    if (!nodeOptions.has('schemaType')) {
        nodeOptions.set('schemaPointer', schemaPointer);
        nodeOptions.set('schemaType', schema.type);
        if (schema.format) {
            nodeOptions.set('schemaFormat', schema.format);
            if (!schema.type) {
                nodeOptions.set('schemaType', 'string');
            }
        }
        if (controlType) {
            nodeOptions.set('templatePointer', templatePointer);
            nodeOptions.set('templateType', controlType);
        }
    }
    var controls;
    var validators = getControlValidators(schema);
    switch (controlType) {
        case 'FormGroup':
            controls = {};
            if (hasOwn(schema, 'ui:order') || hasOwn(schema, 'properties')) {
                var propertyKeys_1 = schema['ui:order'] || Object.keys(schema.properties);
                if (propertyKeys_1.includes('*') && !hasOwn(schema.properties, '*')) {
                    var unnamedKeys = Object.keys(schema.properties)
                        .filter(function (key) { return !propertyKeys_1.includes(key); });
                    for (var i = propertyKeys_1.length - 1; i >= 0; i--) {
                        if (propertyKeys_1[i] === '*') {
                            propertyKeys_1.splice.apply(propertyKeys_1, [i, 1].concat(unnamedKeys));
                        }
                    }
                }
                propertyKeys_1
                    .filter(function (key) { return hasOwn(schema.properties, key) ||
                    hasOwn(schema, 'additionalProperties'); })
                    .forEach(function (key) { return controls[key] = buildFormGroupTemplate(jsf, JsonPointer.get(nodeValue, [key]), setValues, schemaPointer + (hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties'), dataPointer + '/' + key, templatePointer + '/controls/' + key); });
                jsf.formOptions.fieldsRequired = setRequiredFields(schema, controls);
            }
            return { controlType: controlType, controls: controls, validators: validators };
        case 'FormArray':
            controls = [];
            var minItems = Math.max(schema.minItems || 0, nodeOptions.get('minItems') || 0);
            var maxItems = Math.min(schema.maxItems || 1000, nodeOptions.get('maxItems') || 1000);
            var additionalItemsPointer = null;
            if (isArray(schema.items)) {
                var tupleItems = nodeOptions.get('tupleItems') ||
                    (isArray(schema.items) ? Math.min(schema.items.length, maxItems) : 0);
                for (var i = 0; i < tupleItems; i++) {
                    if (i < minItems) {
                        controls.push(buildFormGroupTemplate(jsf, isArray(nodeValue) ? nodeValue[i] : nodeValue, setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i));
                    }
                    else {
                        var schemaRefPointer = removeRecursiveReferences(schemaPointer + '/items/' + i, jsf.schemaRecursiveRefMap);
                        var itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                        var itemRecursive = itemRefPointer !== shortDataPointer + '/' + i;
                        if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                            jsf.templateRefLibrary[itemRefPointer] = null;
                            jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/' + i);
                        }
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i) :
                            itemRecursive ?
                                null : _.cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
                if (schema.items.length < maxItems && isObject(schema.additionalItems)) {
                    additionalItemsPointer = schemaPointer + '/additionalItems';
                }
            }
            else {
                additionalItemsPointer = schemaPointer + '/items';
            }
            if (additionalItemsPointer) {
                var schemaRefPointer = removeRecursiveReferences(additionalItemsPointer, jsf.schemaRecursiveRefMap);
                var itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                var itemRecursive = itemRefPointer !== shortDataPointer + '/-';
                if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                    jsf.templateRefLibrary[itemRefPointer] = null;
                    jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/-');
                }
                var itemOptions = nodeOptions;
                if (!itemRecursive || hasOwn(validators, 'required')) {
                    var arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                        (itemOptions.get('tupleItems') + itemOptions.get('listItems')) || 0, isArray(nodeValue) ? nodeValue.length : 0), maxItems);
                    for (var i = controls.length; i < arrayLength; i++) {
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaRefPointer, dataPointer + '/-', templatePointer + '/controls/-') :
                            itemRecursive ?
                                null : _.cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
            }
            return { controlType: controlType, controls: controls, validators: validators };
        case '$ref':
            var schemaRef = JsonPointer.compile(schema.$ref);
            var dataRef = JsonPointer.toDataPointer(schemaRef, schema);
            var refPointer = removeRecursiveReferences(dataRef, jsf.dataRecursiveRefMap, jsf.arrayMap);
            if (refPointer && !hasOwn(jsf.templateRefLibrary, refPointer)) {
                jsf.templateRefLibrary[refPointer] = null;
                var newTemplate = buildFormGroupTemplate(jsf, setValues, setValues, schemaRef);
                if (newTemplate) {
                    jsf.templateRefLibrary[refPointer] = newTemplate;
                }
                else {
                    delete jsf.templateRefLibrary[refPointer];
                }
            }
            return null;
        case 'FormControl':
            var value = {
                value: setValues && isPrimitive(nodeValue) ? nodeValue : null,
                disabled: nodeOptions.get('disabled') || false
            };
            return { controlType: controlType, value: value, validators: validators };
        default:
            return null;
    }
}
function buildFormGroup(template) {
    var validatorFns = [];
    var validatorFn = null;
    if (hasOwn(template, 'validators')) {
        forEach(template.validators, function (parameters, validator) {
            if (typeof JsonValidators[validator] === 'function') {
                validatorFns.push(JsonValidators[validator].apply(null, parameters));
            }
        });
        if (validatorFns.length &&
            inArray(template.controlType, ['FormGroup', 'FormArray'])) {
            validatorFn = validatorFns.length > 1 ?
                JsonValidators.compose(validatorFns) : validatorFns[0];
        }
    }
    if (hasOwn(template, 'controlType')) {
        switch (template.controlType) {
            case 'FormGroup':
                var groupControls_1 = {};
                forEach(template.controls, function (controls, key) {
                    var newControl = buildFormGroup(controls);
                    if (newControl) {
                        groupControls_1[key] = newControl;
                    }
                });
                return new forms.FormGroup(groupControls_1, validatorFn);
            case 'FormArray':
                return new forms.FormArray(_.filter(_.map(template.controls, function (controls) { return buildFormGroup(controls); })), validatorFn);
            case 'FormControl':
                return new forms.FormControl(template.value, validatorFns);
        }
    }
    return null;
}

function setRequiredFields(schema, formControlTemplate) {
    var fieldsRequired = false;
    if (hasOwn(schema, 'required') && !isEmpty(schema.required)) {
        fieldsRequired = true;
        var requiredArray = isArray(schema.required) ? schema.required : [schema.required];
        requiredArray = forEach(requiredArray, function (key) { return JsonPointer.set(formControlTemplate, '/' + key + '/validators/required', []); });
    }
    return fieldsRequired;
}
function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields, fixErrors) {
    if (returnEmptyFields === void 0) { returnEmptyFields = false; }
    if (fixErrors === void 0) { fixErrors = false; }
    if (formData === null || typeof formData !== 'object') {
        return formData;
    }
    var formattedData = isArray(formData) ? [] : {};
    JsonPointer.forEachDeep(formData, function (value, dataPointer) {
        if (returnEmptyFields && isArray(value)) {
            JsonPointer.set(formattedData, dataPointer, []);
        }
        else if (returnEmptyFields && isObject(value) && !isDate(value)) {
            JsonPointer.set(formattedData, dataPointer, {});
        }
        else {
            var genericPointer_1 = JsonPointer.has(dataMap, [dataPointer, 'schemaType']) ? dataPointer :
                removeRecursiveReferences(dataPointer, recursiveRefMap, arrayMap);
            if (JsonPointer.has(dataMap, [genericPointer_1, 'schemaType'])) {
                var schemaType = dataMap.get(genericPointer_1).get('schemaType');
                if (schemaType === 'null') {
                    JsonPointer.set(formattedData, dataPointer, null);
                }
                else if ((hasValue(value) || returnEmptyFields) &&
                    inArray(schemaType, ['string', 'integer', 'number', 'boolean'])) {
                    var newValue = (fixErrors || (value === null && returnEmptyFields)) ?
                        toSchemaType(value, schemaType) : toJavaScriptType(value, schemaType);
                    if (isDefined(newValue) || returnEmptyFields) {
                        JsonPointer.set(formattedData, dataPointer, newValue);
                    }
                }
                else if (schemaType === 'object' && !returnEmptyFields) {
                    (dataMap.get(genericPointer_1).get('required') || []).forEach(function (key) {
                        var keySchemaType = dataMap.get(genericPointer_1 + "/" + key).get('schemaType');
                        if (keySchemaType === 'array') {
                            JsonPointer.set(formattedData, dataPointer + "/" + key, []);
                        }
                        else if (keySchemaType === 'object') {
                            JsonPointer.set(formattedData, dataPointer + "/" + key, {});
                        }
                    });
                }
                if (dataMap.get(genericPointer_1).get('schemaFormat') === 'date-time') {
                    if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + "Z");
                    }
                    else if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + ":00Z");
                    }
                    else if (fixErrors && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + ":00:00:00Z");
                    }
                }
            }
            else if (typeof value !== 'object' || isDate(value) ||
                (value === null && returnEmptyFields)) {
                console.error('formatFormData error: ' +
                    ("Schema type not found for form value at " + genericPointer_1));
                console.error('dataMap', dataMap);
                console.error('recursiveRefMap', recursiveRefMap);
                console.error('genericPointer', genericPointer_1);
            }
        }
    });
    return formattedData;
}
function getControl(formGroup, dataPointer, returnGroup) {
    if (returnGroup === void 0) { returnGroup = false; }
    if (!isObject(formGroup) || !JsonPointer.isJsonPointer(dataPointer)) {
        if (!JsonPointer.isJsonPointer(dataPointer)) {
            if (typeof dataPointer === 'string') {
                var formControl = formGroup.get(dataPointer);
                if (formControl) {
                    return formControl;
                }
            }
            console.error("getControl error: Invalid JSON Pointer: " + dataPointer);
        }
        if (!isObject(formGroup)) {
            console.error("getControl error: Invalid formGroup: " + formGroup);
        }
        return null;
    }
    var dataPointerArray = JsonPointer.parse(dataPointer);
    if (returnGroup) {
        dataPointerArray = dataPointerArray.slice(0, -1);
    }
    if (typeof formGroup.get === 'function' &&
        dataPointerArray.every(function (key) { return key.indexOf('.') === -1; })) {
        var formControl = formGroup.get(dataPointerArray.join('.'));
        if (formControl) {
            return formControl;
        }
    }
    var subGroup = formGroup;
    for (var _i = 0, dataPointerArray_1 = dataPointerArray; _i < dataPointerArray_1.length; _i++) {
        var key = dataPointerArray_1[_i];
        if (hasOwn(subGroup, 'controls')) {
            subGroup = subGroup.controls;
        }
        if (isArray(subGroup) && (key === '-')) {
            subGroup = subGroup[subGroup.length - 1];
        }
        else if (hasOwn(subGroup, key)) {
            subGroup = subGroup[key];
        }
        else {
            console.error("getControl error: Unable to find \"" + key + "\" item in FormGroup.");
            console.error(dataPointer);
            console.error(formGroup);
            return;
        }
    }
    return subGroup;
}

var __assign$7 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function buildLayout(jsf, widgetLibrary) {
    var hasSubmitButton = !JsonPointer.get(jsf, '/formOptions/addSubmit');
    var formLayout = mapLayout(jsf.layout, function (layoutItem, index, layoutPointer) {
        var newNode = {
            _id: _.uniqueId(),
            options: {},
        };
        if (isObject(layoutItem)) {
            Object.assign(newNode, layoutItem);
            Object.keys(newNode)
                .filter(function (option) { return !inArray(option, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ]); })
                .forEach(function (option) {
                newNode.options[option] = newNode[option];
                delete newNode[option];
            });
            if (!hasOwn(newNode, 'type') && isString(newNode.widget)) {
                newNode.type = newNode.widget;
                delete newNode.widget;
            }
            if (!hasOwn(newNode.options, 'title')) {
                if (hasOwn(newNode.options, 'legend')) {
                    newNode.options.title = newNode.options.legend;
                    delete newNode.options.legend;
                }
            }
            if (!hasOwn(newNode.options, 'validationMessages')) {
                if (hasOwn(newNode.options, 'errorMessages')) {
                    newNode.options.validationMessages = newNode.options.errorMessages;
                    delete newNode.options.errorMessages;
                }
                else if (hasOwn(newNode.options, 'validationMessage')) {
                    if (typeof newNode.options.validationMessage === 'string') {
                        newNode.options.validationMessages = newNode.options.validationMessage;
                    }
                    else {
                        newNode.options.validationMessages = {};
                        Object.keys(newNode.options.validationMessage).forEach(function (key) {
                            var code = key + '';
                            var newKey = code === '0' ? 'type' :
                                code === '1' ? 'enum' :
                                    code === '100' ? 'multipleOf' :
                                        code === '101' ? 'minimum' :
                                            code === '102' ? 'exclusiveMinimum' :
                                                code === '103' ? 'maximum' :
                                                    code === '104' ? 'exclusiveMaximum' :
                                                        code === '200' ? 'minLength' :
                                                            code === '201' ? 'maxLength' :
                                                                code === '202' ? 'pattern' :
                                                                    code === '300' ? 'minProperties' :
                                                                        code === '301' ? 'maxProperties' :
                                                                            code === '302' ? 'required' :
                                                                                code === '304' ? 'dependencies' :
                                                                                    code === '400' ? 'minItems' :
                                                                                        code === '401' ? 'maxItems' :
                                                                                            code === '402' ? 'uniqueItems' :
                                                                                                code === '500' ? 'format' : code + '';
                            newNode.options.validationMessages[newKey] = newNode.options.validationMessage[key];
                        });
                    }
                    delete newNode.options.validationMessage;
                }
            }
        }
        else if (JsonPointer.isJsonPointer(layoutItem)) {
            newNode.dataPointer = layoutItem;
        }
        else if (isString(layoutItem)) {
            newNode.key = layoutItem;
        }
        else {
            console.error('buildLayout error: Form layout element not recognized:');
            console.error(layoutItem);
            return null;
        }
        var nodeSchema = null;
        if (!hasOwn(newNode, 'dataPointer')) {
            if (hasOwn(newNode, 'key')) {
                newNode.dataPointer = newNode.key === '*' ? newNode.key :
                    JsonPointer.compile(JsonPointer.parseObjectPath(newNode.key), '-');
                delete newNode.key;
            }
            else if (hasOwn(newNode, 'type') && newNode.type.slice(-5) === 'array') {
                var findDataPointer_1 = function (items) {
                    if (items === null || typeof items !== 'object') {
                        return;
                    }
                    if (hasOwn(items, 'dataPointer')) {
                        return items.dataPointer;
                    }
                    if (isArray(items.items)) {
                        for (var _i = 0, _a = items.items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (hasOwn(item, 'dataPointer') && item.dataPointer.indexOf('/-') !== -1) {
                                return item.dataPointer;
                            }
                            if (hasOwn(item, 'items')) {
                                var searchItem = findDataPointer_1(item);
                                if (searchItem) {
                                    return searchItem;
                                }
                            }
                        }
                    }
                };
                var childDataPointer = findDataPointer_1(newNode);
                if (childDataPointer) {
                    newNode.dataPointer =
                        childDataPointer.slice(0, childDataPointer.lastIndexOf('/-'));
                }
            }
        }
        if (hasOwn(newNode, 'dataPointer')) {
            if (newNode.dataPointer === '*') {
                return buildLayoutFromSchema(jsf, widgetLibrary, jsf.formValues);
            }
            var nodeValue = JsonPointer.get(jsf.formValues, newNode.dataPointer.replace(/\/-/g, '/1'));
            newNode.dataPointer =
                JsonPointer.toGenericPointer(newNode.dataPointer, jsf.arrayMap);
            var LastKey = JsonPointer.toKey(newNode.dataPointer);
            if (!newNode.name && isString(LastKey) && LastKey !== '-') {
                newNode.name = LastKey;
            }
            var shortDataPointer = removeRecursiveReferences(newNode.dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
            var recursive_1 = !shortDataPointer.length ||
                shortDataPointer !== newNode.dataPointer;
            var schemaPointer = void 0;
            if (!jsf.dataMap.has(shortDataPointer)) {
                jsf.dataMap.set(shortDataPointer, new Map());
            }
            var nodeDataMap = jsf.dataMap.get(shortDataPointer);
            if (nodeDataMap.has('schemaPointer')) {
                schemaPointer = nodeDataMap.get('schemaPointer');
            }
            else {
                schemaPointer = JsonPointer.toSchemaPointer(shortDataPointer, jsf.schema);
                nodeDataMap.set('schemaPointer', schemaPointer);
            }
            nodeDataMap.set('disabled', !!newNode.options.disabled);
            nodeSchema = JsonPointer.get(jsf.schema, schemaPointer);
            if (nodeSchema) {
                if (!hasOwn(newNode, 'type')) {
                    newNode.type = getInputType(nodeSchema, newNode);
                }
                else if (!widgetLibrary.hasWidget(newNode.type)) {
                    var oldWidgetType = newNode.type;
                    newNode.type = getInputType(nodeSchema, newNode);
                    console.error("error: widget type \"" + oldWidgetType + "\" " +
                        ("not found in library. Replacing with \"" + newNode.type + "\"."));
                }
                else {
                    newNode.type = checkInlineType(newNode.type, nodeSchema, newNode);
                }
                if (nodeSchema.type === 'object' && isArray(nodeSchema.required)) {
                    nodeDataMap.set('required', nodeSchema.required);
                }
                newNode.dataType =
                    nodeSchema.type || (hasOwn(nodeSchema, '$ref') ? '$ref' : null);
                updateInputOptions(newNode, nodeSchema, jsf);
                if (newNode.type === 'checkboxes' && hasOwn(nodeSchema, 'items')) {
                    updateInputOptions(newNode, nodeSchema.items, jsf);
                }
                else if (newNode.dataType === 'array') {
                    newNode.options.maxItems = Math.min(nodeSchema.maxItems || 1000, newNode.options.maxItems || 1000);
                    newNode.options.minItems = Math.max(nodeSchema.minItems || 0, newNode.options.minItems || 0);
                    newNode.options.listItems = Math.max(newNode.options.listItems || 0, isArray(nodeValue) ? nodeValue.length : 0);
                    newNode.options.tupleItems =
                        isArray(nodeSchema.items) ? nodeSchema.items.length : 0;
                    if (newNode.options.maxItems < newNode.options.tupleItems) {
                        newNode.options.tupleItems = newNode.options.maxItems;
                        newNode.options.listItems = 0;
                    }
                    else if (newNode.options.maxItems <
                        newNode.options.tupleItems + newNode.options.listItems) {
                        newNode.options.listItems =
                            newNode.options.maxItems - newNode.options.tupleItems;
                    }
                    else if (newNode.options.minItems >
                        newNode.options.tupleItems + newNode.options.listItems) {
                        newNode.options.listItems =
                            newNode.options.minItems - newNode.options.tupleItems;
                    }
                    if (!nodeDataMap.has('maxItems')) {
                        nodeDataMap.set('maxItems', newNode.options.maxItems);
                        nodeDataMap.set('minItems', newNode.options.minItems);
                        nodeDataMap.set('tupleItems', newNode.options.tupleItems);
                        nodeDataMap.set('listItems', newNode.options.listItems);
                    }
                    if (!jsf.arrayMap.has(shortDataPointer)) {
                        jsf.arrayMap.set(shortDataPointer, newNode.options.tupleItems);
                    }
                }
                if (isInputRequired(jsf.schema, schemaPointer)) {
                    newNode.options.required = true;
                    jsf.fieldsRequired = true;
                }
            }
            else {
                updateInputOptions(newNode, {}, jsf);
            }
            if (!newNode.options.title && !/^\d+$/.test(newNode.name)) {
                newNode.options.title = fixTitle(newNode.name);
            }
            if (hasOwn(newNode.options, 'copyValueTo')) {
                if (typeof newNode.options.copyValueTo === 'string') {
                    newNode.options.copyValueTo = [newNode.options.copyValueTo];
                }
                if (isArray(newNode.options.copyValueTo)) {
                    newNode.options.copyValueTo = newNode.options.copyValueTo.map(function (item) {
                        return JsonPointer.compile(JsonPointer.parseObjectPath(item), '-');
                    });
                }
            }
            newNode.widget = widgetLibrary.getWidget(newNode.type);
            nodeDataMap.set('inputType', newNode.type);
            nodeDataMap.set('widget', newNode.widget);
            if (newNode.dataType === 'array' &&
                (hasOwn(newNode, 'items') || hasOwn(newNode, 'additionalItems'))) {
                var itemRefPointer_1 = removeRecursiveReferences(newNode.dataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                if (!jsf.dataMap.has(itemRefPointer_1)) {
                    jsf.dataMap.set(itemRefPointer_1, new Map());
                }
                jsf.dataMap.get(itemRefPointer_1).set('inputType', 'section');
                if (newNode.items.length > 1) {
                    var arrayItemGroup = [];
                    for (var i = newNode.items.length - 1; i >= 0; i--) {
                        var subItem = newNode.items[i];
                        if (hasOwn(subItem, 'dataPointer') &&
                            subItem.dataPointer.slice(0, itemRefPointer_1.length) === itemRefPointer_1) {
                            var arrayItem = newNode.items.splice(i, 1)[0];
                            arrayItem.dataPointer = newNode.dataPointer + '/-' +
                                arrayItem.dataPointer.slice(itemRefPointer_1.length);
                            arrayItemGroup.unshift(arrayItem);
                            
                        }
                        else {
                            subItem.arrayItem = true;
                            subItem.arrayItemType = 'list';
                            subItem.removable = newNode.options.removable !== false;
                        }
                    }
                    if (arrayItemGroup.length) {
                        newNode.items.push({
                            _id: _.uniqueId(),
                            arrayItem: true,
                            arrayItemType: newNode.options.tupleItems > newNode.items.length ?
                                'tuple' : 'list',
                            items: arrayItemGroup,
                            options: { removable: newNode.options.removable !== false, },
                            dataPointer: newNode.dataPointer + '/-',
                            type: 'section',
                            widget: widgetLibrary.getWidget('section'),
                        });
                    }
                }
                else {
                    newNode.items[0].arrayItem = true;
                    if (!newNode.items[0].dataPointer) {
                        newNode.items[0].dataPointer =
                            JsonPointer.toGenericPointer(itemRefPointer_1, jsf.arrayMap);
                    }
                    if (!JsonPointer.has(newNode, '/items/0/options/removable')) {
                        newNode.items[0].options.removable = true;
                    }
                    if (newNode.options.orderable === false) {
                        newNode.items[0].options.orderable = false;
                    }
                    newNode.items[0].arrayItemType =
                        newNode.options.tupleItems ? 'tuple' : 'list';
                }
                if (isArray(newNode.items)) {
                    var arrayListItems = newNode.items.filter(function (item) { return item.type !== '$ref'; }).length -
                        newNode.options.tupleItems;
                    if (arrayListItems > newNode.options.listItems) {
                        newNode.options.listItems = arrayListItems;
                        nodeDataMap.set('listItems', arrayListItems);
                    }
                }
                if (!hasOwn(jsf.layoutRefLibrary, itemRefPointer_1)) {
                    jsf.layoutRefLibrary[itemRefPointer_1] =
                        _.cloneDeep(newNode.items[newNode.items.length - 1]);
                    if (recursive_1) {
                        jsf.layoutRefLibrary[itemRefPointer_1].recursiveReference = true;
                    }
                    forEach(jsf.layoutRefLibrary[itemRefPointer_1], function (item, key) {
                        if (hasOwn(item, '_id')) {
                            item._id = null;
                        }
                        if (recursive_1) {
                            if (hasOwn(item, 'dataPointer')) {
                                item.dataPointer = item.dataPointer.slice(itemRefPointer_1.length);
                            }
                        }
                    }, 'top-down');
                }
                if (!newNode.recursiveReference || newNode.options.required) {
                    var arrayLength = Math.min(Math.max(newNode.options.tupleItems + newNode.options.listItems, isArray(nodeValue) ? nodeValue.length : 0), newNode.options.maxItems);
                    for (var i = newNode.items.length; i < arrayLength; i++) {
                        newNode.items.push(getLayoutNode({
                            $ref: itemRefPointer_1,
                            dataPointer: newNode.dataPointer,
                            recursiveReference: newNode.recursiveReference,
                        }, jsf, widgetLibrary));
                    }
                }
                if (newNode.options.addable !== false &&
                    newNode.options.minItems < newNode.options.maxItems &&
                    (newNode.items[newNode.items.length - 1] || {}).type !== '$ref') {
                    var buttonText = 'Add';
                    if (newNode.options.title) {
                        if (/^add\b/i.test(newNode.options.title)) {
                            buttonText = newNode.options.title;
                        }
                        else {
                            buttonText += ' ' + newNode.options.title;
                        }
                    }
                    else if (newNode.name && !/^\d+$/.test(newNode.name)) {
                        if (/^add\b/i.test(newNode.name)) {
                            buttonText += ' ' + fixTitle(newNode.name);
                        }
                        else {
                            buttonText = fixTitle(newNode.name);
                        }
                    }
                    else {
                        var parentSchema = getFromSchema(jsf.schema, newNode.dataPointer, 'parentSchema');
                        if (hasOwn(parentSchema, 'title')) {
                            buttonText += ' to ' + parentSchema.title;
                        }
                        else {
                            var pointerArray = JsonPointer.parse(newNode.dataPointer);
                            buttonText += ' to ' + fixTitle(pointerArray[pointerArray.length - 2]);
                        }
                    }
                    newNode.items.push({
                        _id: _.uniqueId(),
                        arrayItem: true,
                        arrayItemType: 'list',
                        dataPointer: newNode.dataPointer + '/-',
                        options: {
                            listItems: newNode.options.listItems,
                            maxItems: newNode.options.maxItems,
                            minItems: newNode.options.minItems,
                            removable: false,
                            title: buttonText,
                            tupleItems: newNode.options.tupleItems,
                        },
                        recursiveReference: recursive_1,
                        type: '$ref',
                        widget: widgetLibrary.getWidget('$ref'),
                        $ref: itemRefPointer_1,
                    });
                    if (isString(JsonPointer.get(newNode, '/style/add'))) {
                        newNode.items[newNode.items.length - 1].options.fieldStyle =
                            newNode.style.add;
                        delete newNode.style.add;
                        if (isEmpty(newNode.style)) {
                            delete newNode.style;
                        }
                    }
                }
            }
            else {
                newNode.arrayItem = false;
            }
        }
        else if (hasOwn(newNode, 'type') || hasOwn(newNode, 'items')) {
            var parentType = JsonPointer.get(jsf.layout, layoutPointer, 0, -2).type;
            if (!hasOwn(newNode, 'type')) {
                newNode.type =
                    inArray(parentType, ['tabs', 'tabarray']) ? 'tab' : 'array';
            }
            newNode.arrayItem = parentType === 'array';
            newNode.widget = widgetLibrary.getWidget(newNode.type);
            updateInputOptions(newNode, {}, jsf);
        }
        if (newNode.type === 'submit') {
            hasSubmitButton = true;
        }
        return newNode;
    });
    if (jsf.hasRootReference) {
        var fullLayout = _.cloneDeep(formLayout);
        if (fullLayout[fullLayout.length - 1].type === 'submit') {
            fullLayout.pop();
        }
        jsf.layoutRefLibrary[''] = {
            _id: null,
            dataPointer: '',
            dataType: 'object',
            items: fullLayout,
            name: '',
            options: _.cloneDeep(jsf.formOptions.defautWidgetOptions),
            recursiveReference: true,
            required: false,
            type: 'section',
            widget: widgetLibrary.getWidget('section'),
        };
    }
    if (!hasSubmitButton) {
        formLayout.push({
            _id: _.uniqueId(),
            options: { title: 'Submit' },
            type: 'submit',
            widget: widgetLibrary.getWidget('submit'),
        });
    }
    return formLayout;
}
function buildLayoutFromSchema(jsf, widgetLibrary, nodeValue, schemaPointer, dataPointer, arrayItem, arrayItemType, removable, forRefLibrary, dataPointerPrefix) {
    if (nodeValue === void 0) { nodeValue = null; }
    if (schemaPointer === void 0) { schemaPointer = ''; }
    if (dataPointer === void 0) { dataPointer = ''; }
    if (arrayItem === void 0) { arrayItem = false; }
    if (arrayItemType === void 0) { arrayItemType = null; }
    if (removable === void 0) { removable = null; }
    if (forRefLibrary === void 0) { forRefLibrary = false; }
    if (dataPointerPrefix === void 0) { dataPointerPrefix = ''; }
    var schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (!hasOwn(schema, 'type') && !hasOwn(schema, '$ref') &&
        !hasOwn(schema, 'x-schema-form')) {
        return null;
    }
    var newNodeType = getInputType(schema);
    if (!isDefined(nodeValue) && (jsf.formOptions.setSchemaDefaults === true ||
        (jsf.formOptions.setSchemaDefaults === 'auto' && isEmpty(jsf.formValues)))) {
        nodeValue = JsonPointer.get(jsf.schema, schemaPointer + '/default');
    }
    var newNode = {
        _id: forRefLibrary ? null : _.uniqueId(),
        arrayItem: arrayItem,
        dataPointer: JsonPointer.toGenericPointer(dataPointer, jsf.arrayMap),
        dataType: schema.type || (hasOwn(schema, '$ref') ? '$ref' : null),
        options: {},
        required: isInputRequired(jsf.schema, schemaPointer),
        type: newNodeType,
        widget: widgetLibrary.getWidget(newNodeType),
    };
    var lastDataKey = JsonPointer.toKey(newNode.dataPointer);
    if (lastDataKey !== '-') {
        newNode.name = lastDataKey;
    }
    if (newNode.arrayItem) {
        newNode.arrayItemType = arrayItemType;
        newNode.options.removable = removable !== false;
    }
    var shortDataPointer = removeRecursiveReferences(dataPointerPrefix + dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    var recursive = !shortDataPointer.length ||
        shortDataPointer !== dataPointerPrefix + dataPointer;
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    var nodeDataMap = jsf.dataMap.get(shortDataPointer);
    if (!nodeDataMap.has('inputType')) {
        nodeDataMap.set('schemaPointer', schemaPointer);
        nodeDataMap.set('inputType', newNode.type);
        nodeDataMap.set('widget', newNode.widget);
        nodeDataMap.set('disabled', !!newNode.options.disabled);
    }
    updateInputOptions(newNode, schema, jsf);
    if (!newNode.options.title && newNode.name && !/^\d+$/.test(newNode.name)) {
        newNode.options.title = fixTitle(newNode.name);
    }
    if (newNode.dataType === 'object') {
        if (isArray(schema.required) && !nodeDataMap.has('required')) {
            nodeDataMap.set('required', schema.required);
        }
        if (isObject(schema.properties)) {
            var newSection_1 = [];
            var propertyKeys_1 = schema['ui:order'] || Object.keys(schema.properties);
            if (propertyKeys_1.includes('*') && !hasOwn(schema.properties, '*')) {
                var unnamedKeys = Object.keys(schema.properties)
                    .filter(function (key) { return !propertyKeys_1.includes(key); });
                for (var i = propertyKeys_1.length - 1; i >= 0; i--) {
                    if (propertyKeys_1[i] === '*') {
                        propertyKeys_1.splice.apply(propertyKeys_1, [i, 1].concat(unnamedKeys));
                    }
                }
            }
            propertyKeys_1
                .filter(function (key) { return hasOwn(schema.properties, key) ||
                hasOwn(schema, 'additionalProperties'); })
                .forEach(function (key) {
                var keySchemaPointer = hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties';
                var innerItem = buildLayoutFromSchema(jsf, widgetLibrary, isObject(nodeValue) ? nodeValue[key] : null, schemaPointer + keySchemaPointer, dataPointer + '/' + key, false, null, null, forRefLibrary, dataPointerPrefix);
                if (innerItem) {
                    if (isInputRequired(schema, '/' + key)) {
                        innerItem.options.required = true;
                        jsf.fieldsRequired = true;
                    }
                    newSection_1.push(innerItem);
                }
            });
            if (dataPointer === '' && !forRefLibrary) {
                newNode = newSection_1;
            }
            else {
                newNode.items = newSection_1;
            }
        }
    }
    else if (newNode.dataType === 'array') {
        newNode.items = [];
        newNode.options.maxItems = Math.min(schema.maxItems || 1000, newNode.options.maxItems || 1000);
        newNode.options.minItems = Math.max(schema.minItems || 0, newNode.options.minItems || 0);
        if (!newNode.options.minItems && isInputRequired(jsf.schema, schemaPointer)) {
            newNode.options.minItems = 1;
        }
        if (!hasOwn(newNode.options, 'listItems')) {
            newNode.options.listItems = 1;
        }
        newNode.options.tupleItems = isArray(schema.items) ? schema.items.length : 0;
        if (newNode.options.maxItems <= newNode.options.tupleItems) {
            newNode.options.tupleItems = newNode.options.maxItems;
            newNode.options.listItems = 0;
        }
        else if (newNode.options.maxItems <
            newNode.options.tupleItems + newNode.options.listItems) {
            newNode.options.listItems = newNode.options.maxItems - newNode.options.tupleItems;
        }
        else if (newNode.options.minItems >
            newNode.options.tupleItems + newNode.options.listItems) {
            newNode.options.listItems = newNode.options.minItems - newNode.options.tupleItems;
        }
        if (!nodeDataMap.has('maxItems')) {
            nodeDataMap.set('maxItems', newNode.options.maxItems);
            nodeDataMap.set('minItems', newNode.options.minItems);
            nodeDataMap.set('tupleItems', newNode.options.tupleItems);
            nodeDataMap.set('listItems', newNode.options.listItems);
        }
        if (!jsf.arrayMap.has(shortDataPointer)) {
            jsf.arrayMap.set(shortDataPointer, newNode.options.tupleItems);
        }
        removable = newNode.options.removable !== false;
        var additionalItemsSchemaPointer = null;
        if (isArray(schema.items)) {
            newNode.items = [];
            for (var i = 0; i < newNode.options.tupleItems; i++) {
                var newItem = void 0;
                var itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                var itemRecursive = !itemRefPointer.length ||
                    itemRefPointer !== shortDataPointer + '/' + i;
                if (removable && i >= newNode.options.minItems) {
                    if (!hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                        jsf.layoutRefLibrary[itemRefPointer] = null;
                        jsf.layoutRefLibrary[itemRefPointer] = buildLayoutFromSchema(jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null, schemaPointer + '/items/' + i, itemRecursive ? '' : dataPointer + '/' + i, true, 'tuple', true, true, itemRecursive ? dataPointer + '/' + i : '');
                        if (itemRecursive) {
                            jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                        }
                    }
                    newItem = getLayoutNode({
                        $ref: itemRefPointer,
                        dataPointer: dataPointer + '/' + i,
                        recursiveReference: itemRecursive,
                    }, jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null);
                }
                else {
                    newItem = buildLayoutFromSchema(jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null, schemaPointer + '/items/' + i, dataPointer + '/' + i, true, 'tuple', false, forRefLibrary, dataPointerPrefix);
                }
                if (newItem) {
                    newNode.items.push(newItem);
                }
            }
            if (isObject(schema.additionalItems)) {
                additionalItemsSchemaPointer = schemaPointer + '/additionalItems';
            }
        }
        else if (isObject(schema.items)) {
            additionalItemsSchemaPointer = schemaPointer + '/items';
        }
        if (additionalItemsSchemaPointer) {
            var itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
            var itemRecursive = !itemRefPointer.length ||
                itemRefPointer !== shortDataPointer + '/-';
            var itemSchemaPointer = removeRecursiveReferences(additionalItemsSchemaPointer, jsf.schemaRecursiveRefMap, jsf.arrayMap);
            if (itemRefPointer.length && !hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                jsf.layoutRefLibrary[itemRefPointer] = null;
                jsf.layoutRefLibrary[itemRefPointer] = buildLayoutFromSchema(jsf, widgetLibrary, null, itemSchemaPointer, itemRecursive ? '' : dataPointer + '/-', true, 'list', removable, true, itemRecursive ? dataPointer + '/-' : '');
                if (itemRecursive) {
                    jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                }
            }
            if (!itemRecursive || newNode.options.required) {
                var arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                    newNode.options.tupleItems + newNode.options.listItems, isArray(nodeValue) ? nodeValue.length : 0), newNode.options.maxItems);
                if (newNode.items.length < arrayLength) {
                    for (var i = newNode.items.length; i < arrayLength; i++) {
                        newNode.items.push(getLayoutNode({
                            $ref: itemRefPointer,
                            dataPointer: dataPointer + '/-',
                            recursiveReference: itemRecursive,
                        }, jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null));
                    }
                }
            }
            if (newNode.options.addable !== false &&
                newNode.options.minItems < newNode.options.maxItems &&
                (newNode.items[newNode.items.length - 1] || {}).type !== '$ref') {
                var buttonText = ((jsf.layoutRefLibrary[itemRefPointer] || {}).options || {}).title;
                var prefix = buttonText ? 'Add ' : 'Add to ';
                if (!buttonText) {
                    buttonText = schema.title || fixTitle(JsonPointer.toKey(dataPointer));
                }
                if (!/^add\b/i.test(buttonText)) {
                    buttonText = prefix + buttonText;
                }
                newNode.items.push({
                    _id: _.uniqueId(),
                    arrayItem: true,
                    arrayItemType: 'list',
                    dataPointer: newNode.dataPointer + '/-',
                    options: {
                        listItems: newNode.options.listItems,
                        maxItems: newNode.options.maxItems,
                        minItems: newNode.options.minItems,
                        removable: false,
                        title: buttonText,
                        tupleItems: newNode.options.tupleItems,
                    },
                    recursiveReference: itemRecursive,
                    type: '$ref',
                    widget: widgetLibrary.getWidget('$ref'),
                    $ref: itemRefPointer,
                });
            }
        }
    }
    else if (newNode.dataType === '$ref') {
        var schemaRef = JsonPointer.compile(schema.$ref);
        var dataRef = JsonPointer.toDataPointer(schemaRef, jsf.schema);
        var buttonText = '';
        if (newNode.options.add) {
            buttonText = newNode.options.add;
        }
        else if (newNode.name && !/^\d+$/.test(newNode.name)) {
            buttonText =
                (/^add\b/i.test(newNode.name) ? '' : 'Add ') + fixTitle(newNode.name);
        }
        else {
            var parentSchema = JsonPointer.get(jsf.schema, schemaPointer, 0, -1);
            if (hasOwn(parentSchema, 'title')) {
                buttonText = 'Add to ' + parentSchema.title;
            }
            else {
                var pointerArray = JsonPointer.parse(newNode.dataPointer);
                buttonText = 'Add to ' + fixTitle(pointerArray[pointerArray.length - 2]);
            }
        }
        Object.assign(newNode, {
            recursiveReference: true,
            widget: widgetLibrary.getWidget('$ref'),
            $ref: dataRef,
        });
        Object.assign(newNode.options, {
            removable: false,
            title: buttonText,
        });
        if (isNumber(JsonPointer.get(jsf.schema, schemaPointer, 0, -1).maxItems)) {
            newNode.options.maxItems =
                JsonPointer.get(jsf.schema, schemaPointer, 0, -1).maxItems;
        }
        if (dataRef.length) {
            if (!hasOwn(jsf.layoutRefLibrary, dataRef)) {
                jsf.layoutRefLibrary[dataRef] = null;
                var newLayout = buildLayoutFromSchema(jsf, widgetLibrary, null, schemaRef, '', newNode.arrayItem, newNode.arrayItemType, true, true, dataPointer);
                if (newLayout) {
                    newLayout.recursiveReference = true;
                    jsf.layoutRefLibrary[dataRef] = newLayout;
                }
                else {
                    delete jsf.layoutRefLibrary[dataRef];
                }
            }
            else if (!jsf.layoutRefLibrary[dataRef].recursiveReference) {
                jsf.layoutRefLibrary[dataRef].recursiveReference = true;
            }
        }
    }
    return newNode;
}
function mapLayout(layout, fn, layoutPointer, rootLayout) {
    if (layoutPointer === void 0) { layoutPointer = ''; }
    if (rootLayout === void 0) { rootLayout = layout; }
    var indexPad = 0;
    var newLayout = [];
    forEach(layout, function (item, index) {
        var realIndex = +index + indexPad;
        var newLayoutPointer = layoutPointer + '/' + realIndex;
        var newNode = copy(item);
        var itemsArray = [];
        if (isObject(item)) {
            if (hasOwn(item, 'tabs')) {
                item.items = item.tabs;
                delete item.tabs;
            }
            if (hasOwn(item, 'items')) {
                itemsArray = isArray(item.items) ? item.items : [item.items];
            }
        }
        if (itemsArray.length) {
            newNode.items = mapLayout(itemsArray, fn, newLayoutPointer + '/items', rootLayout);
        }
        newNode = fn(newNode, realIndex, newLayoutPointer, rootLayout);
        if (!isDefined(newNode)) {
            indexPad--;
        }
        else {
            if (isArray(newNode)) {
                indexPad += newNode.length - 1;
            }
            newLayout = newLayout.concat(newNode);
        }
    });
    return newLayout;
}

function getLayoutNode(refNode, jsf, widgetLibrary, nodeValue) {
    if (widgetLibrary === void 0) { widgetLibrary = null; }
    if (nodeValue === void 0) { nodeValue = null; }
    if (refNode.recursiveReference && widgetLibrary) {
        var newLayoutNode = _.cloneDeep(refNode);
        if (!newLayoutNode.options) {
            newLayoutNode.options = {};
        }
        Object.assign(newLayoutNode, {
            recursiveReference: true,
            widget: widgetLibrary.getWidget('$ref'),
        });
        Object.assign(newLayoutNode.options, {
            removable: false,
            title: 'Add ' + newLayoutNode.$ref,
        });
        return newLayoutNode;
    }
    else {
        var newLayoutNode = jsf.layoutRefLibrary[refNode.$ref];
        if (isDefined(nodeValue)) {
            newLayoutNode = buildLayoutFromSchema(jsf, widgetLibrary, nodeValue, JsonPointer.toSchemaPointer(refNode.$ref, jsf.schema), refNode.$ref, newLayoutNode.arrayItem, newLayoutNode.arrayItemType, newLayoutNode.options.removable, false);
        }
        else {
            newLayoutNode = _.cloneDeep(newLayoutNode);
            JsonPointer.forEachDeep(newLayoutNode, function (subNode, pointer) {
                if (hasOwn(subNode, '_id')) {
                    subNode._id = _.uniqueId();
                }
                if (refNode.recursiveReference && hasOwn(subNode, 'dataPointer')) {
                    subNode.dataPointer = refNode.dataPointer + subNode.dataPointer;
                }
            });
        }
        return newLayoutNode;
    }
}
function buildTitleMap(titleMap, enumList, fieldRequired, flatList) {
    if (fieldRequired === void 0) { fieldRequired = true; }
    if (flatList === void 0) { flatList = true; }
    var newTitleMap = [];
    var hasEmptyValue = false;
    if (titleMap) {
        if (isArray(titleMap)) {
            if (enumList) {
                for (var _i = 0, _a = Object.keys(titleMap); _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (isObject(titleMap[i])) {
                        var value = titleMap[i].value;
                        if (enumList.includes(value)) {
                            var name_1 = titleMap[i].name;
                            newTitleMap.push({ name: name_1, value: value });
                            if (value === undefined || value === null) {
                                hasEmptyValue = true;
                            }
                        }
                    }
                    else if (isString(titleMap[i])) {
                        if (i < enumList.length) {
                            var name_2 = titleMap[i];
                            var value = enumList[i];
                            newTitleMap.push({ name: name_2, value: value });
                            if (value === undefined || value === null) {
                                hasEmptyValue = true;
                            }
                        }
                    }
                }
            }
            else {
                newTitleMap = titleMap;
                if (!fieldRequired) {
                    hasEmptyValue = !!newTitleMap
                        .filter(function (i) { return i.value === undefined || i.value === null; })
                        .length;
                }
            }
        }
        else if (enumList) {
            for (var _b = 0, _c = Object.keys(enumList); _b < _c.length; _b++) {
                var i = _c[_b];
                var value = enumList[i];
                if (hasOwn(titleMap, value)) {
                    var name_3 = titleMap[value];
                    newTitleMap.push({ name: name_3, value: value });
                    if (value === undefined || value === null) {
                        hasEmptyValue = true;
                    }
                }
            }
        }
        else {
            for (var _d = 0, _e = Object.keys(titleMap); _d < _e.length; _d++) {
                var value = _e[_d];
                var name_4 = titleMap[value];
                newTitleMap.push({ name: name_4, value: value });
                if (value === undefined || value === null) {
                    hasEmptyValue = true;
                }
            }
        }
    }
    else if (enumList) {
        for (var _f = 0, _g = Object.keys(enumList); _f < _g.length; _f++) {
            var i = _g[_f];
            var name_5 = enumList[i];
            var value = enumList[i];
            newTitleMap.push({ name: name_5, value: value });
            if (value === undefined || value === null) {
                hasEmptyValue = true;
            }
        }
    }
    else {
        newTitleMap = [{ name: 'True', value: true }, { name: 'False', value: false }];
    }
    if (newTitleMap.some(function (title) { return hasOwn(title, 'group'); })) {
        hasEmptyValue = false;
        if (flatList) {
            newTitleMap = newTitleMap.reduce(function (groupTitleMap, title) {
                if (hasOwn(title, 'group')) {
                    if (isArray(title.items)) {
                        groupTitleMap = groupTitleMap.concat(title.items.map(function (item) {
                            return (__assign$7({}, item, { name: title.group + ": " + item.name }));
                        }));
                        if (title.items.some(function (item) { return item.value === undefined || item.value === null; })) {
                            hasEmptyValue = true;
                        }
                    }
                    if (hasOwn(title, 'name') && hasOwn(title, 'value')) {
                        title.name = title.group + ": " + title.name;
                        delete title.group;
                        groupTitleMap.push(title);
                        if (title.value === undefined || title.value === null) {
                            hasEmptyValue = true;
                        }
                    }
                }
                else {
                    groupTitleMap.push(title);
                    if (title.value === undefined || title.value === null) {
                        hasEmptyValue = true;
                    }
                }
                return groupTitleMap;
            }, []);
        }
        else {
            newTitleMap = newTitleMap.reduce(function (groupTitleMap, title) {
                if (hasOwn(title, 'group')) {
                    if (title.group !== (groupTitleMap[groupTitleMap.length - 1] || {}).group) {
                        groupTitleMap.push({ group: title.group, items: title.items || [] });
                    }
                    if (hasOwn(title, 'name') && hasOwn(title, 'value')) {
                        groupTitleMap[groupTitleMap.length - 1].items
                            .push({ name: title.name, value: title.value });
                        if (title.value === undefined || title.value === null) {
                            hasEmptyValue = true;
                        }
                    }
                }
                else {
                    groupTitleMap.push(title);
                    if (title.value === undefined || title.value === null) {
                        hasEmptyValue = true;
                    }
                }
                return groupTitleMap;
            }, []);
        }
    }
    if (!fieldRequired && !hasEmptyValue) {
        newTitleMap.unshift({ name: '<em>None</em>', value: null });
    }
    return newTitleMap;
}

function dateToString(date, options) {
    if (options === void 0) { options = {}; }
    var dateFormat = options.dateFormat || 'YYYY-MM-DD';
    if (typeof date === 'string') {
        date = stringToDate(date);
    }
    if (Object.prototype.toString.call(date) !== '[object Date]') {
        return null;
    }
    var longMonths = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dateFormat
        .replace(/YYYY/ig, date.getFullYear() + '')
        .replace(/YY/ig, (date.getFullYear() + '').slice(-2))
        .replace(/MMMM/ig, longMonths[date.getMonth()])
        .replace(/MMM/ig, shortMonths[date.getMonth()])
        .replace(/MM/ig, ('0' + (date.getMonth() + 1)).slice(-2))
        .replace(/M/ig, (date.getMonth() + 1) + '')
        .replace(/DDDD/ig, longDays[date.getDay()])
        .replace(/DDD/ig, shortDays[date.getDay()])
        .replace(/DD/ig, ('0' + date.getDate()).slice(-2))
        .replace(/D/ig, date.getDate() + '')
        .replace(/S/ig, ordinal(date.getDate()));
}
function ordinal(number) {
    if (typeof number === 'number') {
        number = number + '';
    }
    var last = number.slice(-1);
    var nextToLast = number.slice(-2, 1);
    return (nextToLast !== '1' && { '1': 'st', '2': 'nd', '3': 'rd' }[last]) || 'th';
}
function stringToDate(dateString) {
    var getDate = findDate(dateString);
    if (!getDate) {
        return null;
    }
    var dateParts = [];
    if (/^\d+[^\d]\d+[^\d]\d+$/.test(getDate)) {
        dateParts = getDate.split(/[^\d]/).map(function (part) { return +part; });
    }
    else if (/^\d{8}$/.test(getDate)) {
        dateParts = [+getDate.slice(0, 4), +getDate.slice(4, 6), +getDate.slice(6)];
    }
    var thisYear = +(new Date().getFullYear() + '').slice(-2);
    if (dateParts[0] > 1000 && dateParts[0] < 2100 && dateParts[1] <= 12 && dateParts[2] <= 31) {
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    }
    else if (dateParts[0] <= 12 && dateParts[1] <= 31 && dateParts[2] > 1000 && dateParts[2] < 2100) {
        return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    }
    else if (dateParts[0] <= 12 && dateParts[1] <= 31 && dateParts[2] < 100) {
        var year = (dateParts[2] <= thisYear ? 2000 : 1900) + dateParts[2];
        return new Date(year, dateParts[0] - 1, dateParts[1]);
    }
    else if (dateParts[0] < 100 && dateParts[1] <= 12 && dateParts[2] <= 31) {
        var year = (dateParts[0] <= thisYear ? 2000 : 1900) + dateParts[0];
        return new Date(year, dateParts[1] - 1, dateParts[2]);
    }
    return null;
}
function findDate(text) {
    if (!text) {
        return null;
    }
    var foundDate;
    foundDate = text.match(/(?:19|20)\d\d[-_\\\/\. ](?:0?\d|1[012])[-_\\\/\. ](?:[012]?\d|3[01])(?!\d)/);
    if (foundDate) {
        return foundDate[0];
    }
    foundDate = text.match(/(?:[012]?\d|3[01])[-_\\\/\. ](?:0?\d|1[012])[-_\\\/\. ](?:19|20)\d\d(?!\d)/);
    if (foundDate) {
        return foundDate[0];
    }
    foundDate = text.match(/^(?:[012]?\d|3[01])[-_\\\/\. ](?:0?\d|1[012])[-_\\\/\. ]\d\d(?!\d)/);
    if (foundDate) {
        return foundDate[0];
    }
    foundDate = text.match(/^\d\d[-_\\\/\. ](?:[012]?\d|3[01])[-_\\\/\. ](?:0?\d|1[012])(?!\d)/);
    if (foundDate) {
        return foundDate[0];
    }
    foundDate = text.match(/^(?:19|20)\d\d(?:0\d|1[012])(?:[012]\d|3[01])/);
    if (foundDate) {
        return foundDate[0];
    }
}

var enValidationMessages = {
    required: 'This field is required.',
    minLength: 'Must be {{minimumLength}} characters or longer (current length: {{currentLength}})',
    maxLength: 'Must be {{maximumLength}} characters or shorter (current length: {{currentLength}})',
    pattern: 'Must match pattern: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return 'Must be a date, like "2000-12-31"';
            case 'time':
                return 'Must be a time, like "16:20" or "03:14:15.9265"';
            case 'date-time':
                return 'Must be a date-time, like "2000-03-14T01:59" or "2000-03-14T01:59:26.535Z"';
            case 'email':
                return 'Must be an email address, like "name@example.com"';
            case 'hostname':
                return 'Must be a hostname, like "example.com"';
            case 'ipv4':
                return 'Must be an IPv4 address, like "127.0.0.1"';
            case 'ipv6':
                return 'Must be an IPv6 address, like "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
            case 'url':
                return 'Must be a url, like "http://www.example.com/page.html"';
            case 'uuid':
                return 'Must be a uuid, like "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
            case 'color':
                return 'Must be a color, like "#FFFFFF" or "rgb(255, 255, 255)"';
            case 'json-pointer':
                return 'Must be a JSON Pointer, like "/pointer/to/something"';
            case 'relative-json-pointer':
                return 'Must be a relative JSON Pointer, like "2/pointer/to/something"';
            case 'regex':
                return 'Must be a regular expression, like "(1-)?\\d{3}-\\d{3}-\\d{4}"';
            default:
                return 'Must be a correctly formatted ' + error.requiredFormat;
        }
    },
    minimum: 'Must be {{minimumValue}} or more',
    exclusiveMinimum: 'Must be more than {{exclusiveMinimumValue}}',
    maximum: 'Must be {{maximumValue}} or less',
    exclusiveMaximum: 'Must be less than {{exclusiveMaximumValue}}',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            var decimals = Math.log10(1 / error.multipleOfValue);
            return "Must have " + decimals + " or fewer decimal places.";
        }
        else {
            return "Must be a multiple of " + error.multipleOfValue + ".";
        }
    },
    minProperties: 'Must have {{minimumProperties}} or more items (current items: {{currentProperties}})',
    maxProperties: 'Must have {{maximumProperties}} or fewer items (current items: {{currentProperties}})',
    minItems: 'Must have {{minimumItems}} or more items (current items: {{currentItems}})',
    maxItems: 'Must have {{maximumItems}} or fewer items (current items: {{currentItems}})',
    uniqueItems: 'All items must be unique',
};

var frValidationMessages = {
    required: 'Est obligatoire.',
    minLength: 'Doit avoir minimum {{minimumLength}} caractères (actuellement: {{currentLength}})',
    maxLength: 'Doit avoir maximum {{maximumLength}} caractères (actuellement: {{currentLength}})',
    pattern: 'Doit respecter: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return 'Doit être une date, tel que "2000-12-31"';
            case 'time':
                return 'Doit être une heure, tel que "16:20" ou "03:14:15.9265"';
            case 'date-time':
                return 'Doit être une date et une heure, tel que "2000-03-14T01:59" ou "2000-03-14T01:59:26.535Z"';
            case 'email':
                return 'Doit être une adresse e-mail, tel que "name@example.com"';
            case 'hostname':
                return 'Doit être un nom de domaine, tel que "example.com"';
            case 'ipv4':
                return 'Doit être une adresse IPv4, tel que "127.0.0.1"';
            case 'ipv6':
                return 'Doit être une adresse IPv6, tel que "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
            case 'url':
                return 'Doit être une URL, tel que "http://www.example.com/page.html"';
            case 'uuid':
                return 'Doit être un UUID, tel que "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
            case 'color':
                return 'Doit être une couleur, tel que "#FFFFFF" or "rgb(255, 255, 255)"';
            case 'json-pointer':
                return 'Doit être un JSON Pointer, tel que "/pointer/to/something"';
            case 'relative-json-pointer':
                return 'Doit être un relative JSON Pointer, tel que "2/pointer/to/something"';
            case 'regex':
                return 'Doit être une expression régulière, tel que "(1-)?\\d{3}-\\d{3}-\\d{4}"';
            default:
                return 'Doit être avoir le format correct: ' + error.requiredFormat;
        }
    },
    minimum: 'Doit être supérieur à {{minimumValue}}',
    exclusiveMinimum: 'Doit avoir minimum {{exclusiveMinimumValue}} charactères',
    maximum: 'Doit être inférieur à {{maximumValue}}',
    exclusiveMaximum: 'Doit avoir maximum {{exclusiveMaximumValue}} charactères',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            var decimals = Math.log10(1 / error.multipleOfValue);
            return "Doit comporter " + decimals + " ou moins de decimales.";
        }
        else {
            return "Doit \u00EAtre un multiple de " + error.multipleOfValue + ".";
        }
    },
    minProperties: 'Doit comporter au minimum {{minimumProperties}} éléments',
    maxProperties: 'Doit comporter au maximum {{maximumProperties}} éléments',
    minItems: 'Doit comporter au minimum {{minimumItems}} éléments',
    maxItems: 'Doit comporter au maximum {{minimumItems}} éléments',
    uniqueItems: 'Tous les éléments doivent être uniques',
};

var JsonSchemaFormService = (function () {
    function JsonSchemaFormService() {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.ajvOptions = { allErrors: true, jsonPointers: true, unknownFormats: 'ignore' };
        this.ajv = new Ajv(this.ajvOptions);
        this.validateFormData = null;
        this.formValues = {};
        this.data = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.validData = null;
        this.isValid = null;
        this.ajvErrors = null;
        this.validationErrors = null;
        this.dataErrors = new Map();
        this.formValueSubscription = null;
        this.dataChanges = new rxjs.Subject();
        this.isValidChanges = new rxjs.Subject();
        this.validationErrorChanges = new rxjs.Subject();
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.schemaRefLibrary = {};
        this.layoutRefLibrary = { '': null };
        this.templateRefLibrary = {};
        this.hasRootReference = false;
        this.language = 'en-US';
        this.defaultFormOptions = {
            addSubmit: 'auto',
            debug: false,
            disableInvalidSubmit: true,
            formDisabled: false,
            formReadonly: false,
            fieldsRequired: false,
            framework: 'no-framework',
            loadExternalAssets: false,
            pristine: { errors: true, success: true },
            supressPropertyTitles: false,
            setSchemaDefaults: 'auto',
            setLayoutDefaults: 'auto',
            validateOnRender: 'auto',
            widgets: {},
            defautWidgetOptions: {
                listItems: 1,
                addable: true,
                orderable: true,
                removable: true,
                enableErrorState: true,
                enableSuccessState: true,
                feedback: false,
                feedbackOnRender: false,
                notitle: false,
                disabled: false,
                readonly: false,
                returnEmptyFields: true,
                validationMessages: {}
            },
        };
        this.setLanguage(this.language);
    }
    JsonSchemaFormService.prototype.setLanguage = function (language) {
        if (language === void 0) { language = 'en-US'; }
        this.language = language;
        var validationMessages = language.slice(0, 2) === 'fr' ?
            frValidationMessages : enValidationMessages;
        this.defaultFormOptions.defautWidgetOptions.validationMessages =
            _.cloneDeep(validationMessages);
    };
    JsonSchemaFormService.prototype.getData = function () { return this.data; };
    JsonSchemaFormService.prototype.getSchema = function () { return this.schema; };
    JsonSchemaFormService.prototype.getLayout = function () { return this.layout; };
    JsonSchemaFormService.prototype.resetAllValues = function () {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.validateFormData = null;
        this.formValues = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.data = {};
        this.validData = null;
        this.isValid = null;
        this.validationErrors = null;
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.layoutRefLibrary = {};
        this.schemaRefLibrary = {};
        this.templateRefLibrary = {};
        this.formOptions = _.cloneDeep(this.defaultFormOptions);
    };
    JsonSchemaFormService.prototype.buildRemoteError = function (errors) {
        var _this = this;
        forEach(errors, function (value, key) {
            if (key in _this.formGroup.controls) {
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var error = value_1[_i];
                    var err = {};
                    err[error['code']] = error['message'];
                    _this.formGroup.get(key).setErrors(err, { emitEvent: true });
                }
            }
        });
    };
    JsonSchemaFormService.prototype.validateData = function (newValue, updateSubscriptions) {
        if (updateSubscriptions === void 0) { updateSubscriptions = true; }
        this.data = formatFormData(newValue, this.dataMap, this.dataRecursiveRefMap, this.arrayMap, this.formOptions.returnEmptyFields);
        this.isValid = this.validateFormData(this.data);
        this.validData = this.isValid ? this.data : null;
        var compileErrors = function (errors) {
            var compiledErrors = {};
            (errors || []).forEach(function (error) {
                if (!compiledErrors[error.dataPath]) {
                    compiledErrors[error.dataPath] = [];
                }
                compiledErrors[error.dataPath].push(error.message);
            });
            return compiledErrors;
        };
        this.ajvErrors = this.validateFormData.errors;
        this.validationErrors = compileErrors(this.validateFormData.errors);
        if (updateSubscriptions) {
            this.dataChanges.next(this.data);
            this.isValidChanges.next(this.isValid);
            this.validationErrorChanges.next(this.ajvErrors);
        }
    };
    JsonSchemaFormService.prototype.buildFormGroupTemplate = function (formValues, setValues) {
        if (formValues === void 0) { formValues = null; }
        if (setValues === void 0) { setValues = true; }
        this.formGroupTemplate = buildFormGroupTemplate(this, formValues, setValues);
    };
    JsonSchemaFormService.prototype.buildFormGroup = function () {
        var _this = this;
        this.formGroup = buildFormGroup(this.formGroupTemplate);
        if (this.formGroup) {
            this.compileAjvSchema();
            this.validateData(this.formGroup.value);
            if (this.formValueSubscription) {
                this.formValueSubscription.unsubscribe();
            }
            this.formValueSubscription = this.formGroup.valueChanges
                .subscribe(function (formValue) { return _this.validateData(formValue); });
        }
    };
    JsonSchemaFormService.prototype.buildLayout = function (widgetLibrary) {
        this.layout = buildLayout(this, widgetLibrary);
    };
    JsonSchemaFormService.prototype.setOptions = function (newOptions) {
        if (isObject(newOptions)) {
            var addOptions = _.cloneDeep(newOptions);
            if (isObject(addOptions.defaultOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defaultOptions);
                delete addOptions.defaultOptions;
            }
            if (isObject(addOptions.defautWidgetOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defautWidgetOptions);
                delete addOptions.defautWidgetOptions;
            }
            Object.assign(this.formOptions, addOptions);
            var globalDefaults_1 = this.formOptions.defautWidgetOptions;
            ['ErrorState', 'SuccessState']
                .filter(function (suffix) { return hasOwn(globalDefaults_1, 'disable' + suffix); })
                .forEach(function (suffix) {
                globalDefaults_1['enable' + suffix] = !globalDefaults_1['disable' + suffix];
                delete globalDefaults_1['disable' + suffix];
            });
        }
    };
    JsonSchemaFormService.prototype.compileAjvSchema = function () {
        if (!this.validateFormData) {
            if (Array.isArray(this.schema.properties['ui:order'])) {
                this.schema['ui:order'] = this.schema.properties['ui:order'];
                delete this.schema.properties['ui:order'];
            }
            this.ajv.removeSchema(this.schema);
            this.validateFormData = this.ajv.compile(this.schema);
        }
    };
    JsonSchemaFormService.prototype.buildSchemaFromData = function (data, requireAllFields) {
        if (requireAllFields === void 0) { requireAllFields = false; }
        if (data) {
            return buildSchemaFromData(data, requireAllFields);
        }
        this.schema = buildSchemaFromData(this.formValues, requireAllFields);
    };
    JsonSchemaFormService.prototype.buildSchemaFromLayout = function (layout) {
        if (layout) {
            return buildSchemaFromLayout(layout);
        }
        this.schema = buildSchemaFromLayout(this.layout);
    };
    JsonSchemaFormService.prototype.setTpldata = function (newTpldata) {
        if (newTpldata === void 0) { newTpldata = {}; }
        this.tpldata = newTpldata;
    };
    JsonSchemaFormService.prototype.parseText = function (text, value, values, key) {
        var _this = this;
        if (text === void 0) { text = ''; }
        if (value === void 0) { value = {}; }
        if (values === void 0) { values = {}; }
        if (key === void 0) { key = null; }
        if (!text || !/{{.+?}}/.test(text)) {
            return text;
        }
        return text.replace(/{{(.+?)}}/g, function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            return _this.parseExpression(a[1], value, values, key, _this.tpldata);
        });
    };
    JsonSchemaFormService.prototype.parseExpression = function (expression, value, values, key, tpldata) {
        var _this = this;
        if (expression === void 0) { expression = ''; }
        if (value === void 0) { value = {}; }
        if (values === void 0) { values = {}; }
        if (key === void 0) { key = null; }
        if (tpldata === void 0) { tpldata = null; }
        if (typeof expression !== 'string') {
            return '';
        }
        var index = typeof key === 'number' ? (key + 1) + '' : (key || '');
        expression = expression.trim();
        if ((expression[0] === "'" || expression[0] === '"') &&
            expression[0] === expression[expression.length - 1] &&
            expression.slice(1, expression.length - 1).indexOf(expression[0]) === -1) {
            return expression.slice(1, expression.length - 1);
        }
        if (expression === 'idx' || expression === '$index') {
            return index;
        }
        if (expression === 'value' && !hasOwn(values, 'value')) {
            return value;
        }
        if (['"', "'", ' ', '||', '&&', '+'].every(function (delim) { return expression.indexOf(delim) === -1; })) {
            var pointer = JsonPointer.parseObjectPath(expression);
            return pointer[0] === 'value' && JsonPointer.has(value, pointer.slice(1)) ?
                JsonPointer.get(value, pointer.slice(1)) :
                pointer[0] === 'values' && JsonPointer.has(values, pointer.slice(1)) ?
                    JsonPointer.get(values, pointer.slice(1)) :
                    pointer[0] === 'tpldata' && JsonPointer.has(tpldata, pointer.slice(1)) ?
                        JsonPointer.get(tpldata, pointer.slice(1)) :
                        JsonPointer.has(values, pointer) ? JsonPointer.get(values, pointer) : '';
        }
        if (expression.indexOf('[idx]') > -1) {
            expression = expression.replace(/\[idx\]/g, index);
        }
        if (expression.indexOf('[$index]') > -1) {
            expression = expression.replace(/\[$index\]/g, index);
        }
        if (expression.indexOf('||') > -1) {
            return expression.split('||').reduce(function (all, term) {
                return all || _this.parseExpression(term, value, values, key, tpldata);
            }, '');
        }
        if (expression.indexOf('&&') > -1) {
            return expression.split('&&').reduce(function (all, term) {
                return all && _this.parseExpression(term, value, values, key, tpldata);
            }, ' ').trim();
        }
        if (expression.indexOf('+') > -1) {
            return expression.split('+')
                .map(function (term) { return _this.parseExpression(term, value, values, key, tpldata); })
                .join('');
        }
        return '';
    };
    JsonSchemaFormService.prototype.setArrayItemTitle = function (parentCtx, childNode, index) {
        if (parentCtx === void 0) { parentCtx = {}; }
        if (childNode === void 0) { childNode = null; }
        if (index === void 0) { index = null; }
        var parentNode = parentCtx.layoutNode;
        var parentValues = this.getFormControlValue(parentCtx);
        var isArrayItem = (parentNode.type || '').slice(-5) === 'array' && isArray(parentValues);
        var text = JsonPointer.getFirst(isArrayItem && childNode.type !== '$ref' ? [
            [childNode, '/options/legend'],
            [childNode, '/options/title'],
            [parentNode, '/options/title'],
            [parentNode, '/options/legend'],
        ] : [
            [childNode, '/options/title'],
            [childNode, '/options/legend'],
            [parentNode, '/options/title'],
            [parentNode, '/options/legend']
        ]);
        if (!text) {
            return text;
        }
        var childValue = isArray(parentValues) && index < parentValues.length ?
            parentValues[index] : parentValues;
        return this.parseText(text, childValue, parentValues, index);
    };
    JsonSchemaFormService.prototype.setItemTitle = function (ctx) {
        return !ctx.options.title && /^(\d+|-)$/.test(ctx.layoutNode.name) ?
            null :
            this.parseText(ctx.options.title || toTitleCase(ctx.layoutNode.name), this.getFormControlValue(this), (this.getFormControlGroup(this) || {}).value, ctx.dataIndex[ctx.dataIndex.length - 1]);
    };
    JsonSchemaFormService.prototype.evaluateCondition = function (layoutNode, dataIndex) {
        var arrayIndex = dataIndex && dataIndex[dataIndex.length - 1];
        var result = true;
        if (hasValue((layoutNode.options || {}).condition)) {
            if (typeof layoutNode.options.condition === 'string') {
                var pointer = layoutNode.options.condition;
                if (hasValue(arrayIndex)) {
                    pointer = pointer.replace('[arrayIndex]', "[" + arrayIndex + "]");
                }
                pointer = JsonPointer.parseObjectPath(pointer);
                result = !!JsonPointer.get(this.data, pointer);
                if (!result && pointer[0] === 'model') {
                    result = !!JsonPointer.get({ model: this.data }, pointer);
                }
            }
            else if (typeof layoutNode.options.condition === 'function') {
                result = layoutNode.options.condition(this.data);
            }
            else if (typeof layoutNode.options.condition.functionBody === 'string') {
                try {
                    var dynFn = new Function('model', 'arrayIndices', layoutNode.options.condition.functionBody);
                    result = dynFn(this.data, dataIndex);
                }
                catch (e) {
                    result = true;
                    console.error("condition functionBody errored out on evaluation: " + layoutNode.options.condition.functionBody);
                }
            }
        }
        return result;
    };
    JsonSchemaFormService.prototype.initializeControl = function (ctx, bind) {
        var _this = this;
        if (bind === void 0) { bind = true; }
        if (!isObject(ctx)) {
            return false;
        }
        if (isEmpty(ctx.options)) {
            ctx.options = !isEmpty((ctx.layoutNode || {}).options) ?
                ctx.layoutNode.options : _.cloneDeep(this.formOptions);
        }
        ctx.formControl = this.getFormControl(ctx);
        ctx.boundControl = bind && !!ctx.formControl;
        if (ctx.formControl) {
            ctx.controlName = this.getFormControlName(ctx);
            ctx.controlValue = ctx.formControl.value;
            ctx.controlDisabled = ctx.formControl.disabled;
            ctx.options.errorMessage = ctx.formControl.status === 'VALID' ? null :
                this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages);
            ctx.options.showErrors = this.formOptions.validateOnRender === true ||
                (this.formOptions.validateOnRender === 'auto' && hasValue(ctx.controlValue));
            ctx.formControl.statusChanges.subscribe(function (status) {
                return ctx.options.errorMessage = status === 'VALID' ? null :
                    _this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages);
            });
            ctx.formControl.valueChanges.subscribe(function (value) {
                if (!_.isEqual(ctx.controlValue, value)) {
                    ctx.controlValue = value;
                }
            });
        }
        else {
            ctx.controlName = ctx.layoutNode.name;
            ctx.controlValue = ctx.layoutNode.value || null;
            var dataPointer = this.getDataPointer(ctx);
            if (bind && dataPointer) {
                console.error("warning: control \"" + dataPointer + "\" is not bound to the Angular FormGroup.");
            }
        }
        return ctx.boundControl;
    };
    JsonSchemaFormService.prototype.formatErrors = function (errors, validationMessages) {
        if (validationMessages === void 0) { validationMessages = {}; }
        if (isEmpty(errors)) {
            return null;
        }
        if (!isObject(validationMessages)) {
            validationMessages = {};
        }
        var addSpaces = function (string) { return string[0].toUpperCase() + (string.slice(1) || '')
            .replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '); };
        var formatError = function (error) { return typeof error === 'object' ?
            Object.keys(error).map(function (key) {
                return error[key] === true ? addSpaces(key) :
                    error[key] === false ? 'Not ' + addSpaces(key) :
                        addSpaces(key) + ': ' + formatError(error[key]);
            }).join(', ') :
            addSpaces(error.toString()); };
        return Object.keys(errors)
            .filter(function (errorKey) { return errorKey !== 'required' || Object.keys(errors).length === 1; })
            .map(function (errorKey) {
            return typeof validationMessages === 'string' ? validationMessages :
                typeof validationMessages[errorKey] === 'function' ?
                    validationMessages[errorKey](errors[errorKey]) :
                    typeof validationMessages[errorKey] === 'string' ?
                        !/{{.+?}}/.test(validationMessages[errorKey]) ?
                            validationMessages[errorKey] :
                            Object.keys(errors[errorKey])
                                .reduce(function (errorMessage, errorProperty) { return errorMessage.replace(new RegExp('{{' + errorProperty + '}}', 'g'), errors[errorKey][errorProperty]); }, validationMessages[errorKey]) :
                        addSpaces(errorKey) + ' Error: ' + formatError(errors[errorKey]);
        }).join('<br>');
    };
    JsonSchemaFormService.prototype.updateValue = function (ctx, value) {
        ctx.controlValue = value;
        if (ctx.boundControl) {
            ctx.formControl.setValue(value);
            ctx.formControl.markAsDirty();
        }
        ctx.layoutNode.value = value;
        if (isArray(ctx.options.copyValueTo)) {
            for (var _i = 0, _a = ctx.options.copyValueTo; _i < _a.length; _i++) {
                var item = _a[_i];
                var targetControl = getControl(this.formGroup, item);
                if (isObject(targetControl) && typeof targetControl.setValue === 'function') {
                    targetControl.setValue(value);
                    targetControl.markAsDirty();
                }
            }
        }
    };
    JsonSchemaFormService.prototype.updateArrayCheckboxList = function (ctx, checkboxList) {
        var formArray = this.getFormControl(ctx);
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        var refPointer = removeRecursiveReferences(ctx.layoutNode.dataPointer + '/-', this.dataRecursiveRefMap, this.arrayMap);
        for (var _i = 0, checkboxList_1 = checkboxList; _i < checkboxList_1.length; _i++) {
            var checkboxItem = checkboxList_1[_i];
            if (checkboxItem.checked) {
                var newFormControl = buildFormGroup(this.templateRefLibrary[refPointer]);
                newFormControl.setValue(checkboxItem.value);
                formArray.push(newFormControl);
            }
        }
        formArray.markAsDirty();
    };
    JsonSchemaFormService.prototype.getFormControl = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === '$ref') {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx));
    };
    JsonSchemaFormService.prototype.getFormControlValue = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === '$ref') {
            return null;
        }
        var control = getControl(this.formGroup, this.getDataPointer(ctx));
        return control ? control.value : null;
    };
    JsonSchemaFormService.prototype.getFormControlGroup = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer)) {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx), true);
    };
    JsonSchemaFormService.prototype.getFormControlName = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toKey(this.getDataPointer(ctx));
    };
    JsonSchemaFormService.prototype.getLayoutArray = function (ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -1);
    };
    JsonSchemaFormService.prototype.getParentNode = function (ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -2);
    };
    JsonSchemaFormService.prototype.getDataPointer = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toIndexedPointer(ctx.layoutNode.dataPointer, ctx.dataIndex, this.arrayMap);
    };
    JsonSchemaFormService.prototype.getLayoutPointer = function (ctx) {
        if (!hasValue(ctx.layoutIndex)) {
            return null;
        }
        return '/' + ctx.layoutIndex.join('/items/');
    };
    JsonSchemaFormService.prototype.isControlBound = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return false;
        }
        var controlGroup = this.getFormControlGroup(ctx);
        var name = this.getFormControlName(ctx);
        return controlGroup ? hasOwn(controlGroup.controls, name) : false;
    };
    JsonSchemaFormService.prototype.addItem = function (ctx, name) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.$ref) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex)) {
            return false;
        }
        var newFormGroup = buildFormGroup(this.templateRefLibrary[ctx.layoutNode.$ref]);
        if (ctx.layoutNode.arrayItem) {
            this.getFormControlGroup(ctx).push(newFormGroup);
        }
        else {
            this.getFormControlGroup(ctx)
                .addControl(name || this.getFormControlName(ctx), newFormGroup);
        }
        var newLayoutNode = getLayoutNode(ctx.layoutNode, this);
        newLayoutNode.arrayItem = ctx.layoutNode.arrayItem;
        if (ctx.layoutNode.arrayItemType) {
            newLayoutNode.arrayItemType = ctx.layoutNode.arrayItemType;
        }
        else {
            delete newLayoutNode.arrayItemType;
        }
        if (name) {
            newLayoutNode.name = name;
            newLayoutNode.dataPointer += '/' + JsonPointer.escape(name);
            newLayoutNode.options.title = fixTitle(name);
        }
        JsonPointer.insert(this.layout, this.getLayoutPointer(ctx), newLayoutNode);
        return true;
    };
    JsonSchemaFormService.prototype.moveArrayItem = function (ctx, oldIndex, newIndex) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex) ||
            !isDefined(oldIndex) || !isDefined(newIndex) || oldIndex === newIndex) {
            return false;
        }
        var formArray = this.getFormControlGroup(ctx);
        var arrayItem = formArray.at(oldIndex);
        formArray.removeAt(oldIndex);
        formArray.insert(newIndex, arrayItem);
        formArray.updateValueAndValidity();
        var layoutArray = this.getLayoutArray(ctx);
        layoutArray.splice(newIndex, 0, layoutArray.splice(oldIndex, 1)[0]);
        return true;
    };
    JsonSchemaFormService.prototype.removeItem = function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex)) {
            return false;
        }
        if (ctx.layoutNode.arrayItem) {
            this.getFormControlGroup(ctx)
                .removeAt(ctx.dataIndex[ctx.dataIndex.length - 1]);
        }
        else {
            this.getFormControlGroup(ctx)
                .removeControl(this.getFormControlName(ctx));
        }
        JsonPointer.remove(this.layout, this.getLayoutPointer(ctx));
        return true;
    };
    JsonSchemaFormService.decorators = [
        { type: core.Injectable },
    ];
    JsonSchemaFormService.ctorParameters = function () { return []; };
    return JsonSchemaFormService;
}());

var OrderableDirective = (function () {
    function OrderableDirective(elementRef, jsf, ngZone) {
        this.elementRef = elementRef;
        this.jsf = jsf;
        this.ngZone = ngZone;
        this.overParentElement = false;
        this.overChildElement = false;
    }
    OrderableDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.orderable && this.layoutNode && this.layoutIndex && this.dataIndex) {
            this.element = this.elementRef.nativeElement;
            this.element.draggable = true;
            this.arrayLayoutIndex = 'move:' + this.layoutIndex.slice(0, -1).toString();
            this.ngZone.runOutsideAngular(function () {
                _this.element.addEventListener('dragstart', function (event) {
                    event.dataTransfer.effectAllowed = 'move';
                    var sourceArrayIndex = _this.dataIndex[_this.dataIndex.length - 1];
                    sessionStorage.setItem(_this.arrayLayoutIndex, sourceArrayIndex + '');
                });
                _this.element.addEventListener('dragover', function (event) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.dataTransfer.dropEffect = 'move';
                    return false;
                });
                _this.element.addEventListener('dragenter', function (event) {
                    if (_this.overParentElement) {
                        return _this.overChildElement = true;
                    }
                    else {
                        _this.overParentElement = true;
                    }
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    if (sourceArrayIndex !== null) {
                        if (_this.dataIndex[_this.dataIndex.length - 1] < +sourceArrayIndex) {
                            _this.element.classList.add('drag-target-top');
                        }
                        else if (_this.dataIndex[_this.dataIndex.length - 1] > +sourceArrayIndex) {
                            _this.element.classList.add('drag-target-bottom');
                        }
                    }
                });
                _this.element.addEventListener('dragleave', function (event) {
                    if (_this.overChildElement) {
                        _this.overChildElement = false;
                    }
                    else if (_this.overParentElement) {
                        _this.overParentElement = false;
                    }
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    if (!_this.overParentElement && !_this.overChildElement && sourceArrayIndex !== null) {
                        _this.element.classList.remove('drag-target-top');
                        _this.element.classList.remove('drag-target-bottom');
                    }
                });
                _this.element.addEventListener('drop', function (event) {
                    _this.element.classList.remove('drag-target-top');
                    _this.element.classList.remove('drag-target-bottom');
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    var destArrayIndex = _this.dataIndex[_this.dataIndex.length - 1];
                    if (sourceArrayIndex !== null && +sourceArrayIndex !== destArrayIndex) {
                        _this.jsf.moveArrayItem(_this, +sourceArrayIndex, destArrayIndex);
                    }
                    sessionStorage.removeItem(_this.arrayLayoutIndex);
                    return false;
                });
            });
        }
    };
    OrderableDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[orderable]',
                },] },
    ];
    OrderableDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: JsonSchemaFormService },
        { type: core.NgZone }
    ]; };
    OrderableDirective.propDecorators = {
        orderable: [{ type: core.Input }],
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return OrderableDirective;
}());

var AddReferenceComponent = (function () {
    function AddReferenceComponent(jsf) {
        this.jsf = jsf;
    }
    AddReferenceComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
    };
    Object.defineProperty(AddReferenceComponent.prototype, "showAddButton", {
        get: function () {
            return !this.layoutNode.arrayItem ||
                this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    AddReferenceComponent.prototype.addItem = function (event) {
        event.preventDefault();
        this.jsf.addItem(this);
    };
    Object.defineProperty(AddReferenceComponent.prototype, "buttonText", {
        get: function () {
            var parent = {
                dataIndex: this.dataIndex.slice(0, -1),
                layoutIndex: this.layoutIndex.slice(0, -1),
                layoutNode: this.jsf.getParentNode(this)
            };
            return parent.layoutNode.add ||
                this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
        },
        enumerable: true,
        configurable: true
    });
    AddReferenceComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'add-reference-widget',
                    template: "\n    <button *ngIf=\"showAddButton\"\n      [class]=\"options?.fieldHtmlClass || ''\"\n      [disabled]=\"options?.readonly\"\n      (click)=\"addItem($event)\">\n      <span *ngIf=\"options?.icon\" [class]=\"options?.icon\"></span>\n      <span *ngIf=\"options?.title\" [innerHTML]=\"buttonText\"></span>\n    </button>",
                    changeDetection: core.ChangeDetectionStrategy.Default,
                },] },
    ];
    AddReferenceComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    AddReferenceComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return AddReferenceComponent;
}());

var OneOfComponent = (function () {
    function OneOfComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    OneOfComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    OneOfComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    OneOfComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'one-of-widget',
                    template: "",
                },] },
    ];
    OneOfComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    OneOfComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return OneOfComponent;
}());

var ButtonComponent = (function () {
    function ButtonComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    ButtonComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    ButtonComponent.prototype.updateValue = function (event) {
        if (typeof this.options.onClick === 'function') {
            this.options.onClick(event);
        }
        else {
            this.jsf.updateValue(this, event.target.value);
        }
    };
    ButtonComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'button-widget',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\">\n      <button\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [name]=\"controlName\"\n        [type]=\"layoutNode?.type\"\n        [value]=\"controlValue\"\n        (click)=\"updateValue($event)\">\n        <span *ngIf=\"options?.icon || options?.title\"\n          [class]=\"options?.icon\"\n          [innerHTML]=\"options?.title\"></span>\n      </button>\n    </div>",
                },] },
    ];
    ButtonComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    ButtonComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return ButtonComponent;
}());

var CheckboxComponent = (function () {
    function CheckboxComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.trueValue = true;
        this.falseValue = false;
    }
    CheckboxComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = this.options.title;
        }
    };
    CheckboxComponent.prototype.updateValue = function (event) {
        event.preventDefault();
        this.jsf.updateValue(this, event.target.checked ? this.trueValue : this.falseValue);
    };
    Object.defineProperty(CheckboxComponent.prototype, "isChecked", {
        get: function () {
            return this.jsf.getFormControlValue(this) === this.trueValue;
        },
        enumerable: true,
        configurable: true
    });
    CheckboxComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'checkbox-widget',
                    template: "\n    <label\n      [attr.for]=\"'control' + layoutNode?._id\"\n      [class]=\"options?.itemLabelHtmlClass || ''\">\n      <input *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [class]=\"(options?.fieldHtmlClass || '') + (isChecked ?\n          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n          (' ' + (options?.style?.unselected || '')))\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        type=\"checkbox\">\n      <input *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [checked]=\"isChecked ? 'checked' : null\"\n        [class]=\"(options?.fieldHtmlClass || '') + (isChecked ?\n          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n          (' ' + (options?.style?.unselected || '')))\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [value]=\"controlValue\"\n        type=\"checkbox\"\n        (change)=\"updateValue($event)\">\n      <span *ngIf=\"options?.title\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </label>",
                },] },
    ];
    CheckboxComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    CheckboxComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return CheckboxComponent;
}());

var CheckboxesComponent = (function () {
    function CheckboxesComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.checkboxList = [];
    }
    CheckboxesComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.layoutOrientation = (this.layoutNode.type === 'checkboxes-inline' ||
            this.layoutNode.type === 'checkboxbuttons') ? 'horizontal' : 'vertical';
        this.jsf.initializeControl(this);
        this.checkboxList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        if (this.boundControl) {
            var formArray_1 = this.jsf.getFormControl(this);
            this.checkboxList.forEach(function (checkboxItem) {
                return checkboxItem.checked = formArray_1.value.includes(checkboxItem.value);
            });
        }
    };
    CheckboxesComponent.prototype.updateValue = function (event) {
        for (var _i = 0, _a = this.checkboxList; _i < _a.length; _i++) {
            var checkboxItem = _a[_i];
            if (event.target.value === checkboxItem.value) {
                checkboxItem.checked = event.target.checked;
            }
        }
        if (this.boundControl) {
            this.jsf.updateArrayCheckboxList(this, this.checkboxList);
        }
    };
    CheckboxesComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'checkboxes-widget',
                    template: "\n    <label *ngIf=\"options?.title\"\n      [class]=\"options?.labelHtmlClass || ''\"\n      [style.display]=\"options?.notitle ? 'none' : ''\"\n      [innerHTML]=\"options?.title\"></label>\n\n    <!-- 'horizontal' = checkboxes-inline or checkboxbuttons -->\n    <div *ngIf=\"layoutOrientation === 'horizontal'\" [class]=\"options?.htmlClass || ''\">\n      <label *ngFor=\"let checkboxItem of checkboxList\"\n        [attr.for]=\"'control' + layoutNode?._id + '/' + checkboxItem.value\"\n        [class]=\"(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?\n          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n          (' ' + (options?.style?.unselected || '')))\">\n        <input type=\"checkbox\"\n          [attr.required]=\"options?.required\"\n          [checked]=\"checkboxItem.checked\"\n          [class]=\"options?.fieldHtmlClass || ''\"\n          [disabled]=\"controlDisabled\"\n          [id]=\"'control' + layoutNode?._id + '/' + checkboxItem.value\"\n          [name]=\"checkboxItem?.name\"\n          [readonly]=\"options?.readonly ? 'readonly' : null\"\n          [value]=\"checkboxItem.value\"\n          (change)=\"updateValue($event)\">\n        <span [innerHTML]=\"checkboxItem.name\"></span>\n      </label>\n    </div>\n\n    <!-- 'vertical' = regular checkboxes -->\n    <div *ngIf=\"layoutOrientation === 'vertical'\">\n      <div *ngFor=\"let checkboxItem of checkboxList\" [class]=\"options?.htmlClass || ''\">\n        <label\n          [attr.for]=\"'control' + layoutNode?._id + '/' + checkboxItem.value\"\n          [class]=\"(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?\n            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n            (' ' + (options?.style?.unselected || '')))\">\n          <input type=\"checkbox\"\n            [attr.required]=\"options?.required\"\n            [checked]=\"checkboxItem.checked\"\n            [class]=\"options?.fieldHtmlClass || ''\"\n            [disabled]=\"controlDisabled\"\n            [id]=\"options?.name + '/' + checkboxItem.value\"\n            [name]=\"checkboxItem?.name\"\n            [readonly]=\"options?.readonly ? 'readonly' : null\"\n            [value]=\"checkboxItem.value\"\n            (change)=\"updateValue($event)\">\n          <span [innerHTML]=\"checkboxItem?.name\"></span>\n        </label>\n      </div>\n    </div>",
                },] },
    ];
    CheckboxesComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    CheckboxesComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return CheckboxesComponent;
}());

var FileComponent = (function () {
    function FileComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    FileComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    FileComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    FileComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'file-widget',
                    template: "",
                },] },
    ];
    FileComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    FileComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return FileComponent;
}());

var InputComponent = (function () {
    function InputComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.autoCompleteList = [];
    }
    InputComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    InputComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    InputComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'input-widget',
                    template: "\n    <div [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <input *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [attr.placeholder]=\"options?.placeholder\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [type]=\"layoutNode?.type\">\n      <input *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [attr.placeholder]=\"options?.placeholder\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [type]=\"layoutNode?.type\"\n        [value]=\"controlValue\"\n        (input)=\"updateValue($event)\">\n        <datalist *ngIf=\"options?.typeahead?.source\"\n          [id]=\"'control' + layoutNode?._id + 'Autocomplete'\">\n          <option *ngFor=\"let word of options?.typeahead?.source\" [value]=\"word\">\n        </datalist>\n    </div>",
                },] },
    ];
    InputComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    InputComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return InputComponent;
}());

var MessageComponent = (function () {
    function MessageComponent(jsf) {
        this.jsf = jsf;
        this.message = null;
    }
    MessageComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.message = this.options.help || this.options.helpvalue ||
            this.options.msg || this.options.message;
    };
    MessageComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'message-widget',
                    template: "\n    <span *ngIf=\"message\"\n      [class]=\"options?.labelHtmlClass || ''\"\n      [innerHTML]=\"message\"></span>",
                },] },
    ];
    MessageComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MessageComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MessageComponent;
}());

var NoneComponent = (function () {
    function NoneComponent() {
    }
    NoneComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'none-widget',
                    template: "",
                },] },
    ];
    NoneComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return NoneComponent;
}());

var NumberComponent = (function () {
    function NumberComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.allowNegative = true;
        this.allowDecimal = true;
        this.allowExponents = false;
        this.lastValidNumber = '';
    }
    NumberComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.layoutNode.dataType === 'integer') {
            this.allowDecimal = false;
        }
    };
    NumberComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    NumberComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'number-widget',
                    template: "\n    <div [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <input *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.max]=\"options?.maximum\"\n        [attr.min]=\"options?.minimum\"\n        [attr.placeholder]=\"options?.placeholder\"\n        [attr.required]=\"options?.required\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.step]=\"options?.multipleOf || options?.step || 'any'\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [title]=\"lastValidNumber\"\n        [type]=\"layoutNode?.type === 'range' ? 'range' : 'number'\">\n      <input *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.max]=\"options?.maximum\"\n        [attr.min]=\"options?.minimum\"\n        [attr.placeholder]=\"options?.placeholder\"\n        [attr.required]=\"options?.required\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.step]=\"options?.multipleOf || options?.step || 'any'\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [title]=\"lastValidNumber\"\n        [type]=\"layoutNode?.type === 'range' ? 'range' : 'number'\"\n        [value]=\"controlValue\"\n        (input)=\"updateValue($event)\">\n      <span *ngIf=\"layoutNode?.type === 'range'\" [innerHTML]=\"controlValue\"></span>\n    </div>",
                },] },
    ];
    NumberComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    NumberComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return NumberComponent;
}());

var RadiosComponent = (function () {
    function RadiosComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.layoutOrientation = 'vertical';
        this.radiosList = [];
    }
    RadiosComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        if (this.layoutNode.type === 'radios-inline' ||
            this.layoutNode.type === 'radiobuttons') {
            this.layoutOrientation = 'horizontal';
        }
        this.radiosList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        this.jsf.initializeControl(this);
    };
    RadiosComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    RadiosComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'radios-widget',
                    template: "\n    <label *ngIf=\"options?.title\"\n      [attr.for]=\"'control' + layoutNode?._id\"\n      [class]=\"options?.labelHtmlClass || ''\"\n      [style.display]=\"options?.notitle ? 'none' : ''\"\n      [innerHTML]=\"options?.title\"></label>\n\n    <!-- 'horizontal' = radios-inline or radiobuttons -->\n    <div *ngIf=\"layoutOrientation === 'horizontal'\"\n      [class]=\"options?.htmlClass || ''\">\n      <label *ngFor=\"let radioItem of radiosList\"\n        [attr.for]=\"'control' + layoutNode?._id + '/' + radioItem?.value\"\n        [class]=\"(options?.itemLabelHtmlClass || '') +\n          ((controlValue + '' === radioItem?.value + '') ?\n          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n          (' ' + (options?.style?.unselected || '')))\">\n        <input type=\"radio\"\n          [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n          [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n          [attr.required]=\"options?.required\"\n          [checked]=\"radioItem?.value === controlValue\"\n          [class]=\"options?.fieldHtmlClass || ''\"\n          [disabled]=\"controlDisabled\"\n          [id]=\"'control' + layoutNode?._id + '/' + radioItem?.value\"\n          [name]=\"controlName\"\n          [value]=\"radioItem?.value\"\n          (change)=\"updateValue($event)\">\n        <span [innerHTML]=\"radioItem?.name\"></span>\n      </label>\n    </div>\n\n    <!-- 'vertical' = regular radios -->\n    <div *ngIf=\"layoutOrientation !== 'horizontal'\">\n      <div *ngFor=\"let radioItem of radiosList\"\n        [class]=\"options?.htmlClass || ''\">\n        <label\n          [attr.for]=\"'control' + layoutNode?._id + '/' + radioItem?.value\"\n          [class]=\"(options?.itemLabelHtmlClass || '') +\n            ((controlValue + '' === radioItem?.value + '') ?\n            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n            (' ' + (options?.style?.unselected || '')))\">\n          <input type=\"radio\"\n            [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n            [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n            [attr.required]=\"options?.required\"\n            [checked]=\"radioItem?.value === controlValue\"\n            [class]=\"options?.fieldHtmlClass || ''\"\n            [disabled]=\"controlDisabled\"\n            [id]=\"'control' + layoutNode?._id + '/' + radioItem?.value\"\n            [name]=\"controlName\"\n            [value]=\"radioItem?.value\"\n            (change)=\"updateValue($event)\">\n          <span [innerHTML]=\"radioItem?.name\"></span>\n        </label>\n      </div>\n    </div>",
                },] },
    ];
    RadiosComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    RadiosComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return RadiosComponent;
}());

var RootComponent = (function () {
    function RootComponent(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    RootComponent.prototype.isDraggable = function (node) {
        return node.arrayItem && node.type !== '$ref' &&
            node.arrayItemType === 'list' && this.isOrderable !== false;
    };
    RootComponent.prototype.getFlexAttribute = function (node, attribute) {
        var index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    };
    RootComponent.prototype.showWidget = function (layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    };
    RootComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'root-widget',
                    template: "\n    <div *ngFor=\"let layoutItem of layout; let i = index\"\n      [class.form-flex-item]=\"isFlexItem\"\n      [style.align-self]=\"(layoutItem.options || {})['align-self']\"\n      [style.flex-basis]=\"getFlexAttribute(layoutItem, 'flex-basis')\"\n      [style.flex-grow]=\"getFlexAttribute(layoutItem, 'flex-grow')\"\n      [style.flex-shrink]=\"getFlexAttribute(layoutItem, 'flex-shrink')\"\n      [style.order]=\"(layoutItem.options || {}).order\">\n      <div\n        [dataIndex]=\"layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])\"\n        [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n        [layoutNode]=\"layoutItem\"\n        [orderable]=\"isDraggable(layoutItem)\">\n        <select-framework-widget *ngIf=\"showWidget(layoutItem)\"\n          [dataIndex]=\"layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])\"\n          [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n          [layoutNode]=\"layoutItem\"></select-framework-widget>\n      </div>\n    </div>",
                    styles: ["\n    [draggable=true] {\n      transition: all 150ms cubic-bezier(.4, 0, .2, 1);\n    }\n    [draggable=true]:hover {\n      cursor: move;\n      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);\n      position: relative; z-index: 10;\n      margin-top: -1px;\n      margin-left: -1px;\n      margin-right: 1px;\n      margin-bottom: 1px;\n    }\n    [draggable=true].drag-target-top {\n      box-shadow: 0 -2px 0 #000;\n      position: relative; z-index: 20;\n    }\n    [draggable=true].drag-target-bottom {\n      box-shadow: 0 2px 0 #000;\n      position: relative; z-index: 20;\n    }\n  "],
                },] },
    ];
    RootComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    RootComponent.propDecorators = {
        dataIndex: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        layout: [{ type: core.Input }],
        isOrderable: [{ type: core.Input }],
        isFlexItem: [{ type: core.Input }]
    };
    return RootComponent;
}());

var SectionComponent = (function () {
    function SectionComponent(jsf) {
        this.jsf = jsf;
        this.expanded = true;
    }
    Object.defineProperty(SectionComponent.prototype, "sectionTitle", {
        get: function () {
            return this.options.notitle ? null : this.jsf.setItemTitle(this);
        },
        enumerable: true,
        configurable: true
    });
    SectionComponent.prototype.ngOnInit = function () {
        this.jsf.initializeControl(this);
        this.options = this.layoutNode.options || {};
        this.expanded = typeof this.options.expanded === 'boolean' ?
            this.options.expanded : !this.options.expandable;
        switch (this.layoutNode.type) {
            case 'fieldset':
            case 'array':
            case 'tab':
            case 'advancedfieldset':
            case 'authfieldset':
            case 'optionfieldset':
            case 'selectfieldset':
                this.containerType = 'fieldset';
                break;
            default:
                this.containerType = 'div';
                break;
        }
    };
    SectionComponent.prototype.toggleExpanded = function () {
        if (this.options.expandable) {
            this.expanded = !this.expanded;
        }
    };
    SectionComponent.prototype.getFlexAttribute = function (attribute) {
        var flexActive = this.layoutNode.type === 'flex' ||
            !!this.options.displayFlex ||
            this.options.display === 'flex';
        if (attribute !== 'flex' && !flexActive) {
            return null;
        }
        switch (attribute) {
            case 'is-flex':
                return flexActive;
            case 'display':
                return flexActive ? 'flex' : 'initial';
            case 'flex-direction':
            case 'flex-wrap':
                var index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
                return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
                    this.options[attribute] || ['column', 'nowrap'][index];
            case 'justify-content':
            case 'align-items':
            case 'align-content':
                return this.options[attribute];
        }
    };
    SectionComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'section-widget',
                    template: "\n    <div *ngIf=\"containerType === 'div'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <label *ngIf=\"sectionTitle\"\n        class=\"legend\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></label>\n      <root-widget *ngIf=\"expanded\"\n        [dataIndex]=\"dataIndex\"\n        [layout]=\"layoutNode.items\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [isOrderable]=\"options?.orderable\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"></root-widget>\n    </div>\n    <fieldset *ngIf=\"containerType === 'fieldset'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\"\n      [disabled]=\"options?.readonly\">\n      <legend *ngIf=\"sectionTitle\"\n        class=\"legend\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></legend>\n      <div *ngIf=\"options?.messageLocation !== 'bottom'\">\n        <p *ngIf=\"options?.description\"\n        class=\"help-block\"\n        [class]=\"options?.labelHelpBlockClass || ''\"\n        [innerHTML]=\"options?.description\"></p>\n      </div>\n      <root-widget *ngIf=\"expanded\"\n        [dataIndex]=\"dataIndex\"\n        [layout]=\"layoutNode.items\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [isOrderable]=\"options?.orderable\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"></root-widget>\n      <div *ngIf=\"options?.messageLocation === 'bottom'\">\n        <p *ngIf=\"options?.description\"\n        class=\"help-block\"\n        [class]=\"options?.labelHelpBlockClass || ''\"\n        [innerHTML]=\"options?.description\"></p>\n      </div>\n    </fieldset>",
                    styles: ["\n    .legend { font-weight: bold; }\n    .expandable > legend:before, .expandable > label:before  { content: '\u25B6'; padding-right: .3em; }\n    .expanded > legend:before, .expanded > label:before  { content: '\u25BC'; padding-right: .2em; }\n  "],
                },] },
    ];
    SectionComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    SectionComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return SectionComponent;
}());

var SelectComponent = (function () {
    function SelectComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.selectList = [];
        this.isArray = isArray;
    }
    SelectComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.selectList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, !!this.options.required, !!this.options.flatList);
        this.jsf.initializeControl(this);
    };
    SelectComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    SelectComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'select-widget',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <select *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\">\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <option *ngIf=\"!isArray(selectItem?.items)\"\n            [value]=\"selectItem?.value\">\n            <span [innerHTML]=\"selectItem?.name\"></span>\n          </option>\n          <optgroup *ngIf=\"isArray(selectItem?.items)\"\n            [label]=\"selectItem?.group\">\n            <option *ngFor=\"let subItem of selectItem.items\"\n              [value]=\"subItem?.value\">\n              <span [innerHTML]=\"subItem?.name\"></span>\n            </option>\n          </optgroup>\n        </ng-template>\n      </select>\n      <select *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        (change)=\"updateValue($event)\">\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <option *ngIf=\"!isArray(selectItem?.items)\"\n            [selected]=\"selectItem?.value === controlValue\"\n            [value]=\"selectItem?.value\">\n            <span [innerHTML]=\"selectItem?.name\"></span>\n          </option>\n          <optgroup *ngIf=\"isArray(selectItem?.items)\"\n            [label]=\"selectItem?.group\">\n            <option *ngFor=\"let subItem of selectItem.items\"\n              [attr.selected]=\"subItem?.value === controlValue\"\n              [value]=\"subItem?.value\">\n              <span [innerHTML]=\"subItem?.name\"></span>\n            </option>\n          </optgroup>\n        </ng-template>\n      </select>\n    </div>",
                },] },
    ];
    SelectComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    SelectComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return SelectComponent;
}());

var SelectFrameworkComponent = (function () {
    function SelectFrameworkComponent(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    SelectFrameworkComponent.prototype.ngOnInit = function () {
        this.updateComponent();
    };
    SelectFrameworkComponent.prototype.ngOnChanges = function () {
        this.updateComponent();
    };
    SelectFrameworkComponent.prototype.updateComponent = function () {
        if (!this.newComponent && this.jsf.framework) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.jsf.framework));
        }
        if (this.newComponent) {
            for (var _i = 0, _a = ['layoutNode', 'layoutIndex', 'dataIndex']; _i < _a.length; _i++) {
                var input = _a[_i];
                this.newComponent.instance[input] = this[input];
            }
        }
    };
    SelectFrameworkComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'select-framework-widget',
                    template: "<div #widgetContainer></div>",
                },] },
    ];
    SelectFrameworkComponent.ctorParameters = function () { return [
        { type: core.ComponentFactoryResolver },
        { type: JsonSchemaFormService }
    ]; };
    SelectFrameworkComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }],
        widgetContainer: [{ type: core.ViewChild, args: ['widgetContainer', { read: core.ViewContainerRef },] }]
    };
    return SelectFrameworkComponent;
}());

var SelectWidgetComponent = (function () {
    function SelectWidgetComponent(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    SelectWidgetComponent.prototype.ngOnInit = function () {
        this.updateComponent();
    };
    SelectWidgetComponent.prototype.ngOnChanges = function () {
        this.updateComponent();
    };
    SelectWidgetComponent.prototype.updateComponent = function () {
        if (!this.newComponent && (this.layoutNode || {}).widget) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.widget));
        }
        if (this.newComponent) {
            for (var _i = 0, _a = ['layoutNode', 'layoutIndex', 'dataIndex']; _i < _a.length; _i++) {
                var input = _a[_i];
                this.newComponent.instance[input] = this[input];
            }
        }
    };
    SelectWidgetComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'select-widget-widget',
                    template: "<div #widgetContainer></div>",
                },] },
    ];
    SelectWidgetComponent.ctorParameters = function () { return [
        { type: core.ComponentFactoryResolver },
        { type: JsonSchemaFormService }
    ]; };
    SelectWidgetComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }],
        widgetContainer: [{ type: core.ViewChild, args: ['widgetContainer', { read: core.ViewContainerRef },] }]
    };
    return SelectWidgetComponent;
}());

var SubmitComponent = (function () {
    function SubmitComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    SubmitComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (hasOwn(this.options, 'disabled')) {
            this.controlDisabled = this.options.disabled;
        }
        else if (this.jsf.formOptions.disableInvalidSubmit) {
            this.controlDisabled = !this.jsf.isValid;
            this.jsf.isValidChanges.subscribe(function (isValid) { return _this.controlDisabled = !isValid; });
        }
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = this.options.title;
        }
    };
    SubmitComponent.prototype.updateValue = function (event) {
        if (typeof this.options.onClick === 'function') {
            this.options.onClick(event);
        }
        else {
            this.jsf.updateValue(this, event.target.value);
        }
    };
    SubmitComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'submit-widget',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\">\n      <input\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [type]=\"layoutNode?.type\"\n        [value]=\"controlValue\"\n        (click)=\"updateValue($event)\">\n    </div>",
                },] },
    ];
    SubmitComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    SubmitComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return SubmitComponent;
}());

var TabsComponent = (function () {
    function TabsComponent(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    TabsComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.itemCount = this.layoutNode.items.length - 1;
        this.updateControl();
    };
    TabsComponent.prototype.select = function (index) {
        if (this.layoutNode.items[index].type === '$ref') {
            this.itemCount = this.layoutNode.items.length;
            this.jsf.addItem({
                layoutNode: this.layoutNode.items[index],
                layoutIndex: this.layoutIndex.concat(index),
                dataIndex: this.dataIndex.concat(index)
            });
            this.updateControl();
        }
        
        this.selectedItem = index;
    };
    TabsComponent.prototype.updateControl = function () {
        var lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
        if (lastItem.type === '$ref' &&
            this.itemCount >= (lastItem.options.maxItems || 1000)) {
            this.showAddTab = false;
        }
    };
    TabsComponent.prototype.setTabTitle = function (item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    };
    TabsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'tabs-widget',
                    template: "\n    <ul\n      [class]=\"options?.labelHtmlClass || ''\">\n      <li *ngFor=\"let item of layoutNode?.items; let i = index\"\n        [class]=\"(options?.itemLabelHtmlClass || '') + (selectedItem === i ?\n          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n          (' ' + options?.style?.unselected))\"\n        role=\"presentation\"\n        data-tabs>\n        <a *ngIf=\"showAddTab || item.type !== '$ref'\"\n           [class]=\"'nav-link' + (selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :\n            (' ' + options?.style?.unselected))\"\n          [innerHTML]=\"setTabTitle(item, i)\"\n          (click)=\"select(i)\"></a>\n      </li>\n    </ul>\n\n    <div *ngFor=\"let layoutItem of layoutNode?.items; let i = index\"\n      [class]=\"options?.htmlClass || ''\">\n\n      <select-framework-widget *ngIf=\"selectedItem === i\"\n        [class]=\"(options?.fieldHtmlClass || '') +\n          ' ' + (options?.activeClass || '') +\n          ' ' + (options?.style?.selected || '')\"\n        [dataIndex]=\"layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex\"\n        [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n        [layoutNode]=\"layoutItem\"></select-framework-widget>\n\n    </div>",
                    styles: [" a { cursor: pointer; } "],
                },] },
    ];
    TabsComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    TabsComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return TabsComponent;
}());

var TemplateComponent = (function () {
    function TemplateComponent(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    TemplateComponent.prototype.ngOnInit = function () {
        this.updateComponent();
    };
    TemplateComponent.prototype.ngOnChanges = function () {
        this.updateComponent();
    };
    TemplateComponent.prototype.updateComponent = function () {
        if (!this.newComponent && this.layoutNode.options.template) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.options.template));
        }
        if (this.newComponent) {
            for (var _i = 0, _a = ['layoutNode', 'layoutIndex', 'dataIndex']; _i < _a.length; _i++) {
                var input = _a[_i];
                this.newComponent.instance[input] = this[input];
            }
        }
    };
    TemplateComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'template-widget',
                    template: "<div #widgetContainer></div>",
                },] },
    ];
    TemplateComponent.ctorParameters = function () { return [
        { type: core.ComponentFactoryResolver },
        { type: JsonSchemaFormService }
    ]; };
    TemplateComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }],
        widgetContainer: [{ type: core.ViewChild, args: ['widgetContainer', { read: core.ViewContainerRef },] }]
    };
    return TemplateComponent;
}());

var TextareaComponent = (function () {
    function TextareaComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    TextareaComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    TextareaComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    TextareaComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'textarea-widget',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <textarea *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [attr.placeholder]=\"options?.placeholder\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"></textarea>\n      <textarea *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [attr.placeholder]=\"options?.placeholder\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [value]=\"controlValue\"\n        (input)=\"updateValue($event)\">{{controlValue}}</textarea>\n    </div>",
                },] },
    ];
    TextareaComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    TextareaComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return TextareaComponent;
}());

var WidgetLibraryService = (function () {
    function WidgetLibraryService() {
        this.defaultWidget = 'text';
        this.widgetLibrary = {
            'none': NoneComponent,
            'root': RootComponent,
            'select-framework': SelectFrameworkComponent,
            'select-widget': SelectWidgetComponent,
            '$ref': AddReferenceComponent,
            'email': 'text',
            'integer': 'number',
            'number': NumberComponent,
            'password': 'text',
            'search': 'text',
            'tel': 'text',
            'text': InputComponent,
            'url': 'text',
            'color': 'text',
            'date': 'text',
            'datetime': 'text',
            'datetime-local': 'text',
            'month': 'text',
            'range': 'number',
            'time': 'text',
            'week': 'text',
            'checkbox': CheckboxComponent,
            'file': FileComponent,
            'hidden': 'text',
            'image': 'text',
            'radio': 'radios',
            'reset': 'submit',
            'submit': SubmitComponent,
            'button': ButtonComponent,
            'select': SelectComponent,
            'textarea': TextareaComponent,
            'checkboxes': CheckboxesComponent,
            'checkboxes-inline': 'checkboxes',
            'checkboxbuttons': 'checkboxes',
            'radios': RadiosComponent,
            'radios-inline': 'radios',
            'radiobuttons': 'radios',
            'section': SectionComponent,
            'div': 'section',
            'fieldset': 'section',
            'flex': 'section',
            'one-of': OneOfComponent,
            'array': 'section',
            'tabarray': 'tabs',
            'tab': 'section',
            'tabs': TabsComponent,
            'message': MessageComponent,
            'help': 'message',
            'msg': 'message',
            'html': 'message',
            'template': TemplateComponent,
            'advancedfieldset': 'section',
            'authfieldset': 'section',
            'optionfieldset': 'one-of',
            'selectfieldset': 'one-of',
            'conditional': 'section',
            'actions': 'section',
            'tagsinput': 'section',
            'updown': 'number',
            'date-time': 'datetime-local',
            'alt-datetime': 'datetime-local',
            'alt-date': 'date',
            'wizard': 'section',
            'textline': 'text',
        };
        this.registeredWidgets = {};
        this.frameworkWidgets = {};
        this.activeWidgets = {};
        this.setActiveWidgets();
    }
    WidgetLibraryService.prototype.setActiveWidgets = function () {
        this.activeWidgets = Object.assign({}, this.widgetLibrary, this.frameworkWidgets, this.registeredWidgets);
        for (var _i = 0, _a = Object.keys(this.activeWidgets); _i < _a.length; _i++) {
            var widgetName = _a[_i];
            var widget = this.activeWidgets[widgetName];
            if (typeof widget === 'string') {
                var usedAliases = [];
                while (typeof widget === 'string' && !usedAliases.includes(widget)) {
                    usedAliases.push(widget);
                    widget = this.activeWidgets[widget];
                }
                if (typeof widget !== 'string') {
                    this.activeWidgets[widgetName] = widget;
                }
            }
        }
        return true;
    };
    WidgetLibraryService.prototype.setDefaultWidget = function (type) {
        if (!this.hasWidget(type)) {
            return false;
        }
        this.defaultWidget = type;
        return true;
    };
    WidgetLibraryService.prototype.hasWidget = function (type, widgetSet) {
        if (widgetSet === void 0) { widgetSet = 'activeWidgets'; }
        if (!type || typeof type !== 'string') {
            return false;
        }
        return hasOwn(this[widgetSet], type);
    };
    WidgetLibraryService.prototype.hasDefaultWidget = function (type) {
        return this.hasWidget(type, 'widgetLibrary');
    };
    WidgetLibraryService.prototype.registerWidget = function (type, widget) {
        if (!type || !widget || typeof type !== 'string') {
            return false;
        }
        this.registeredWidgets[type] = widget;
        return this.setActiveWidgets();
    };
    WidgetLibraryService.prototype.unRegisterWidget = function (type) {
        if (!hasOwn(this.registeredWidgets, type)) {
            return false;
        }
        delete this.registeredWidgets[type];
        return this.setActiveWidgets();
    };
    WidgetLibraryService.prototype.unRegisterAllWidgets = function (unRegisterFrameworkWidgets) {
        if (unRegisterFrameworkWidgets === void 0) { unRegisterFrameworkWidgets = true; }
        this.registeredWidgets = {};
        if (unRegisterFrameworkWidgets) {
            this.frameworkWidgets = {};
        }
        return this.setActiveWidgets();
    };
    WidgetLibraryService.prototype.registerFrameworkWidgets = function (widgets) {
        if (widgets === null || typeof widgets !== 'object') {
            widgets = {};
        }
        this.frameworkWidgets = widgets;
        return this.setActiveWidgets();
    };
    WidgetLibraryService.prototype.unRegisterFrameworkWidgets = function () {
        if (Object.keys(this.frameworkWidgets).length) {
            this.frameworkWidgets = {};
            return this.setActiveWidgets();
        }
        return false;
    };
    WidgetLibraryService.prototype.getWidget = function (type, widgetSet) {
        if (widgetSet === void 0) { widgetSet = 'activeWidgets'; }
        if (this.hasWidget(type, widgetSet)) {
            return this[widgetSet][type];
        }
        else if (this.hasWidget(this.defaultWidget, widgetSet)) {
            return this[widgetSet][this.defaultWidget];
        }
        else {
            return null;
        }
    };
    WidgetLibraryService.prototype.getAllWidgets = function () {
        return {
            widgetLibrary: this.widgetLibrary,
            registeredWidgets: this.registeredWidgets,
            frameworkWidgets: this.frameworkWidgets,
            activeWidgets: this.activeWidgets,
        };
    };
    WidgetLibraryService.decorators = [
        { type: core.Injectable },
    ];
    WidgetLibraryService.ctorParameters = function () { return []; };
    return WidgetLibraryService;
}());

var Framework = (function () {
    function Framework() {
        this.widgets = {};
        this.stylesheets = [];
        this.scripts = [];
    }
    Framework.decorators = [
        { type: core.Injectable },
    ];
    return Framework;
}());

var FrameworkLibraryService = (function () {
    function FrameworkLibraryService(frameworks, widgetLibrary) {
        var _this = this;
        this.frameworks = frameworks;
        this.widgetLibrary = widgetLibrary;
        this.activeFramework = null;
        this.loadExternalAssets = false;
        this.frameworkLibrary = {};
        this.frameworks.forEach(function (framework) {
            return _this.frameworkLibrary[framework.name] = framework;
        });
        this.defaultFramework = this.frameworks[0].name;
        this.setFramework(this.defaultFramework);
    }
    FrameworkLibraryService.prototype.setLoadExternalAssets = function (loadExternalAssets) {
        if (loadExternalAssets === void 0) { loadExternalAssets = true; }
        this.loadExternalAssets = !!loadExternalAssets;
    };
    FrameworkLibraryService.prototype.setFramework = function (framework, loadExternalAssets) {
        if (framework === void 0) { framework = this.defaultFramework; }
        if (loadExternalAssets === void 0) { loadExternalAssets = this.loadExternalAssets; }
        this.activeFramework =
            typeof framework === 'string' && this.hasFramework(framework) ?
                this.frameworkLibrary[framework] :
                typeof framework === 'object' && hasOwn(framework, 'framework') ?
                    framework :
                    this.frameworkLibrary[this.defaultFramework];
        return this.registerFrameworkWidgets(this.activeFramework);
    };
    FrameworkLibraryService.prototype.registerFrameworkWidgets = function (framework) {
        return hasOwn(framework, 'widgets') ?
            this.widgetLibrary.registerFrameworkWidgets(framework.widgets) :
            this.widgetLibrary.unRegisterFrameworkWidgets();
    };
    FrameworkLibraryService.prototype.hasFramework = function (type) {
        return hasOwn(this.frameworkLibrary, type);
    };
    FrameworkLibraryService.prototype.getFramework = function () {
        if (!this.activeFramework) {
            this.setFramework('default', true);
        }
        return this.activeFramework.framework;
    };
    FrameworkLibraryService.prototype.getFrameworkWidgets = function () {
        return this.activeFramework.widgets || {};
    };
    FrameworkLibraryService.prototype.getFrameworkStylesheets = function (load) {
        if (load === void 0) { load = this.loadExternalAssets; }
        return (load && this.activeFramework.stylesheets) || [];
    };
    FrameworkLibraryService.prototype.getFrameworkScripts = function (load) {
        if (load === void 0) { load = this.loadExternalAssets; }
        return (load && this.activeFramework.scripts) || [];
    };
    FrameworkLibraryService.decorators = [
        { type: core.Injectable },
    ];
    FrameworkLibraryService.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: core.Inject, args: [Framework,] }] },
        { type: WidgetLibraryService, decorators: [{ type: core.Inject, args: [WidgetLibraryService,] }] }
    ]; };
    return FrameworkLibraryService;
}());

var JSON_SCHEMA_FORM_VALUE_ACCESSOR = {
    provide: forms.NG_VALUE_ACCESSOR,
    useExisting: core.forwardRef(function () { return JsonSchemaFormComponent; }),
    multi: true,
};
var JsonSchemaFormComponent = (function () {
    function JsonSchemaFormComponent(changeDetector, frameworkLibrary, widgetLibrary, jsf, sanitizer) {
        this.changeDetector = changeDetector;
        this.frameworkLibrary = frameworkLibrary;
        this.widgetLibrary = widgetLibrary;
        this.jsf = jsf;
        this.sanitizer = sanitizer;
        this.formValueSubscription = null;
        this.formInitialized = false;
        this.objectWrap = false;
        this.previousInputs = {
            schema: null, layout: null, data: null, options: null, framework: null,
            widgets: null, form: null, model: null, JSONSchema: null, UISchema: null,
            formData: null, loadExternalAssets: null, debug: null,
        };
        this.onChanges = new core.EventEmitter();
        this.onSubmit = new core.EventEmitter();
        this.isValid = new core.EventEmitter();
        this.validationErrors = new core.EventEmitter();
        this.formSchema = new core.EventEmitter();
        this.formLayout = new core.EventEmitter();
        this.dataChange = new core.EventEmitter();
        this.modelChange = new core.EventEmitter();
        this.formDataChange = new core.EventEmitter();
        this.ngModelChange = new core.EventEmitter();
    }
    Object.defineProperty(JsonSchemaFormComponent.prototype, "value", {
        get: function () {
            return this.objectWrap ? this.jsf.data['1'] : this.jsf.data;
        },
        set: function (value) {
            this.setFormValues(value, false);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(JsonSchemaFormComponent.prototype, "stylesheets", {
        get: function () {
            var stylesheets = this.frameworkLibrary.getFrameworkStylesheets();
            var load = this.sanitizer.bypassSecurityTrustResourceUrl;
            return stylesheets.map(function (stylesheet) { return load(stylesheet); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonSchemaFormComponent.prototype, "scripts", {
        get: function () {
            var scripts = this.frameworkLibrary.getFrameworkScripts();
            var load = this.sanitizer.bypassSecurityTrustResourceUrl;
            return scripts.map(function (script) { return load(script); });
        },
        enumerable: true,
        configurable: true
    });
    JsonSchemaFormComponent.prototype.ngOnInit = function () {
        this.updateForm();
    };
    JsonSchemaFormComponent.prototype.ngOnChanges = function () {
        this.updateForm();
    };
    JsonSchemaFormComponent.prototype.writeValue = function (value) {
        this.setFormValues(value, false);
        if (!this.formValuesInput) {
            this.formValuesInput = 'ngModel';
        }
    };
    JsonSchemaFormComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    JsonSchemaFormComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    JsonSchemaFormComponent.prototype.setDisabledState = function (isDisabled) {
        if (this.jsf.formOptions.formDisabled !== !!isDisabled) {
            this.jsf.formOptions.formDisabled = !!isDisabled;
            this.initializeForm();
        }
    };
    JsonSchemaFormComponent.prototype.updateForm = function () {
        var _this = this;
        if (!this.formInitialized || !this.formValuesInput ||
            (this.language && this.language !== this.jsf.language)) {
            this.initializeForm();
        }
        else {
            if (this.language && this.language !== this.jsf.language) {
                this.jsf.setLanguage(this.language);
            }
            var changedInput = Object.keys(this.previousInputs)
                .filter(function (input) { return _this.previousInputs[input] !== _this[input]; });
            var resetFirst = true;
            if (changedInput.length === 1 && changedInput[0] === 'form' &&
                this.formValuesInput.startsWith('form.')) {
                changedInput = Object.keys(this.previousInputs.form || {})
                    .filter(function (key) { return !_.isEqual(_this.previousInputs.form[key], _this.form[key]); })
                    .map(function (key) { return "form." + key; });
                resetFirst = false;
            }
            if (changedInput.length === 1 && changedInput[0] === this.formValuesInput) {
                if (this.formValuesInput.indexOf('.') === -1) {
                    this.setFormValues(this[this.formValuesInput], resetFirst);
                }
                else {
                    var _a = this.formValuesInput.split('.'), input = _a[0], key = _a[1];
                    this.setFormValues(this[input][key], resetFirst);
                }
            }
            else if (changedInput.length) {
                this.initializeForm();
                if (this.onChange) {
                    this.onChange(this.jsf.formValues);
                }
                if (this.onTouched) {
                    this.onTouched(this.jsf.formValues);
                }
            }
            Object.keys(this.previousInputs)
                .filter(function (input) { return _this.previousInputs[input] !== _this[input]; })
                .forEach(function (input) { return _this.previousInputs[input] = _this[input]; });
        }
    };
    JsonSchemaFormComponent.prototype.setFormValues = function (formValues, resetFirst) {
        if (resetFirst === void 0) { resetFirst = true; }
        if (formValues) {
            var newFormValues = this.objectWrap ? formValues['1'] : formValues;
            if (!this.jsf.formGroup) {
                this.jsf.formValues = formValues;
                this.activateForm();
            }
            else if (resetFirst) {
                this.jsf.formGroup.reset();
            }
            if (this.jsf.formGroup) {
                this.jsf.formGroup.patchValue(newFormValues);
            }
            if (this.onChange) {
                this.onChange(newFormValues);
            }
            if (this.onTouched) {
                this.onTouched(newFormValues);
            }
        }
        else {
            this.jsf.formGroup.reset();
        }
    };
    JsonSchemaFormComponent.prototype.submitForm = function () {
        var validData = this.jsf.validData;
        this.onSubmit.emit(this.objectWrap ? validData['1'] : validData);
    };
    JsonSchemaFormComponent.prototype.initializeForm = function () {
        if (this.schema || this.layout || this.data || this.form || this.model ||
            this.JSONSchema || this.UISchema || this.formData || this.ngModel ||
            this.jsf.data) {
            this.jsf.resetAllValues();
            this.initializeOptions();
            this.initializeSchema();
            this.initializeLayout();
            this.initializeData();
            this.activateForm();
            if (this.debug || this.jsf.formOptions.debug) {
                var vars = [];
                this.debugOutput = vars.map(function (v) { return JSON.stringify(v, null, 2); }).join('\n');
            }
            this.formInitialized = true;
        }
    };
    JsonSchemaFormComponent.prototype.initializeOptions = function () {
        if (this.language && this.language !== this.jsf.language) {
            this.jsf.setLanguage(this.language);
        }
        this.jsf.setOptions({ debug: !!this.debug });
        var loadExternalAssets = this.loadExternalAssets || false;
        var framework = this.framework || 'default';
        if (isObject(this.options)) {
            this.jsf.setOptions(this.options);
            loadExternalAssets = this.options.loadExternalAssets || loadExternalAssets;
            framework = this.options.framework || framework;
        }
        if (isObject(this.form) && isObject(this.form.options)) {
            this.jsf.setOptions(this.form.options);
            loadExternalAssets = this.form.options.loadExternalAssets || loadExternalAssets;
            framework = this.form.options.framework || framework;
        }
        if (isObject(this.widgets)) {
            this.jsf.setOptions({ widgets: this.widgets });
        }
        this.frameworkLibrary.setLoadExternalAssets(loadExternalAssets);
        this.frameworkLibrary.setFramework(framework);
        this.jsf.framework = this.frameworkLibrary.getFramework();
        if (isObject(this.jsf.formOptions.widgets)) {
            for (var _i = 0, _a = Object.keys(this.jsf.formOptions.widgets); _i < _a.length; _i++) {
                var widget = _a[_i];
                this.widgetLibrary.registerWidget(widget, this.jsf.formOptions.widgets[widget]);
            }
        }
        if (isObject(this.form) && isObject(this.form.tpldata)) {
            this.jsf.setTpldata(this.form.tpldata);
        }
    };
    JsonSchemaFormComponent.prototype.initializeSchema = function () {
        if (isObject(this.schema)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.schema = _.cloneDeep(this.schema);
        }
        else if (hasOwn(this.form, 'schema') && isObject(this.form.schema)) {
            this.jsf.schema = _.cloneDeep(this.form.schema);
        }
        else if (isObject(this.JSONSchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.schema = _.cloneDeep(this.JSONSchema);
        }
        else if (hasOwn(this.form, 'JSONSchema') && isObject(this.form.JSONSchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.schema = _.cloneDeep(this.form.JSONSchema);
        }
        else if (hasOwn(this.form, 'properties') && isObject(this.form.properties)) {
            this.jsf.schema = _.cloneDeep(this.form);
        }
        else if (isObject(this.form)) {
        }
        if (!isEmpty(this.jsf.schema)) {
            if (inArray('object', this.jsf.schema.type)) {
                this.jsf.schema.type = 'object';
            }
            if (hasOwn(this.jsf.schema, 'type') && this.jsf.schema.type !== 'object') {
                this.jsf.schema = {
                    'type': 'object',
                    'properties': { 1: this.jsf.schema }
                };
                this.objectWrap = true;
            }
            else if (!hasOwn(this.jsf.schema, 'type')) {
                if (isObject(this.jsf.schema.properties) ||
                    isObject(this.jsf.schema.patternProperties) ||
                    isObject(this.jsf.schema.additionalProperties)) {
                    this.jsf.schema.type = 'object';
                }
                else {
                    this.jsf.JsonFormCompatibility = true;
                    this.jsf.schema = {
                        'type': 'object',
                        'properties': this.jsf.schema
                    };
                }
            }
            this.jsf.schema = convertSchemaToDraft6(this.jsf.schema);
            this.jsf.compileAjvSchema();
            this.jsf.schema = resolveSchemaReferences(this.jsf.schema, this.jsf.schemaRefLibrary, this.jsf.schemaRecursiveRefMap, this.jsf.dataRecursiveRefMap, this.jsf.arrayMap);
            if (hasOwn(this.jsf.schemaRefLibrary, '')) {
                this.jsf.hasRootReference = true;
            }
        }
    };
    JsonSchemaFormComponent.prototype.initializeData = function () {
        if (hasValue(this.data)) {
            this.jsf.formValues = _.cloneDeep(this.data);
            this.formValuesInput = 'data';
        }
        else if (hasValue(this.model)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.model);
            this.formValuesInput = 'model';
        }
        else if (hasValue(this.ngModel)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.ngModel);
            this.formValuesInput = 'ngModel';
        }
        else if (isObject(this.form) && hasValue(this.form.value)) {
            this.jsf.JsonFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.form.value);
            this.formValuesInput = 'form.value';
        }
        else if (isObject(this.form) && hasValue(this.form.data)) {
            this.jsf.formValues = _.cloneDeep(this.form.data);
            this.formValuesInput = 'form.data';
        }
        else if (hasValue(this.formData)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.formValuesInput = 'formData';
        }
        else if (hasOwn(this.form, 'formData') && hasValue(this.form.formData)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.form.formData);
            this.formValuesInput = 'form.formData';
        }
        else {
            this.formValuesInput = null;
        }
    };
    JsonSchemaFormComponent.prototype.initializeLayout = function () {
        var _this = this;
        var fixJsonFormOptions = function (layout) {
            if (isObject(layout) || isArray(layout)) {
                forEach(layout, function (value, key) {
                    if (hasOwn(value, 'options') && isObject(value.options)) {
                        value.titleMap = value.options;
                        delete value.options;
                    }
                }, 'top-down');
            }
            return layout;
        };
        if (isArray(this.layout)) {
            this.jsf.layout = _.cloneDeep(this.layout);
        }
        else if (isArray(this.form)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.layout = _.cloneDeep(this.form);
        }
        else if (this.form && isArray(this.form.form)) {
            this.jsf.JsonFormCompatibility = true;
            this.jsf.layout = fixJsonFormOptions(_.cloneDeep(this.form.form));
        }
        else if (this.form && isArray(this.form.layout)) {
            this.jsf.layout = _.cloneDeep(this.form.layout);
        }
        else {
            this.jsf.layout = ['*'];
        }
        var alternateLayout = null;
        if (isObject(this.UISchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = _.cloneDeep(this.UISchema);
        }
        else if (hasOwn(this.form, 'UISchema')) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = _.cloneDeep(this.form.UISchema);
        }
        else if (hasOwn(this.form, 'uiSchema')) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = _.cloneDeep(this.form.uiSchema);
        }
        else if (hasOwn(this.form, 'customFormItems')) {
            this.jsf.JsonFormCompatibility = true;
            alternateLayout = fixJsonFormOptions(_.cloneDeep(this.form.customFormItems));
        }
        if (alternateLayout) {
            JsonPointer.forEachDeep(alternateLayout, function (value, pointer) {
                var schemaPointer = pointer
                    .replace(/\//g, '/properties/')
                    .replace(/\/properties\/items\/properties\//g, '/items/properties/')
                    .replace(/\/properties\/titleMap\/properties\//g, '/titleMap/properties/');
                if (hasValue(value) && hasValue(pointer)) {
                    var key = JsonPointer.toKey(pointer);
                    var groupPointer = (JsonPointer.parse(schemaPointer) || []).slice(0, -2);
                    var itemPointer = void 0;
                    if (key.toLowerCase() === 'ui:order') {
                        itemPointer = groupPointer.concat(['ui:order']);
                    }
                    else {
                        if (key.slice(0, 3).toLowerCase() === 'ui:') {
                            key = key.slice(3);
                        }
                        itemPointer = groupPointer.concat(['x-schema-form', key]);
                    }
                    if (JsonPointer.has(_this.jsf.schema, groupPointer) &&
                        !JsonPointer.has(_this.jsf.schema, itemPointer)) {
                        JsonPointer.set(_this.jsf.schema, itemPointer, value);
                    }
                }
            });
        }
    };
    JsonSchemaFormComponent.prototype.activateForm = function () {
        var _this = this;
        if (isEmpty(this.jsf.schema)) {
            if (!isEmpty(this.jsf.formValues)) {
                this.jsf.buildSchemaFromData();
            }
        }
        if (!isEmpty(this.jsf.schema)) {
            this.jsf.compileAjvSchema();
            this.jsf.buildLayout(this.widgetLibrary);
            this.jsf.buildFormGroupTemplate(this.jsf.formValues);
            this.jsf.buildFormGroup();
        }
        if (this.jsf.formGroup) {
            if (!isEmpty(this.jsf.formValues) &&
                this.jsf.formOptions.setSchemaDefaults !== true &&
                this.jsf.formOptions.setLayoutDefaults !== true) {
                this.setFormValues(this.jsf.formValues);
            }
            this.jsf.dataChanges.subscribe(function (data) {
                _this.onChanges.emit(_this.objectWrap ? data['1'] : data);
                if (_this.formValuesInput && _this.formValuesInput.indexOf('.') === -1) {
                    _this[_this.formValuesInput + "Change"].emit(_this.objectWrap ? data['1'] : data);
                }
            });
            this.jsf.formGroup.statusChanges.subscribe(function () { return _this.changeDetector.markForCheck(); });
            this.jsf.isValidChanges.subscribe(function (isValid) { return _this.isValid.emit(isValid); });
            this.jsf.validationErrorChanges.subscribe(function (err) { return _this.validationErrors.emit(err); });
            this.formSchema.emit(this.jsf.schema);
            this.formLayout.emit(this.jsf.layout);
            this.onChanges.emit(this.objectWrap ? this.jsf.data['1'] : this.jsf.data);
            var validateOnRender_1 = JsonPointer.get(this.jsf, '/formOptions/validateOnRender');
            if (validateOnRender_1) {
                var touchAll_1 = function (control) {
                    if (validateOnRender_1 === true || hasValue(control.value)) {
                        control.markAsTouched();
                    }
                    Object.keys(control.controls || {})
                        .forEach(function (key) { return touchAll_1(control.controls[key]); });
                };
                touchAll_1(this.jsf.formGroup);
                this.isValid.emit(this.jsf.isValid);
                this.validationErrors.emit(this.jsf.ajvErrors);
            }
        }
    };
    JsonSchemaFormComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'json-schema-form',
                    template: "\n    <div *ngFor=\"let stylesheet of stylesheets\">\n      <link rel=\"stylesheet\" [href]=\"stylesheet\">\n    </div>\n    <div *ngFor=\"let script of scripts\">\n      <script type=\"text/javascript\" [src]=\"script\"></script>\n    </div>\n    <form class=\"json-schema-form\" (ngSubmit)=\"submitForm()\">\n      <root-widget [layout]=\"jsf?.layout\"></root-widget>\n    </form>\n    <div *ngIf=\"debug || jsf?.formOptions?.debug\">\n      Debug output: <pre>{{debugOutput}}</pre>\n    </div>",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    providers: [JsonSchemaFormService, JSON_SCHEMA_FORM_VALUE_ACCESSOR],
                },] },
    ];
    JsonSchemaFormComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef },
        { type: FrameworkLibraryService },
        { type: WidgetLibraryService },
        { type: JsonSchemaFormService },
        { type: platformBrowser.DomSanitizer }
    ]; };
    JsonSchemaFormComponent.propDecorators = {
        schema: [{ type: core.Input }],
        layout: [{ type: core.Input }],
        data: [{ type: core.Input }],
        options: [{ type: core.Input }],
        framework: [{ type: core.Input }],
        widgets: [{ type: core.Input }],
        form: [{ type: core.Input }],
        model: [{ type: core.Input }],
        JSONSchema: [{ type: core.Input }],
        UISchema: [{ type: core.Input }],
        formData: [{ type: core.Input }],
        ngModel: [{ type: core.Input }],
        language: [{ type: core.Input }],
        loadExternalAssets: [{ type: core.Input }],
        debug: [{ type: core.Input }],
        value: [{ type: core.Input }],
        onChanges: [{ type: core.Output }],
        onSubmit: [{ type: core.Output }],
        isValid: [{ type: core.Output }],
        validationErrors: [{ type: core.Output }],
        formSchema: [{ type: core.Output }],
        formLayout: [{ type: core.Output }],
        dataChange: [{ type: core.Output }],
        modelChange: [{ type: core.Output }],
        formDataChange: [{ type: core.Output }],
        ngModelChange: [{ type: core.Output }]
    };
    return JsonSchemaFormComponent;
}());

var HiddenComponent = (function () {
    function HiddenComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    HiddenComponent.prototype.ngOnInit = function () {
        this.jsf.initializeControl(this);
    };
    HiddenComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'hidden-widget',
                    template: "\n    <input *ngIf=\"boundControl\"\n      [formControl]=\"formControl\"\n      [id]=\"'control' + layoutNode?._id\"\n      [name]=\"controlName\"\n      type=\"hidden\">\n    <input *ngIf=\"!boundControl\"\n      [disabled]=\"controlDisabled\"\n      [name]=\"controlName\"\n      [id]=\"'control' + layoutNode?._id\"\n      type=\"hidden\"\n      [value]=\"controlValue\">",
                },] },
    ];
    HiddenComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    HiddenComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return HiddenComponent;
}());

var TabComponent = (function () {
    function TabComponent(jsf) {
        this.jsf = jsf;
    }
    TabComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
    };
    TabComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'tab-widget',
                    template: "\n    <div [class]=\"options?.htmlClass || ''\">\n      <root-widget\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [layout]=\"layoutNode.items\"></root-widget>\n    </div>",
                },] },
    ];
    TabComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    TabComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return TabComponent;
}());

var BASIC_WIDGETS = [
    AddReferenceComponent, OneOfComponent, ButtonComponent, CheckboxComponent,
    CheckboxesComponent, FileComponent, HiddenComponent, InputComponent,
    MessageComponent, NoneComponent, NumberComponent, RadiosComponent,
    RootComponent, SectionComponent, SelectComponent, SelectFrameworkComponent,
    SelectWidgetComponent, SubmitComponent, TabComponent, TabsComponent,
    TemplateComponent, TextareaComponent
];

var WidgetLibraryModule = (function () {
    function WidgetLibraryModule() {
    }
    WidgetLibraryModule.forRoot = function () {
        return {
            ngModule: WidgetLibraryModule,
            providers: [JsonSchemaFormService]
        };
    };
    WidgetLibraryModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule],
                    declarations: BASIC_WIDGETS.concat([OrderableDirective]),
                    exports: BASIC_WIDGETS.concat([OrderableDirective]),
                    entryComponents: BASIC_WIDGETS.slice(),
                    providers: [JsonSchemaFormService]
                },] },
    ];
    return WidgetLibraryModule;
}());

var NoFrameworkComponent = (function () {
    function NoFrameworkComponent() {
    }
    NoFrameworkComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'no-framework',
                    template: "\n    <select-widget-widget\n      [dataIndex]=\"dataIndex\"\n      [layoutIndex]=\"layoutIndex\"\n      [layoutNode]=\"layoutNode\"></select-widget-widget>",
                },] },
    ];
    NoFrameworkComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return NoFrameworkComponent;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NoFramework = (function (_super) {
    __extends$1(NoFramework, _super);
    function NoFramework() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'no-framework';
        _this.framework = NoFrameworkComponent;
        return _this;
    }
    NoFramework.decorators = [
        { type: core.Injectable },
    ];
    return NoFramework;
}(Framework));

var NoFrameworkModule = (function () {
    function NoFrameworkModule() {
    }
    NoFrameworkModule.forRoot = function () {
        return {
            ngModule: NoFrameworkModule,
            providers: [
                { provide: Framework, useClass: NoFramework, multi: true }
            ]
        };
    };
    NoFrameworkModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, WidgetLibraryModule],
                    declarations: [NoFrameworkComponent],
                    exports: [NoFrameworkComponent],
                    entryComponents: [NoFrameworkComponent]
                },] },
    ];
    return NoFrameworkModule;
}());

var JsonSchemaFormModule = (function () {
    function JsonSchemaFormModule() {
    }
    JsonSchemaFormModule.forRoot = function () {
        var frameworks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            frameworks[_i] = arguments[_i];
        }
        var loadFrameworks = frameworks.length ?
            frameworks.map(function (framework) { return framework.forRoot().providers[0]; }) :
            [{ provide: Framework, useClass: NoFramework, multi: true }];
        return {
            ngModule: JsonSchemaFormModule,
            providers: [
                JsonSchemaFormService, FrameworkLibraryService, WidgetLibraryService
            ].concat(loadFrameworks)
        };
    };
    JsonSchemaFormModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule,
                        WidgetLibraryModule, NoFrameworkModule
                    ],
                    declarations: [JsonSchemaFormComponent],
                    exports: [JsonSchemaFormComponent, WidgetLibraryModule]
                },] },
    ];
    return JsonSchemaFormModule;
}());

var FlexLayoutRootComponent = (function () {
    function FlexLayoutRootComponent(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    FlexLayoutRootComponent.prototype.removeItem = function (item) {
        this.jsf.removeItem(item);
    };
    FlexLayoutRootComponent.prototype.getFlexAttribute = function (node, attribute) {
        var index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    };
    FlexLayoutRootComponent.prototype.showWidget = function (layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    };
    FlexLayoutRootComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'flex-layout-root-widget',
                    template: "\n    <div *ngFor=\"let layoutNode of layout; let i = index\"\n      [class.form-flex-item]=\"isFlexItem\"\n      [style.flex-grow]=\"getFlexAttribute(layoutNode, 'flex-grow')\"\n      [style.flex-shrink]=\"getFlexAttribute(layoutNode, 'flex-shrink')\"\n      [style.flex-basis]=\"getFlexAttribute(layoutNode, 'flex-basis')\"\n      [style.align-self]=\"(layoutNode?.options || {})['align-self']\"\n      [style.order]=\"layoutNode?.options?.order\"\n      [fxFlex]=\"layoutNode?.options?.fxFlex\"\n      [fxFlexOrder]=\"layoutNode?.options?.fxFlexOrder\"\n      [fxFlexOffset]=\"layoutNode?.options?.fxFlexOffset\"\n      [fxFlexAlign]=\"layoutNode?.options?.fxFlexAlign\">\n      <select-framework-widget *ngIf=\"showWidget(layoutNode)\"\n        [dataIndex]=\"layoutNode?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])\"\n        [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n        [layoutNode]=\"layoutNode\"></select-framework-widget>\n    <div>",
                    changeDetection: core.ChangeDetectionStrategy.Default,
                },] },
    ];
    FlexLayoutRootComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    FlexLayoutRootComponent.propDecorators = {
        dataIndex: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        layout: [{ type: core.Input }],
        isFlexItem: [{ type: core.Input }]
    };
    return FlexLayoutRootComponent;
}());

var FlexLayoutSectionComponent = (function () {
    function FlexLayoutSectionComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.expanded = true;
        this.containerType = 'div';
    }
    Object.defineProperty(FlexLayoutSectionComponent.prototype, "sectionTitle", {
        get: function () {
            return this.options.notitle ? null : this.jsf.setItemTitle(this);
        },
        enumerable: true,
        configurable: true
    });
    FlexLayoutSectionComponent.prototype.ngOnInit = function () {
        this.jsf.initializeControl(this);
        this.options = this.layoutNode.options || {};
        this.expanded = typeof this.options.expanded === 'boolean' ?
            this.options.expanded : !this.options.expandable;
        switch (this.layoutNode.type) {
            case 'section':
            case 'array':
            case 'fieldset':
            case 'advancedfieldset':
            case 'authfieldset':
            case 'optionfieldset':
            case 'selectfieldset':
                this.containerType = 'fieldset';
                break;
            case 'card':
                this.containerType = 'card';
                break;
            case 'expansion-panel':
                this.containerType = 'expansion-panel';
                break;
            default:
                this.containerType = 'div';
        }
    };
    FlexLayoutSectionComponent.prototype.toggleExpanded = function () {
        if (this.options.expandable) {
            this.expanded = !this.expanded;
        }
    };
    FlexLayoutSectionComponent.prototype.getFlexAttribute = function (attribute) {
        var flexActive = this.layoutNode.type === 'flex' ||
            !!this.options.displayFlex ||
            this.options.display === 'flex';
        switch (attribute) {
            case 'is-flex':
                return flexActive;
            case 'display':
                return flexActive ? 'flex' : 'initial';
            case 'flex-direction':
            case 'flex-wrap':
                var index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
                return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
                    this.options[attribute] || ['column', 'nowrap'][index];
            case 'justify-content':
            case 'align-items':
            case 'align-content':
                return this.options[attribute];
            case 'layout':
                return (this.options.fxLayout || 'row') +
                    this.options.fxLayoutWrap ? ' ' + this.options.fxLayoutWrap : '';
        }
    };
    FlexLayoutSectionComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'flex-layout-section-widget',
                    template: "\n    <div *ngIf=\"containerType === 'div'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <label *ngIf=\"sectionTitle\"\n        [class]=\"'legend ' + (options?.labelHtmlClass || '')\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></label>\n      <flex-layout-root-widget *ngIf=\"expanded\"\n        [layout]=\"layoutNode.items\"\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [fxLayout]=\"getFlexAttribute('layout')\"\n        [fxLayoutGap]=\"options?.fxLayoutGap\"\n        [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n        [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>\n\n    <fieldset *ngIf=\"containerType === 'fieldset'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\"\n      [disabled]=\"options?.readonly\">\n      <legend *ngIf=\"sectionTitle\"\n        [class]=\"'legend ' + (options?.labelHtmlClass || '')\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></legend>\n      <flex-layout-root-widget *ngIf=\"expanded\"\n        [layout]=\"layoutNode.items\"\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [fxLayout]=\"getFlexAttribute('layout')\"\n        [fxLayoutGap]=\"options?.fxLayoutGap\"\n        [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n        [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </fieldset>\n\n    <mat-card *ngIf=\"containerType === 'card'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <mat-card-header *ngIf=\"sectionTitle\">\n        <legend\n          [class]=\"'legend ' + (options?.labelHtmlClass || '')\"\n          [innerHTML]=\"sectionTitle\"\n          (click)=\"toggleExpanded()\"></legend>\n      </mat-card-header>\n      <mat-card-content *ngIf=\"expanded\">\n        <fieldset [disabled]=\"options?.readonly\">\n          <flex-layout-root-widget *ngIf=\"expanded\"\n            [layout]=\"layoutNode.items\"\n            [dataIndex]=\"dataIndex\"\n            [layoutIndex]=\"layoutIndex\"\n            [isFlexItem]=\"getFlexAttribute('is-flex')\"\n            [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n            [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n            [style.display]=\"getFlexAttribute('display')\"\n            [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n            [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n            [style.justify-content]=\"getFlexAttribute('justify-content')\"\n            [style.align-items]=\"getFlexAttribute('align-items')\"\n            [style.align-content]=\"getFlexAttribute('align-content')\"\n            [fxLayout]=\"getFlexAttribute('layout')\"\n            [fxLayoutGap]=\"options?.fxLayoutGap\"\n            [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n            [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n          </fieldset>\n      </mat-card-content>\n      <mat-card-footer>\n        <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n          [innerHTML]=\"options?.errorMessage\"></mat-error>\n      </mat-card-footer>\n    </mat-card>\n\n    <mat-expansion-panel *ngIf=\"containerType === 'expansion-panel'\"\n      [expanded]=\"expanded\"\n      [hideToggle]=\"!options?.expandable\">\n      <mat-expansion-panel-header>\n        <mat-panel-title>\n          <legend *ngIf=\"sectionTitle\"\n            [class]=\"options?.labelHtmlClass\"\n            [innerHTML]=\"sectionTitle\"\n            (click)=\"toggleExpanded()\"></legend>\n        </mat-panel-title>\n      </mat-expansion-panel-header>\n      <fieldset [disabled]=\"options?.readonly\">\n        <flex-layout-root-widget *ngIf=\"expanded\"\n          [layout]=\"layoutNode.items\"\n          [dataIndex]=\"dataIndex\"\n          [layoutIndex]=\"layoutIndex\"\n          [isFlexItem]=\"getFlexAttribute('is-flex')\"\n          [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n          [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n          [style.display]=\"getFlexAttribute('display')\"\n          [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n          [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n          [style.justify-content]=\"getFlexAttribute('justify-content')\"\n          [style.align-items]=\"getFlexAttribute('align-items')\"\n          [style.align-content]=\"getFlexAttribute('align-content')\"\n          [fxLayout]=\"getFlexAttribute('layout')\"\n          [fxLayoutGap]=\"options?.fxLayoutGap\"\n          [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n          [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n      </fieldset>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </mat-expansion-panel>",
                    styles: ["\n    fieldset { border: 0; margin: 0; padding: 0; }\n    .legend { font-weight: bold; }\n    .expandable > .legend:before { content: '\u25B6'; padding-right: .3em; }\n    .expanded > .legend:before { content: '\u25BC'; padding-right: .2em; }\n  "],
                },] },
    ];
    FlexLayoutSectionComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    FlexLayoutSectionComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return FlexLayoutSectionComponent;
}());

var MaterialAddReferenceComponent = (function () {
    function MaterialAddReferenceComponent(jsf) {
        this.jsf = jsf;
    }
    MaterialAddReferenceComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
    };
    Object.defineProperty(MaterialAddReferenceComponent.prototype, "showAddButton", {
        get: function () {
            return !this.layoutNode.arrayItem ||
                this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    MaterialAddReferenceComponent.prototype.addItem = function (event) {
        event.preventDefault();
        this.jsf.addItem(this);
    };
    Object.defineProperty(MaterialAddReferenceComponent.prototype, "buttonText", {
        get: function () {
            var parent = {
                dataIndex: this.dataIndex.slice(0, -1),
                layoutIndex: this.layoutIndex.slice(0, -1),
                layoutNode: this.jsf.getParentNode(this),
            };
            return parent.layoutNode.add ||
                this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
        },
        enumerable: true,
        configurable: true
    });
    MaterialAddReferenceComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-add-reference-widget',
                    template: "\n    <section [class]=\"options?.htmlClass || ''\" align=\"end\">\n      <button mat-raised-button *ngIf=\"showAddButton\"\n        [color]=\"options?.color || 'accent'\"\n        [disabled]=\"options?.readonly\"\n        (click)=\"addItem($event)\">\n        <span *ngIf=\"options?.icon\" [class]=\"options?.icon\"></span>\n        <span *ngIf=\"options?.title\" [innerHTML]=\"buttonText\"></span>\n      </button>\n    </section>",
                    changeDetection: core.ChangeDetectionStrategy.Default,
                },] },
    ];
    MaterialAddReferenceComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialAddReferenceComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialAddReferenceComponent;
}());

var MaterialOneOfComponent = (function () {
    function MaterialOneOfComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    MaterialOneOfComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    MaterialOneOfComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialOneOfComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-one-of-widget',
                    template: "",
                },] },
    ];
    MaterialOneOfComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialOneOfComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialOneOfComponent;
}());

var MaterialButtonComponent = (function () {
    function MaterialButtonComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    MaterialButtonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (hasOwn(this.options, 'disabled')) {
            this.controlDisabled = this.options.disabled;
        }
        else if (this.jsf.formOptions.disableInvalidSubmit) {
            this.controlDisabled = !this.jsf.isValid;
            this.jsf.isValidChanges.subscribe(function (isValid) { return _this.controlDisabled = !isValid; });
        }
    };
    MaterialButtonComponent.prototype.updateValue = function (event) {
        if (typeof this.options.onClick === 'function') {
            this.options.onClick(event);
        }
        else {
            this.jsf.updateValue(this, event.target.value);
        }
    };
    MaterialButtonComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-button-widget',
                    template: "\n    <div class=\"button-row\" [class]=\"options?.htmlClass || ''\">\n      <button mat-raised-button\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [color]=\"options?.color || 'primary'\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [type]=\"layoutNode?.type\"\n        [value]=\"controlValue\"\n        (click)=\"updateValue($event)\">\n        <mat-icon *ngIf=\"options?.icon\" class=\"mat-24\">{{options?.icon}}</mat-icon>\n        <span *ngIf=\"options?.title\" [innerHTML]=\"options?.title\"></span>\n      </button>\n    </div>",
                    styles: [" button { margin-top: 10px; } "],
                },] },
    ];
    MaterialButtonComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialButtonComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialButtonComponent;
}());

var MaterialButtonGroupComponent = (function () {
    function MaterialButtonGroupComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.radiosList = [];
        this.vertical = false;
    }
    MaterialButtonGroupComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.radiosList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        this.jsf.initializeControl(this);
    };
    MaterialButtonGroupComponent.prototype.updateValue = function (value) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, value);
    };
    MaterialButtonGroupComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-button-group-widget',
                    template: "\n    <div>\n      <div *ngIf=\"options?.title\">\n        <label\n          [attr.for]=\"'control' + layoutNode?._id\"\n          [class]=\"options?.labelHtmlClass || ''\"\n          [style.display]=\"options?.notitle ? 'none' : ''\"\n          [innerHTML]=\"options?.title\"></label>\n      </div>\n      <mat-button-toggle-group\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [name]=\"controlName\"\n        [value]=\"controlValue\"\n        [vertical]=\"!!options.vertical\">\n        <mat-button-toggle *ngFor=\"let radioItem of radiosList\"\n          [id]=\"'control' + layoutNode?._id + '/' + radioItem?.name\"\n          [value]=\"radioItem?.value\"\n          (click)=\"updateValue(radioItem?.value)\">\n          <span [innerHTML]=\"radioItem?.name\"></span>\n        </mat-button-toggle>\n      </mat-button-toggle-group>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>",
                    styles: [" mat-error { font-size: 75%; } "],
                },] },
    ];
    MaterialButtonGroupComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialButtonGroupComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialButtonGroupComponent;
}());

var MaterialCheckboxComponent = (function () {
    function MaterialCheckboxComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.trueValue = true;
        this.falseValue = false;
        this.showSlideToggle = false;
    }
    MaterialCheckboxComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = false;
            this.jsf.updateValue(this, this.falseValue);
        }
        if (this.layoutNode.type === 'slide-toggle' ||
            this.layoutNode.format === 'slide-toggle') {
            this.showSlideToggle = true;
        }
    };
    MaterialCheckboxComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.checked ? this.trueValue : this.falseValue);
    };
    Object.defineProperty(MaterialCheckboxComponent.prototype, "isChecked", {
        get: function () {
            return this.jsf.getFormControlValue(this) === this.trueValue;
        },
        enumerable: true,
        configurable: true
    });
    MaterialCheckboxComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-checkbox-widget',
                    template: "\n    <mat-checkbox *ngIf=\"boundControl && !showSlideToggle\"\n      [formControl]=\"formControl\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      (blur)=\"options.showErrors = true\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-checkbox>\n    <mat-checkbox *ngIf=\"!boundControl && !showSlideToggle\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [disabled]=\"controlDisabled || options?.readonly\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      [checked]=\"isChecked\"\n      (blur)=\"options.showErrors = true\"\n      (change)=\"updateValue($event)\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-checkbox>\n    <mat-slide-toggle *ngIf=\"boundControl && showSlideToggle\"\n      [formControl]=\"formControl\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      (blur)=\"options.showErrors = true\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-slide-toggle>\n    <mat-slide-toggle *ngIf=\"!boundControl && showSlideToggle\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [disabled]=\"controlDisabled || options?.readonly\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      [checked]=\"isChecked\"\n      (blur)=\"options.showErrors = true\"\n      (change)=\"updateValue($event)\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-slide-toggle>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    .checkbox-name { white-space: nowrap; }\n    mat-error { font-size: 75%; }\n  "],
                },] },
    ];
    MaterialCheckboxComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialCheckboxComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialCheckboxComponent;
}());

var MaterialCheckboxesComponent = (function () {
    function MaterialCheckboxesComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.horizontalList = false;
        this.checkboxList = [];
    }
    MaterialCheckboxesComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.horizontalList = this.layoutNode.type === 'checkboxes-inline' ||
            this.layoutNode.type === 'checkboxbuttons';
        this.jsf.initializeControl(this);
        this.checkboxList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        if (this.boundControl) {
            var formArray = this.jsf.getFormControl(this);
            for (var _i = 0, _a = this.checkboxList; _i < _a.length; _i++) {
                var checkboxItem = _a[_i];
                checkboxItem.checked = formArray.value.includes(checkboxItem.value);
            }
        }
    };
    Object.defineProperty(MaterialCheckboxesComponent.prototype, "allChecked", {
        get: function () {
            return this.checkboxList.filter(function (t) { return t.checked; }).length === this.checkboxList.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialCheckboxesComponent.prototype, "someChecked", {
        get: function () {
            var checkedItems = this.checkboxList.filter(function (t) { return t.checked; }).length;
            return checkedItems > 0 && checkedItems < this.checkboxList.length;
        },
        enumerable: true,
        configurable: true
    });
    MaterialCheckboxesComponent.prototype.updateValue = function () {
        this.options.showErrors = true;
        if (this.boundControl) {
            this.jsf.updateArrayCheckboxList(this, this.checkboxList);
        }
    };
    MaterialCheckboxesComponent.prototype.updateAllValues = function (event) {
        this.options.showErrors = true;
        this.checkboxList.forEach(function (t) { return t.checked = event.checked; });
        this.updateValue();
    };
    MaterialCheckboxesComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-checkboxes-widget',
                    template: "\n    <div>\n      <mat-checkbox type=\"checkbox\"\n        [checked]=\"allChecked\"\n        [color]=\"options?.color || 'primary'\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [indeterminate]=\"someChecked\"\n        [name]=\"options?.name\"\n        (blur)=\"options.showErrors = true\"\n        (change)=\"updateAllValues($event)\">\n        <span class=\"checkbox-name\" [innerHTML]=\"options?.name\"></span>\n      </mat-checkbox>\n      <label *ngIf=\"options?.title\"\n        class=\"title\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <ul class=\"checkbox-list\" [class.horizontal-list]=\"horizontalList\">\n        <li *ngFor=\"let checkboxItem of checkboxList\"\n          [class]=\"options?.htmlClass || ''\">\n          <mat-checkbox type=\"checkbox\"\n            [(ngModel)]=\"checkboxItem.checked\"\n            [color]=\"options?.color || 'primary'\"\n            [disabled]=\"controlDisabled || options?.readonly\"\n            [name]=\"checkboxItem?.name\"\n            (blur)=\"options.showErrors = true\"\n            (change)=\"updateValue()\">\n            <span class=\"checkbox-name\" [innerHTML]=\"checkboxItem?.name\"></span>\n          </mat-checkbox>\n        </li>\n      </ul>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>",
                    styles: ["\n    .title { font-weight: bold; }\n    .checkbox-list { list-style-type: none; }\n    .horizontal-list > li { display: inline-block; margin-right: 10px; zoom: 1; }\n    .checkbox-name { white-space: nowrap; }\n    mat-error { font-size: 75%; }\n  "],
                },] },
    ];
    MaterialCheckboxesComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialCheckboxesComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialCheckboxesComponent;
}());

var MaterialChipListComponent = (function () {
    function MaterialChipListComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    MaterialChipListComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    MaterialChipListComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialChipListComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-chip-list-widget',
                    template: "",
                },] },
    ];
    MaterialChipListComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialChipListComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialChipListComponent;
}());

var MaterialDatepickerComponent = (function () {
    function MaterialDatepickerComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.autoCompleteList = [];
    }
    MaterialDatepickerComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
        this.setControlDate(this.controlValue);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialDatepickerComponent.prototype.ngOnChanges = function () {
        this.setControlDate(this.controlValue);
    };
    MaterialDatepickerComponent.prototype.setControlDate = function (dateString) {
        this.dateValue = stringToDate(dateString);
    };
    MaterialDatepickerComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, dateToString(event, this.options));
    };
    MaterialDatepickerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-datepicker-widget',
                    template: "\n    <mat-form-field [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <input matInput *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [id]=\"'control' + layoutNode?._id\"\n        [max]=\"options?.maximum\"\n        [matDatepicker]=\"picker\"\n        [min]=\"options?.minimum\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        (blur)=\"options.showErrors = true\">\n      <input matInput *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [id]=\"'control' + layoutNode?._id\"\n        [max]=\"options?.maximum\"\n        [matDatepicker]=\"picker\"\n        [min]=\"options?.minimum\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [value]=\"dateValue\"\n        (blur)=\"options.showErrors = true\"\n        (change)=\"updateValue($event)\"\n        (input)=\"updateValue($event)\">\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n      <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n    </mat-form-field>\n    <mat-datepicker #picker\n      (selectedChanged)=\"updateValue($event)\"></mat-datepicker>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n  "],
                },] },
    ];
    MaterialDatepickerComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialDatepickerComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialDatepickerComponent;
}());

var MaterialFileComponent = (function () {
    function MaterialFileComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    MaterialFileComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    MaterialFileComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialFileComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-file-widget',
                    template: "",
                },] },
    ];
    MaterialFileComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialFileComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialFileComponent;
}());

var MaterialInputComponent = (function () {
    function MaterialInputComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.autoCompleteList = [];
    }
    MaterialInputComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialInputComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialInputComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-input-widget',
                    template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatLabel || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <input matInput *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [type]=\"layoutNode?.type\"\n        (blur)=\"options.showErrors = true\">\n      <input matInput *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [type]=\"layoutNode?.type\"\n        [value]=\"controlValue\"\n        (input)=\"updateValue($event)\"\n        (blur)=\"options.showErrors = true\">\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n      <mat-autocomplete *ngIf=\"options?.typeahead?.source\">\n        <mat-option *ngFor=\"let word of options?.typeahead?.source\"\n          [value]=\"word\">{{word}}</mat-option>\n      </mat-autocomplete>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n  "],
                },] },
    ];
    MaterialInputComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialInputComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialInputComponent;
}());

var MaterialNumberComponent = (function () {
    function MaterialNumberComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.allowNegative = true;
        this.allowDecimal = true;
        this.allowExponents = false;
        this.lastValidNumber = '';
    }
    MaterialNumberComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.layoutNode.dataType === 'integer') {
            this.allowDecimal = false;
        }
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialNumberComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialNumberComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-number-widget',
                    template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatLabel || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <input matInput *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.max]=\"options?.maximum\"\n        [attr.min]=\"options?.minimum\"\n        [attr.step]=\"options?.multipleOf || options?.step || 'any'\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [type]=\"'number'\"\n        (blur)=\"options.showErrors = true\">\n      <input matInput *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.max]=\"options?.maximum\"\n        [attr.min]=\"options?.minimum\"\n        [attr.step]=\"options?.multipleOf || options?.step || 'any'\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [type]=\"'number'\"\n        [value]=\"controlValue\"\n        (input)=\"updateValue($event)\"\n        (blur)=\"options.showErrors = true\">\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"layoutNode?.type === 'range'\" align=\"start\"\n        [innerHTML]=\"controlValue\"></mat-hint>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n  "],
                },] },
    ];
    MaterialNumberComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialNumberComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialNumberComponent;
}());

var MaterialRadiosComponent = (function () {
    function MaterialRadiosComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.flexDirection = 'column';
        this.radiosList = [];
    }
    MaterialRadiosComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        if (this.layoutNode.type === 'radios-inline') {
            this.flexDirection = 'row';
        }
        this.radiosList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        this.jsf.initializeControl(this, !this.options.readonly);
    };
    MaterialRadiosComponent.prototype.updateValue = function (value) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, value);
    };
    MaterialRadiosComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-radios-widget',
                    template: "\n    <div>\n      <div *ngIf=\"options?.title\">\n        <label\n          [attr.for]=\"'control' + layoutNode?._id\"\n          [class]=\"options?.labelHtmlClass || ''\"\n          [style.display]=\"options?.notitle ? 'none' : ''\"\n          [innerHTML]=\"options?.title\"></label>\n      </div>\n      <mat-radio-group *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [style.flex-direction]=\"flexDirection\"\n        [name]=\"controlName\"\n        (blur)=\"options.showErrors = true\">\n        <mat-radio-button *ngFor=\"let radioItem of radiosList\"\n          [id]=\"'control' + layoutNode?._id + '/' + radioItem?.name\"\n          [value]=\"radioItem?.value\">\n          <span [innerHTML]=\"radioItem?.name\"></span>\n        </mat-radio-button>\n      </mat-radio-group>\n      <mat-radio-group *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [style.flex-direction]=\"flexDirection\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [name]=\"controlName\"\n        [value]=\"controlValue\">\n        <mat-radio-button *ngFor=\"let radioItem of radiosList\"\n          [id]=\"'control' + layoutNode?._id + '/' + radioItem?.name\"\n          [value]=\"radioItem?.value\"\n          (click)=\"updateValue(radioItem?.value)\">\n          <span [innerHTML]=\"radioItem?.name\"></span>\n        </mat-radio-button>\n      </mat-radio-group>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>",
                    styles: ["\n    mat-radio-group { display: inline-flex; }\n    mat-radio-button { margin: 2px; }\n    mat-error { font-size: 75%; }\n  "]
                },] },
    ];
    MaterialRadiosComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialRadiosComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialRadiosComponent;
}());

var MaterialSelectComponent = (function () {
    function MaterialSelectComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.selectList = [];
        this.isArray = isArray;
    }
    MaterialSelectComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.selectList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, !!this.options.required, !!this.options.flatList);
        this.jsf.initializeControl(this, !this.options.readonly);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialSelectComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.value);
    };
    MaterialSelectComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-select-widget',
                    template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatLabel || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <mat-select *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.name]=\"controlName\"\n        [id]=\"'control' + layoutNode?._id\"\n        [multiple]=\"options?.multiple\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        (blur)=\"options.showErrors = true\">\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <mat-option *ngIf=\"!isArray(selectItem?.items)\"\n            [value]=\"selectItem?.value\">\n            <span [innerHTML]=\"selectItem?.name\"></span>\n          </mat-option>\n          <mat-optgroup *ngIf=\"isArray(selectItem?.items)\"\n            [label]=\"selectItem?.group\">\n            <mat-option *ngFor=\"let subItem of selectItem.items\"\n              [value]=\"subItem?.value\">\n              <span [innerHTML]=\"subItem?.name\"></span>\n            </mat-option>\n          </mat-optgroup>\n        </ng-template>\n      </mat-select>\n      <mat-select *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.name]=\"controlName\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [id]=\"'control' + layoutNode?._id\"\n        [multiple]=\"options?.multiple\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [value]=\"controlValue\"\n        (blur)=\"options.showErrors = true\"\n        (change)=\"updateValue($event)\">\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <mat-option *ngIf=\"!isArray(selectItem?.items)\"\n            [attr.selected]=\"selectItem?.value === controlValue\"\n            [value]=\"selectItem?.value\">\n            <span [innerHTML]=\"selectItem?.name\"></span>\n          </mat-option>\n          <mat-optgroup *ngIf=\"isArray(selectItem?.items)\"\n            [label]=\"selectItem?.group\">\n            <mat-option *ngFor=\"let subItem of selectItem.items\"\n              [attr.selected]=\"subItem?.value === controlValue\"\n              [value]=\"subItem?.value\">\n              <span [innerHTML]=\"subItem?.name\"></span>\n            </mat-option>\n          </mat-optgroup>\n        </ng-template>\n      </mat-select>\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n  "],
                },] },
    ];
    MaterialSelectComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialSelectComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialSelectComponent;
}());

var MaterialSliderComponent = (function () {
    function MaterialSliderComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.allowNegative = true;
        this.allowDecimal = true;
        this.allowExponents = false;
        this.lastValidNumber = '';
    }
    MaterialSliderComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
    };
    MaterialSliderComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.value);
    };
    MaterialSliderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-slider-widget',
                    template: "\n    <mat-slider thumbLabel *ngIf=\"boundControl\"\n      [formControl]=\"formControl\"\n      [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n      [id]=\"'control' + layoutNode?._id\"\n      [max]=\"options?.maximum\"\n      [min]=\"options?.minimum\"\n      [step]=\"options?.multipleOf || options?.step || 'any'\"\n      [style.width]=\"'100%'\"\n      (blur)=\"options.showErrors = true\"></mat-slider>\n    <mat-slider thumbLabel *ngIf=\"!boundControl\"\n      [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n      [disabled]=\"controlDisabled || options?.readonly\"\n      [id]=\"'control' + layoutNode?._id\"\n      [max]=\"options?.maximum\"\n      [min]=\"options?.minimum\"\n      [step]=\"options?.multipleOf || options?.step || 'any'\"\n      [style.width]=\"'100%'\"\n      [value]=\"controlValue\"\n      (blur)=\"options.showErrors = true\"\n      (change)=\"updateValue($event)\"></mat-slider>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: [" mat-error { font-size: 75%; } "],
                },] },
    ];
    MaterialSliderComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialSliderComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialSliderComponent;
}());

var MaterialStepperComponent = (function () {
    function MaterialStepperComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    MaterialStepperComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    MaterialStepperComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialStepperComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-stepper-widget',
                    template: "",
                },] },
    ];
    MaterialStepperComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialStepperComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialStepperComponent;
}());

var MaterialTabsComponent = (function () {
    function MaterialTabsComponent(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    MaterialTabsComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.itemCount = this.layoutNode.items.length - 1;
        this.updateControl();
    };
    MaterialTabsComponent.prototype.select = function (index) {
        if (this.layoutNode.items[index].type === '$ref') {
            this.jsf.addItem({
                layoutNode: this.layoutNode.items[index],
                layoutIndex: this.layoutIndex.concat(index),
                dataIndex: this.dataIndex.concat(index)
            });
            this.updateControl();
        }
        
        this.selectedItem = index;
    };
    MaterialTabsComponent.prototype.updateControl = function () {
        this.itemCount = this.layoutNode.items.length - 1;
        var lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
        this.showAddTab = lastItem.type === '$ref' &&
            this.itemCount < (lastItem.options.maxItems || 1000);
    };
    MaterialTabsComponent.prototype.setTabTitle = function (item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    };
    MaterialTabsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-tabs-widget',
                    template: "\n    <nav mat-tab-nav-bar\n      [attr.aria-label]=\"options?.label || options?.title || ''\"\n      [style.width]=\"'100%'\">\n        <a mat-tab-link *ngFor=\"let item of layoutNode?.items; let i = index\"\n          [active]=\"selectedItem === i\"\n          (click)=\"select(i)\">\n          <span *ngIf=\"showAddTab || item.type !== '$ref'\"\n            [innerHTML]=\"setTabTitle(item, i)\"></span>\n        </a>\n    </nav>\n    <div *ngFor=\"let layoutItem of layoutNode?.items; let i = index\"\n      [class]=\"options?.htmlClass || ''\">\n      <select-framework-widget *ngIf=\"selectedItem === i\"\n        [class]=\"(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')\"\n        [dataIndex]=\"layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex\"\n        [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n        [layoutNode]=\"layoutItem\"></select-framework-widget>\n    </div>",
                    styles: [" a { cursor: pointer; } "],
                },] },
    ];
    MaterialTabsComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialTabsComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialTabsComponent;
}());

var MaterialTextareaComponent = (function () {
    function MaterialTextareaComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    MaterialTextareaComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialTextareaComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialTextareaComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-textarea-widget',
                    template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatLabel || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <textarea matInput *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [required]=\"options?.required\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [style.width]=\"'100%'\"\n        (blur)=\"options.showErrors = true\"></textarea>\n      <textarea matInput *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.list]=\"'control' + layoutNode?._id + 'Autocomplete'\"\n        [attr.maxlength]=\"options?.maxLength\"\n        [attr.minlength]=\"options?.minLength\"\n        [attr.pattern]=\"options?.pattern\"\n        [required]=\"options?.required\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [readonly]=\"options?.readonly ? 'readonly' : null\"\n        [style.width]=\"'100%'\"\n        [value]=\"controlValue\"\n        (input)=\"updateValue($event)\"\n        (blur)=\"options.showErrors = true\"></textarea>\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n  "],
                },] },
    ];
    MaterialTextareaComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialTextareaComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialTextareaComponent;
}());

var __assign$8 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var MaterialDesignFrameworkComponent = (function () {
    function MaterialDesignFrameworkComponent(changeDetector, jsf) {
        this.changeDetector = changeDetector;
        this.jsf = jsf;
        this.frameworkInitialized = false;
        this.formControl = null;
        this.parentArray = null;
        this.isOrderable = false;
        this.dynamicTitle = null;
    }
    Object.defineProperty(MaterialDesignFrameworkComponent.prototype, "showRemoveButton", {
        get: function () {
            if (!this.layoutNode || !this.widgetOptions.removable ||
                this.widgetOptions.readonly || this.layoutNode.type === '$ref') {
                return false;
            }
            if (this.layoutNode.recursiveReference) {
                return true;
            }
            if (!this.layoutNode.arrayItem || !this.parentArray) {
                return false;
            }
            return this.parentArray.items.length - 1 <= this.parentArray.options.minItems ? false :
                this.layoutNode.arrayItemType === 'list' ? true :
                    this.layoutIndex[this.layoutIndex.length - 1] === this.parentArray.items.length - 2;
        },
        enumerable: true,
        configurable: true
    });
    MaterialDesignFrameworkComponent.prototype.ngOnInit = function () {
        this.initializeFramework();
    };
    MaterialDesignFrameworkComponent.prototype.ngOnChanges = function () {
        if (!this.frameworkInitialized) {
            this.initializeFramework();
        }
        if (this.dynamicTitle) {
            this.updateTitle();
        }
    };
    MaterialDesignFrameworkComponent.prototype.initializeFramework = function () {
        if (this.layoutNode) {
            this.options = _.cloneDeep(this.layoutNode.options || {});
            this.widgetLayoutNode = __assign$8({}, this.layoutNode, { options: _.cloneDeep(this.layoutNode.options || {}) });
            this.widgetOptions = this.widgetLayoutNode.options;
            this.formControl = this.jsf.getFormControl(this);
            if (isDefined(this.widgetOptions.minimum) &&
                isDefined(this.widgetOptions.maximum) &&
                this.widgetOptions.multipleOf >= 1) {
                this.layoutNode.type = 'range';
            }
            if (!['$ref', 'advancedfieldset', 'authfieldset', 'button', 'card',
                'checkbox', 'expansion-panel', 'help', 'message', 'msg', 'section',
                'submit', 'tabarray', 'tabs'].includes(this.layoutNode.type) &&
                /{{.+?}}/.test(this.widgetOptions.title || '')) {
                this.dynamicTitle = this.widgetOptions.title;
                this.updateTitle();
            }
            if (this.layoutNode.arrayItem && this.layoutNode.type !== '$ref') {
                this.parentArray = this.jsf.getParentNode(this);
                if (this.parentArray) {
                    this.isOrderable =
                        this.parentArray.type.slice(0, 3) !== 'tab' &&
                            this.layoutNode.arrayItemType === 'list' &&
                            !this.widgetOptions.readonly &&
                            this.parentArray.options.orderable;
                }
            }
            this.frameworkInitialized = true;
        }
        else {
            this.options = {};
        }
    };
    MaterialDesignFrameworkComponent.prototype.updateTitle = function () {
        this.widgetLayoutNode.options.title = this.jsf.parseText(this.dynamicTitle, this.jsf.getFormControlValue(this), this.jsf.getFormControlGroup(this).value, this.dataIndex[this.dataIndex.length - 1]);
    };
    MaterialDesignFrameworkComponent.prototype.removeItem = function () {
        this.jsf.removeItem(this);
    };
    MaterialDesignFrameworkComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'material-design-framework',
                    template: "\n    <div\n      [class.array-item]=\"widgetLayoutNode?.arrayItem && widgetLayoutNode?.type !== '$ref'\"\n      [orderable]=\"isOrderable\"\n      [dataIndex]=\"dataIndex\"\n      [layoutIndex]=\"layoutIndex\"\n      [layoutNode]=\"widgetLayoutNode\">\n      <svg *ngIf=\"showRemoveButton\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        height=\"18\" width=\"18\" viewBox=\"0 0 24 24\"\n        class=\"close-button\"\n        (click)=\"removeItem()\">\n        <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z\"/>\n      </svg>\n      <select-widget-widget\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [layoutNode]=\"widgetLayoutNode\"></select-widget-widget>\n    </div>\n    <div class=\"spacer\" *ngIf=\"widgetLayoutNode?.arrayItem && widgetLayoutNode?.type !== '$ref'\"></div>",
                    styles: ["\n    .array-item {\n      border-radius: 2px;\n      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),\n                  0 2px 2px  0   rgba(0,0,0,.14),\n                  0 1px 5px  0   rgba(0,0,0,.12);\n      padding: 6px;\n      position: relative;\n      transition: all 280ms cubic-bezier(.4, 0, .2, 1);\n    }\n    .close-button {\n      cursor: pointer;\n      position: absolute;\n      top: 6px;\n      right: 6px;\n      fill: rgba(0,0,0,.4);\n      visibility: hidden;\n      z-index: 500;\n    }\n    .close-button:hover { fill: rgba(0,0,0,.8); }\n    .array-item:hover > .close-button { visibility: visible; }\n    .spacer { margin: 6px 0; }\n    [draggable=true]:hover {\n      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),\n                  0 8px 10px 1px rgba(0,0,0,.14),\n                  0 3px 14px 2px rgba(0,0,0,.12);\n      cursor: move;\n      z-index: 10;\n    }\n    [draggable=true].drag-target-top {\n      box-shadow: 0 -2px 0 #000;\n      position: relative; z-index: 20;\n    }\n    [draggable=true].drag-target-bottom {\n      box-shadow: 0 2px 0 #000;\n      position: relative; z-index: 20;\n    }\n  "],
                },] },
    ];
    MaterialDesignFrameworkComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef },
        { type: JsonSchemaFormService }
    ]; };
    MaterialDesignFrameworkComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return MaterialDesignFrameworkComponent;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MaterialDesignFramework = (function (_super) {
    __extends$2(MaterialDesignFramework, _super);
    function MaterialDesignFramework() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'material-design';
        _this.framework = MaterialDesignFrameworkComponent;
        _this.stylesheets = [
            '//fonts.googleapis.com/icon?family=Material+Icons',
            '//fonts.googleapis.com/css?family=Roboto:300,400,500,700',
        ];
        _this.widgets = {
            'root': FlexLayoutRootComponent,
            'section': FlexLayoutSectionComponent,
            '$ref': MaterialAddReferenceComponent,
            'button': MaterialButtonComponent,
            'button-group': MaterialButtonGroupComponent,
            'checkbox': MaterialCheckboxComponent,
            'checkboxes': MaterialCheckboxesComponent,
            'chip-list': MaterialChipListComponent,
            'date': MaterialDatepickerComponent,
            'file': MaterialFileComponent,
            'number': MaterialNumberComponent,
            'one-of': MaterialOneOfComponent,
            'radios': MaterialRadiosComponent,
            'select': MaterialSelectComponent,
            'slider': MaterialSliderComponent,
            'stepper': MaterialStepperComponent,
            'tabs': MaterialTabsComponent,
            'text': MaterialInputComponent,
            'textarea': MaterialTextareaComponent,
            'alt-date': 'date',
            'any-of': 'one-of',
            'card': 'section',
            'color': 'text',
            'expansion-panel': 'section',
            'hidden': 'none',
            'image': 'none',
            'integer': 'number',
            'radiobuttons': 'button-group',
            'range': 'slider',
            'submit': 'button',
            'tagsinput': 'chip-list',
            'wizard': 'stepper',
        };
        return _this;
    }
    MaterialDesignFramework.decorators = [
        { type: core.Injectable },
    ];
    return MaterialDesignFramework;
}(Framework));

var MATERIAL_FRAMEWORK_COMPONENTS = [
    FlexLayoutRootComponent, FlexLayoutSectionComponent,
    MaterialAddReferenceComponent, MaterialOneOfComponent,
    MaterialButtonComponent, MaterialButtonGroupComponent,
    MaterialCheckboxComponent, MaterialCheckboxesComponent,
    MaterialChipListComponent, MaterialDatepickerComponent,
    MaterialFileComponent, MaterialInputComponent, MaterialNumberComponent,
    MaterialRadiosComponent, MaterialSelectComponent, MaterialSliderComponent,
    MaterialStepperComponent, MaterialTabsComponent, MaterialTextareaComponent,
    MaterialDesignFrameworkComponent
];

var ANGULAR_MATERIAL_MODULES = [
    material.MatAutocompleteModule, material.MatButtonModule, material.MatButtonToggleModule, material.MatCardModule,
    material.MatCheckboxModule, material.MatChipsModule, material.MatDatepickerModule, material.MatExpansionModule,
    material.MatFormFieldModule, material.MatIconModule, material.MatInputModule, material.MatNativeDateModule,
    material.MatRadioModule, material.MatSelectModule, material.MatSliderModule, material.MatSlideToggleModule,
    material.MatStepperModule, material.MatTabsModule, material.MatTooltipModule,
];
var MaterialDesignFrameworkModule = (function () {
    function MaterialDesignFrameworkModule() {
    }
    MaterialDesignFrameworkModule.forRoot = function () {
        return {
            ngModule: MaterialDesignFrameworkModule,
            providers: [
                { provide: Framework, useClass: MaterialDesignFramework, multi: true }
            ]
        };
    };
    MaterialDesignFrameworkModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule, flexLayout.FlexLayoutModule
                    ].concat(ANGULAR_MATERIAL_MODULES, [
                        WidgetLibraryModule
                    ]),
                    declarations: MATERIAL_FRAMEWORK_COMPONENTS.slice(),
                    exports: MATERIAL_FRAMEWORK_COMPONENTS.slice(),
                    entryComponents: MATERIAL_FRAMEWORK_COMPONENTS.slice()
                },] },
    ];
    return MaterialDesignFrameworkModule;
}());

var __assign$9 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Bootstrap3FrameworkComponent = (function () {
    function Bootstrap3FrameworkComponent(changeDetector, jsf) {
        this.changeDetector = changeDetector;
        this.jsf = jsf;
        this.frameworkInitialized = false;
        this.formControl = null;
        this.debugOutput = '';
        this.debug = '';
        this.parentArray = null;
        this.isOrderable = false;
    }
    Object.defineProperty(Bootstrap3FrameworkComponent.prototype, "showRemoveButton", {
        get: function () {
            if (!this.options.removable || this.options.readonly ||
                this.layoutNode.type === '$ref') {
                return false;
            }
            if (this.layoutNode.recursiveReference) {
                return true;
            }
            if (!this.layoutNode.arrayItem || !this.parentArray) {
                return false;
            }
            return this.parentArray.items.length - 1 <= this.parentArray.options.minItems ? false :
                this.layoutNode.arrayItemType === 'list' ? true :
                    this.layoutIndex[this.layoutIndex.length - 1] === this.parentArray.items.length - 2;
        },
        enumerable: true,
        configurable: true
    });
    Bootstrap3FrameworkComponent.prototype.ngOnInit = function () {
        this.initializeFramework();
        if (this.layoutNode.arrayItem && this.layoutNode.type !== '$ref') {
            this.parentArray = this.jsf.getParentNode(this);
            if (this.parentArray) {
                this.isOrderable = this.layoutNode.arrayItemType === 'list' &&
                    !this.options.readonly && this.parentArray.options.orderable;
            }
        }
    };
    Bootstrap3FrameworkComponent.prototype.ngOnChanges = function () {
        if (!this.frameworkInitialized) {
            this.initializeFramework();
        }
    };
    Bootstrap3FrameworkComponent.prototype.initializeFramework = function () {
        var _this = this;
        if (this.layoutNode) {
            this.options = _.cloneDeep(this.layoutNode.options);
            this.widgetLayoutNode = __assign$9({}, this.layoutNode, { options: _.cloneDeep(this.layoutNode.options) });
            this.widgetOptions = this.widgetLayoutNode.options;
            this.formControl = this.jsf.getFormControl(this);
            this.options.isInputWidget = inArray(this.layoutNode.type, [
                'button', 'checkbox', 'checkboxes-inline', 'checkboxes', 'color',
                'date', 'datetime-local', 'datetime', 'email', 'file', 'hidden',
                'image', 'integer', 'month', 'number', 'password', 'radio',
                'radiobuttons', 'radios-inline', 'radios', 'range', 'reset', 'search',
                'select', 'submit', 'tel', 'text', 'textarea', 'time', 'url', 'week'
            ]);
            this.options.title = this.setTitle();
            this.options.htmlClass =
                addClasses(this.options.htmlClass, 'schema-form-' + this.layoutNode.type);
            if (this.layoutNode.type !== 'flex') {
                this.options.htmlClass =
                    this.layoutNode.type === 'array' ?
                        addClasses(this.options.htmlClass, 'list-group') :
                        this.layoutNode.arrayItem && this.layoutNode.type !== '$ref' ?
                            addClasses(this.options.htmlClass, 'list-group-item') :
                            addClasses(this.options.htmlClass, 'form-group');
            }
            this.widgetOptions.htmlClass = '';
            this.options.labelHtmlClass =
                addClasses(this.options.labelHtmlClass, 'control-label');
            this.widgetOptions.activeClass =
                addClasses(this.widgetOptions.activeClass, 'active');
            this.options.fieldAddonLeft =
                this.options.fieldAddonLeft || this.options.prepend;
            this.options.fieldAddonRight =
                this.options.fieldAddonRight || this.options.append;
            if (this.options.title && this.layoutNode.type !== 'tab' &&
                !this.options.notitle && this.options.required &&
                !this.options.title.includes('*')) {
                this.options.title += ' <strong class="text-danger">*</strong>';
            }
            switch (this.layoutNode.type) {
                case 'checkbox':
                case 'checkboxes':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'checkbox');
                    break;
                case 'checkboxes-inline':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'checkbox');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'checkbox-inline');
                    break;
                case 'radio':
                case 'radios':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'radio');
                    break;
                case 'radios-inline':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'radio');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'radio-inline');
                    break;
                case 'checkboxbuttons':
                case 'radiobuttons':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'btn-group');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'btn');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, this.options.style || 'btn-default');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'sr-only');
                    break;
                case 'button':
                case 'submit':
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'btn');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, this.options.style || 'btn-info');
                    break;
                case 'array':
                case 'fieldset':
                case 'section':
                case 'conditional':
                case 'advancedfieldset':
                case 'authfieldset':
                case 'selectfieldset':
                case 'optionfieldset':
                    this.options.messageLocation = 'top';
                    break;
                case 'tabarray':
                case 'tabs':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'tab-content');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'tab-pane');
                    this.widgetOptions.labelHtmlClass = addClasses(this.widgetOptions.labelHtmlClass, 'nav nav-tabs');
                    break;
                case '$ref':
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'btn pull-right');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, this.options.style || 'btn-default');
                    this.options.icon = 'glyphicon glyphicon-plus';
                    break;
                default:
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'form-control');
            }
            if (this.formControl) {
                this.updateHelpBlock(this.formControl.status);
                this.formControl.statusChanges.subscribe(function (status) { return _this.updateHelpBlock(status); });
                if (this.options.debug) {
                    var vars = [];
                    this.debugOutput = _.map(vars, function (thisVar) { return JSON.stringify(thisVar, null, 2); }).join('\n');
                }
            }
            this.frameworkInitialized = true;
        }
    };
    Bootstrap3FrameworkComponent.prototype.updateHelpBlock = function (status) {
        this.options.helpBlock = status === 'INVALID' &&
            this.options.enableErrorState && this.formControl.errors &&
            (this.formControl.dirty || this.options.feedbackOnRender) ?
            this.jsf.formatErrors(this.formControl.errors, this.options.validationMessages) :
            this.options.description || this.options.help || null;
    };
    Bootstrap3FrameworkComponent.prototype.setTitle = function () {
        switch (this.layoutNode.type) {
            case 'button':
            case 'checkbox':
            case 'section':
            case 'help':
            case 'msg':
            case 'submit':
            case 'message':
            case 'tabarray':
            case 'tabs':
            case '$ref':
                return null;
            case 'advancedfieldset':
                this.widgetOptions.expandable = true;
                this.widgetOptions.title = 'Advanced options';
                return null;
            case 'authfieldset':
                this.widgetOptions.expandable = true;
                this.widgetOptions.title = 'Authentication settings';
                return null;
            case 'fieldset':
                this.widgetOptions.title = this.options.title;
                return null;
            default:
                this.widgetOptions.title = null;
                return this.jsf.setItemTitle(this);
        }
    };
    Bootstrap3FrameworkComponent.prototype.removeItem = function () {
        this.jsf.removeItem(this);
    };
    Bootstrap3FrameworkComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'bootstrap-3-framework',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\"\n      [class.has-feedback]=\"options?.feedback && options?.isInputWidget &&\n        (formControl?.dirty || options?.feedbackOnRender)\"\n      [class.has-error]=\"options?.enableErrorState && formControl?.errors &&\n        (formControl?.dirty || options?.feedbackOnRender)\"\n      [class.has-success]=\"options?.enableSuccessState && !formControl?.errors &&\n        (formControl?.dirty || options?.feedbackOnRender)\">\n\n      <button *ngIf=\"showRemoveButton\"\n        class=\"close pull-right\"\n        type=\"button\"\n        (click)=\"removeItem()\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n      </button>\n      <div *ngIf=\"options?.messageLocation === 'top'\">\n          <p *ngIf=\"options?.helpBlock\"\n          class=\"help-block\"\n          [innerHTML]=\"options?.helpBlock\"></p>\n      </div>\n\n      <label *ngIf=\"options?.title && layoutNode?.type !== 'tab'\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [class.sr-only]=\"options?.notitle\"\n        [innerHTML]=\"options?.title\"></label>\n      <p *ngIf=\"layoutNode?.type === 'submit' && jsf?.formOptions?.fieldsRequired\">\n        <strong class=\"text-danger\">*</strong> = required fields\n      </p>\n      <div [class.input-group]=\"options?.fieldAddonLeft || options?.fieldAddonRight\">\n        <span *ngIf=\"options?.fieldAddonLeft\"\n          class=\"input-group-addon\"\n          [innerHTML]=\"options?.fieldAddonLeft\"></span>\n\n        <select-widget-widget\n          [layoutNode]=\"widgetLayoutNode\"\n          [dataIndex]=\"dataIndex\"\n          [layoutIndex]=\"layoutIndex\"></select-widget-widget>\n\n        <span *ngIf=\"options?.fieldAddonRight\"\n          class=\"input-group-addon\"\n          [innerHTML]=\"options?.fieldAddonRight\"></span>\n      </div>\n\n      <span *ngIf=\"options?.feedback && options?.isInputWidget &&\n          !options?.fieldAddonRight && !layoutNode.arrayItem &&\n          (formControl?.dirty || options?.feedbackOnRender)\"\n        [class.glyphicon-ok]=\"options?.enableSuccessState && !formControl?.errors\"\n        [class.glyphicon-remove]=\"options?.enableErrorState && formControl?.errors\"\n        aria-hidden=\"true\"\n        class=\"form-control-feedback glyphicon\"></span>\n      <div *ngIf=\"options?.messageLocation !== 'top'\">\n        <p *ngIf=\"options?.helpBlock\"\n          class=\"help-block\"\n          [innerHTML]=\"options?.helpBlock\"></p>\n      </div>\n    </div>\n\n    <div *ngIf=\"debug && debugOutput\">debug: <pre>{{debugOutput}}</pre></div>\n  ",
                    styles: ["\n    :host /deep/ .list-group-item .form-control-feedback { top: 40; }\n    :host /deep/ .checkbox,\n    :host /deep/ .radio { margin-top: 0; margin-bottom: 0; }\n    :host /deep/ .checkbox-inline,\n    :host /deep/ .checkbox-inline + .checkbox-inline,\n    :host /deep/ .checkbox-inline + .radio-inline,\n    :host /deep/ .radio-inline,\n    :host /deep/ .radio-inline + .radio-inline,\n    :host /deep/ .radio-inline + .checkbox-inline { margin-left: 0; margin-right: 10px; }\n    :host /deep/ .checkbox-inline:last-child,\n    :host /deep/ .radio-inline:last-child { margin-right: 0; }\n    :host /deep/ .ng-invalid.ng-touched { border: 1px solid #f44336; }\n  "],
                },] },
    ];
    Bootstrap3FrameworkComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef },
        { type: JsonSchemaFormService }
    ]; };
    Bootstrap3FrameworkComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return Bootstrap3FrameworkComponent;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bootstrap3Framework = (function (_super) {
    __extends$3(Bootstrap3Framework, _super);
    function Bootstrap3Framework() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'bootstrap-3';
        _this.framework = Bootstrap3FrameworkComponent;
        _this.stylesheets = [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
        ];
        _this.scripts = [
            '//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
            '//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        ];
        return _this;
    }
    Bootstrap3Framework.decorators = [
        { type: core.Injectable },
    ];
    return Bootstrap3Framework;
}(Framework));

var Bootstrap3FrameworkModule = (function () {
    function Bootstrap3FrameworkModule() {
    }
    Bootstrap3FrameworkModule.forRoot = function () {
        return {
            ngModule: Bootstrap3FrameworkModule,
            providers: [
                { provide: Framework, useClass: Bootstrap3Framework, multi: true }
            ]
        };
    };
    Bootstrap3FrameworkModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, WidgetLibraryModule],
                    declarations: [Bootstrap3FrameworkComponent],
                    exports: [Bootstrap3FrameworkComponent],
                    entryComponents: [Bootstrap3FrameworkComponent]
                },] },
    ];
    return Bootstrap3FrameworkModule;
}());

var __assign$10 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Bootstrap4FrameworkComponent = (function () {
    function Bootstrap4FrameworkComponent(changeDetector, jsf) {
        this.changeDetector = changeDetector;
        this.jsf = jsf;
        this.frameworkInitialized = false;
        this.formControl = null;
        this.debugOutput = '';
        this.debug = '';
        this.parentArray = null;
        this.isOrderable = false;
    }
    Object.defineProperty(Bootstrap4FrameworkComponent.prototype, "showRemoveButton", {
        get: function () {
            if (!this.options.removable || this.options.readonly ||
                this.layoutNode.type === '$ref') {
                return false;
            }
            if (this.layoutNode.recursiveReference) {
                return true;
            }
            if (!this.layoutNode.arrayItem || !this.parentArray) {
                return false;
            }
            return this.parentArray.items.length - 1 <= this.parentArray.options.minItems ? false :
                this.layoutNode.arrayItemType === 'list' ? true :
                    this.layoutIndex[this.layoutIndex.length - 1] === this.parentArray.items.length - 2;
        },
        enumerable: true,
        configurable: true
    });
    Bootstrap4FrameworkComponent.prototype.ngOnInit = function () {
        this.initializeFramework();
        if (this.layoutNode.arrayItem && this.layoutNode.type !== '$ref') {
            this.parentArray = this.jsf.getParentNode(this);
            if (this.parentArray) {
                this.isOrderable = this.layoutNode.arrayItemType === 'list' &&
                    !this.options.readonly && this.parentArray.options.orderable;
            }
        }
    };
    Bootstrap4FrameworkComponent.prototype.ngOnChanges = function () {
        if (!this.frameworkInitialized) {
            this.initializeFramework();
        }
    };
    Bootstrap4FrameworkComponent.prototype.initializeFramework = function () {
        var _this = this;
        if (this.layoutNode) {
            this.options = _.cloneDeep(this.layoutNode.options);
            this.widgetLayoutNode = __assign$10({}, this.layoutNode, { options: _.cloneDeep(this.layoutNode.options) });
            this.widgetOptions = this.widgetLayoutNode.options;
            this.formControl = this.jsf.getFormControl(this);
            this.options.isInputWidget = inArray(this.layoutNode.type, [
                'button', 'checkbox', 'checkboxes-inline', 'checkboxes', 'color',
                'date', 'datetime-local', 'datetime', 'email', 'file', 'hidden',
                'image', 'integer', 'month', 'number', 'password', 'radio',
                'radiobuttons', 'radios-inline', 'radios', 'range', 'reset', 'search',
                'select', 'submit', 'tel', 'text', 'textarea', 'time', 'url', 'week'
            ]);
            this.options.title = this.setTitle();
            this.options.htmlClass =
                addClasses(this.options.htmlClass, 'schema-form-' + this.layoutNode.type);
            this.options.htmlClass =
                this.layoutNode.type === 'array' ?
                    addClasses(this.options.htmlClass, 'list-group') :
                    this.layoutNode.arrayItem && this.layoutNode.type !== '$ref' ?
                        addClasses(this.options.htmlClass, 'list-group-item') :
                        addClasses(this.options.htmlClass, 'form-group');
            this.widgetOptions.htmlClass = '';
            this.options.labelHtmlClass =
                addClasses(this.options.labelHtmlClass, 'control-label');
            this.widgetOptions.activeClass =
                addClasses(this.widgetOptions.activeClass, 'active');
            this.options.fieldAddonLeft =
                this.options.fieldAddonLeft || this.options.prepend;
            this.options.fieldAddonRight =
                this.options.fieldAddonRight || this.options.append;
            if (this.options.title && this.layoutNode.type !== 'tab' &&
                !this.options.notitle && this.options.required &&
                !this.options.title.includes('*')) {
                this.options.title += ' <strong class="text-danger">*</strong>';
            }
            switch (this.layoutNode.type) {
                case 'checkbox':
                case 'checkboxes':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'checkbox');
                    break;
                case 'checkboxes-inline':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'checkbox');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'checkbox-inline');
                    break;
                case 'radio':
                case 'radios':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'radio');
                    break;
                case 'radios-inline':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'radio');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'radio-inline');
                    break;
                case 'checkboxbuttons':
                case 'radiobuttons':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'btn-group');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'btn');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, this.options.style || 'btn-default');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'sr-only');
                    break;
                case 'button':
                case 'submit':
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'btn');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, this.options.style || 'btn-info');
                    break;
                case 'array':
                case 'fieldset':
                case 'section':
                case 'conditional':
                case 'advancedfieldset':
                case 'authfieldset':
                case 'selectfieldset':
                case 'optionfieldset':
                    this.options.messageLocation = 'top';
                    break;
                case 'tabarray':
                case 'tabs':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'tab-content');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'tab-pane');
                    this.widgetOptions.labelHtmlClass = addClasses(this.widgetOptions.labelHtmlClass, 'nav nav-tabs');
                    break;
                case '$ref':
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'btn pull-right');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, this.options.style || 'btn-default');
                    this.options.icon = 'glyphicon glyphicon-plus';
                    break;
                default:
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'form-control');
            }
            if (this.formControl) {
                this.updateHelpBlock(this.formControl.status);
                this.formControl.statusChanges.subscribe(function (status) { return _this.updateHelpBlock(status); });
                if (this.options.debug) {
                    var vars = [];
                    this.debugOutput = _.map(vars, function (thisVar) { return JSON.stringify(thisVar, null, 2); }).join('\n');
                }
            }
            this.frameworkInitialized = true;
        }
    };
    Bootstrap4FrameworkComponent.prototype.updateHelpBlock = function (status) {
        this.options.helpBlock = status === 'INVALID' &&
            this.options.enableErrorState && this.formControl.errors &&
            (this.formControl.dirty || this.options.feedbackOnRender) ?
            this.jsf.formatErrors(this.formControl.errors, this.options.validationMessages) :
            this.options.description || this.options.help || null;
    };
    Bootstrap4FrameworkComponent.prototype.setTitle = function () {
        switch (this.layoutNode.type) {
            case 'button':
            case 'checkbox':
            case 'section':
            case 'help':
            case 'msg':
            case 'submit':
            case 'message':
            case 'tabarray':
            case 'tabs':
            case '$ref':
                return null;
            case 'advancedfieldset':
                this.widgetOptions.expandable = true;
                this.widgetOptions.title = 'Advanced options';
                return null;
            case 'authfieldset':
                this.widgetOptions.expandable = true;
                this.widgetOptions.title = 'Authentication settings';
                return null;
            case 'fieldset':
                this.widgetOptions.title = this.options.title;
                return null;
            default:
                this.widgetOptions.title = null;
                return this.jsf.setItemTitle(this);
        }
    };
    Bootstrap4FrameworkComponent.prototype.removeItem = function () {
        this.jsf.removeItem(this);
    };
    Bootstrap4FrameworkComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'bootstrap-4-framework',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\"\n      [class.has-feedback]=\"options?.feedback && options?.isInputWidget &&\n        (formControl?.dirty || options?.feedbackOnRender)\"\n      [class.has-error]=\"options?.enableErrorState && formControl?.errors &&\n        (formControl?.dirty || options?.feedbackOnRender)\"\n      [class.has-success]=\"options?.enableSuccessState && !formControl?.errors &&\n        (formControl?.dirty || options?.feedbackOnRender)\">\n\n      <button *ngIf=\"showRemoveButton\"\n        class=\"close pull-right\"\n        type=\"button\"\n        (click)=\"removeItem()\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n      </button>\n      <div *ngIf=\"options?.messageLocation === 'top'\">\n        <p *ngIf=\"options?.helpBlock\"\n          class=\"help-block\"\n          [innerHTML]=\"options?.helpBlock\"></p>\n      </div>\n\n      <label *ngIf=\"options?.title && layoutNode?.type !== 'tab'\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [class.sr-only]=\"options?.notitle\"\n        [innerHTML]=\"options?.title\"></label>\n      <p *ngIf=\"layoutNode?.type === 'submit' && jsf?.formOptions?.fieldsRequired\">\n        <strong class=\"text-danger\">*</strong> = required fields\n      </p>\n      <div [class.input-group]=\"options?.fieldAddonLeft || options?.fieldAddonRight\">\n        <span *ngIf=\"options?.fieldAddonLeft\"\n          class=\"input-group-addon\"\n          [innerHTML]=\"options?.fieldAddonLeft\"></span>\n\n        <select-widget-widget\n          [layoutNode]=\"widgetLayoutNode\"\n          [dataIndex]=\"dataIndex\"\n          [layoutIndex]=\"layoutIndex\"></select-widget-widget>\n\n        <span *ngIf=\"options?.fieldAddonRight\"\n          class=\"input-group-addon\"\n          [innerHTML]=\"options?.fieldAddonRight\"></span>\n      </div>\n\n      <span *ngIf=\"options?.feedback && options?.isInputWidget &&\n          !options?.fieldAddonRight && !layoutNode.arrayItem &&\n          (formControl?.dirty || options?.feedbackOnRender)\"\n        [class.glyphicon-ok]=\"options?.enableSuccessState && !formControl?.errors\"\n        [class.glyphicon-remove]=\"options?.enableErrorState && formControl?.errors\"\n        aria-hidden=\"true\"\n        class=\"form-control-feedback glyphicon\"></span>\n      <div *ngIf=\"options?.messageLocation !== 'top'\">\n        <p *ngIf=\"options?.helpBlock\"\n          class=\"help-block\"\n          [innerHTML]=\"options?.helpBlock\"></p>\n      </div>\n    </div>\n\n    <div *ngIf=\"debug && debugOutput\">debug: <pre>{{debugOutput}}</pre></div>\n  ",
                    styles: ["\n    :host /deep/ .list-group-item .form-control-feedback { top: 40px; }\n    :host /deep/ .checkbox,\n    :host /deep/ .radio { margin-top: 0; margin-bottom: 0; }\n    :host /deep/ .checkbox-inline,\n    :host /deep/ .checkbox-inline + .checkbox-inline,\n    :host /deep/ .checkbox-inline + .radio-inline,\n    :host /deep/ .radio-inline,\n    :host /deep/ .radio-inline + .radio-inline,\n    :host /deep/ .radio-inline + .checkbox-inline { margin-left: 0; margin-right: 10px; }\n    :host /deep/ .checkbox-inline:last-child,\n    :host /deep/ .radio-inline:last-child { margin-right: 0; }\n    :host /deep/ .ng-invalid.ng-touched { border: 1px solid #f44336; }\n  "],
                },] },
    ];
    Bootstrap4FrameworkComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef },
        { type: JsonSchemaFormService }
    ]; };
    Bootstrap4FrameworkComponent.propDecorators = {
        layoutNode: [{ type: core.Input }],
        layoutIndex: [{ type: core.Input }],
        dataIndex: [{ type: core.Input }]
    };
    return Bootstrap4FrameworkComponent;
}());

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bootstrap4Framework = (function (_super) {
    __extends$4(Bootstrap4Framework, _super);
    function Bootstrap4Framework() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'bootstrap-4';
        _this.framework = Bootstrap4FrameworkComponent;
        _this.stylesheets = [
            '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css'
        ];
        _this.scripts = [
            '//code.jquery.com/jquery-3.2.1.slim.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js',
            '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js',
        ];
        return _this;
    }
    Bootstrap4Framework.decorators = [
        { type: core.Injectable },
    ];
    return Bootstrap4Framework;
}(Framework));

var Bootstrap4FrameworkModule = (function () {
    function Bootstrap4FrameworkModule() {
    }
    Bootstrap4FrameworkModule.forRoot = function () {
        return {
            ngModule: Bootstrap4FrameworkModule,
            providers: [
                { provide: Framework, useClass: Bootstrap4Framework, multi: true }
            ]
        };
    };
    Bootstrap4FrameworkModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, WidgetLibraryModule],
                    declarations: [Bootstrap4FrameworkComponent],
                    exports: [Bootstrap4FrameworkComponent],
                    entryComponents: [Bootstrap4FrameworkComponent]
                },] },
    ];
    return Bootstrap4FrameworkModule;
}());

exports.ɵd = MATERIAL_FRAMEWORK_COMPONENTS;
exports.ɵb = ANGULAR_MATERIAL_MODULES;
exports.ɵa = JSON_SCHEMA_FORM_VALUE_ACCESSOR;
exports.ɵc = BASIC_WIDGETS;
exports._executeValidators = _executeValidators;
exports._executeAsyncValidators = _executeAsyncValidators;
exports._mergeObjects = _mergeObjects;
exports._mergeErrors = _mergeErrors;
exports.isDefined = isDefined;
exports.hasValue = hasValue;
exports.isEmpty = isEmpty;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isInteger = isInteger;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isDate = isDate;
exports.isMap = isMap;
exports.isSet = isSet;
exports.isPromise = isPromise;
exports.isObservable = isObservable;
exports.getType = getType;
exports.isType = isType;
exports.isPrimitive = isPrimitive;
exports.toJavaScriptType = toJavaScriptType;
exports.toSchemaType = toSchemaType;
exports._toPromise = _toPromise;
exports.toObservable = toObservable;
exports.inArray = inArray;
exports.xor = xor;
exports.addClasses = addClasses;
exports.copy = copy;
exports.forEach = forEach;
exports.forEachCopy = forEachCopy;
exports.hasOwn = hasOwn;
exports.mergeFilteredObject = mergeFilteredObject;
exports.uniqueItems = uniqueItems;
exports.commonItems = commonItems;
exports.fixTitle = fixTitle;
exports.toTitleCase = toTitleCase;
exports.JsonPointer = JsonPointer;
exports.JsonValidators = JsonValidators;
exports.buildSchemaFromLayout = buildSchemaFromLayout;
exports.buildSchemaFromData = buildSchemaFromData;
exports.getFromSchema = getFromSchema;
exports.removeRecursiveReferences = removeRecursiveReferences;
exports.getInputType = getInputType;
exports.checkInlineType = checkInlineType;
exports.isInputRequired = isInputRequired;
exports.updateInputOptions = updateInputOptions;
exports.getTitleMapFromOneOf = getTitleMapFromOneOf;
exports.getControlValidators = getControlValidators;
exports.resolveSchemaReferences = resolveSchemaReferences;
exports.getSubSchema = getSubSchema;
exports.combineAllOf = combineAllOf;
exports.fixRequiredArrayProperties = fixRequiredArrayProperties;
exports.convertSchemaToDraft6 = convertSchemaToDraft6;
exports.mergeSchemas = mergeSchemas;
exports.buildFormGroupTemplate = buildFormGroupTemplate;
exports.buildFormGroup = buildFormGroup;
exports.formatFormData = formatFormData;
exports.getControl = getControl;
exports.setRequiredFields = setRequiredFields;
exports.buildLayout = buildLayout;
exports.buildLayoutFromSchema = buildLayoutFromSchema;
exports.mapLayout = mapLayout;
exports.getLayoutNode = getLayoutNode;
exports.buildTitleMap = buildTitleMap;
exports.dateToString = dateToString;
exports.stringToDate = stringToDate;
exports.findDate = findDate;
exports.OrderableDirective = OrderableDirective;
exports.JsonSchemaFormComponent = JsonSchemaFormComponent;
exports.JsonSchemaFormService = JsonSchemaFormService;
exports.JsonSchemaFormModule = JsonSchemaFormModule;
exports.WidgetLibraryService = WidgetLibraryService;
exports.WidgetLibraryModule = WidgetLibraryModule;
exports.AddReferenceComponent = AddReferenceComponent;
exports.OneOfComponent = OneOfComponent;
exports.ButtonComponent = ButtonComponent;
exports.CheckboxComponent = CheckboxComponent;
exports.CheckboxesComponent = CheckboxesComponent;
exports.FileComponent = FileComponent;
exports.HiddenComponent = HiddenComponent;
exports.InputComponent = InputComponent;
exports.MessageComponent = MessageComponent;
exports.NoneComponent = NoneComponent;
exports.NumberComponent = NumberComponent;
exports.RadiosComponent = RadiosComponent;
exports.RootComponent = RootComponent;
exports.SectionComponent = SectionComponent;
exports.SelectComponent = SelectComponent;
exports.SelectFrameworkComponent = SelectFrameworkComponent;
exports.SelectWidgetComponent = SelectWidgetComponent;
exports.SubmitComponent = SubmitComponent;
exports.TabComponent = TabComponent;
exports.TabsComponent = TabsComponent;
exports.TemplateComponent = TemplateComponent;
exports.TextareaComponent = TextareaComponent;
exports.FrameworkLibraryService = FrameworkLibraryService;
exports.Framework = Framework;
exports.NoFramework = NoFramework;
exports.NoFrameworkComponent = NoFrameworkComponent;
exports.NoFrameworkModule = NoFrameworkModule;
exports.MaterialDesignFramework = MaterialDesignFramework;
exports.FlexLayoutRootComponent = FlexLayoutRootComponent;
exports.FlexLayoutSectionComponent = FlexLayoutSectionComponent;
exports.MaterialAddReferenceComponent = MaterialAddReferenceComponent;
exports.MaterialOneOfComponent = MaterialOneOfComponent;
exports.MaterialButtonComponent = MaterialButtonComponent;
exports.MaterialButtonGroupComponent = MaterialButtonGroupComponent;
exports.MaterialCheckboxComponent = MaterialCheckboxComponent;
exports.MaterialCheckboxesComponent = MaterialCheckboxesComponent;
exports.MaterialChipListComponent = MaterialChipListComponent;
exports.MaterialDatepickerComponent = MaterialDatepickerComponent;
exports.MaterialFileComponent = MaterialFileComponent;
exports.MaterialInputComponent = MaterialInputComponent;
exports.MaterialNumberComponent = MaterialNumberComponent;
exports.MaterialRadiosComponent = MaterialRadiosComponent;
exports.MaterialSelectComponent = MaterialSelectComponent;
exports.MaterialSliderComponent = MaterialSliderComponent;
exports.MaterialStepperComponent = MaterialStepperComponent;
exports.MaterialTabsComponent = MaterialTabsComponent;
exports.MaterialTextareaComponent = MaterialTextareaComponent;
exports.MaterialDesignFrameworkComponent = MaterialDesignFrameworkComponent;
exports.MaterialDesignFrameworkModule = MaterialDesignFrameworkModule;
exports.Bootstrap3Framework = Bootstrap3Framework;
exports.Bootstrap3FrameworkComponent = Bootstrap3FrameworkComponent;
exports.Bootstrap3FrameworkModule = Bootstrap3FrameworkModule;
exports.Bootstrap4Framework = Bootstrap4Framework;
exports.Bootstrap4FrameworkComponent = Bootstrap4FrameworkComponent;
exports.Bootstrap4FrameworkModule = Bootstrap4FrameworkModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
