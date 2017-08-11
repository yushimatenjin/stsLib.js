﻿/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Core Module
FileName:       stslib_core.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/08/11
//----------------------------------------*/

//----------------------------------------
//・require関数
//----------------------------------------
//  ・  require/moduleの無い環境に対応
//----------------------------------------
if (typeof module === 'undefined') {

  var requireList = requireList || {};
  var require = function (funcName) {
    for ( var item in requireList) {
      if (funcName === item) {
        if (requireList.hasOwnProperty(item)) {
          return requireList[item];
        }
      }
    }
    return undefined;
  };
}

//----------------------------------------
//■全体を囲う無名関数
//----------------------------------------
(function () {

  //----------------------------------------
  //・require実行
  //----------------------------------------
  //  ・requireが必要な場合は次のようにして
  //    実行する
  //----------------------------------------
  // if (typeof module === 'undefined') {
  //   var stsLib = require('stsLib')
  // } else {
  //   var stsLib = require('./stsLib_core.js')
  // }
  //----------------------------------------

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  //  ・名前空間は同じ書き方で別ファイルで
  //    定義し直しても別関数を定義していくことができる
  //----------------------------------------
  var stsLib = stsLib || {};
  (function (lib, global) {
    'use strict';
    var _ = lib;

    //----------------------------------------
    //◆基本的な処理
    //----------------------------------------

    //----------------------------------------
    //・クラス継承関数
    //----------------------------------------
    _.inherits = function(child, parent) {
      function temp() {}
      // ES6
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(child.prototype, parent.prototype);
      }
      // ES5
      else if (Object.create) {
        child.prototype = Object.create(parent.prototype);
      }
      // legacy platform
      else {
        temp.prototype = parent.prototype;
        child.superClass_ = parent.prototype;
        child.prototype = new temp();
        child.prototype.constructor = child;
      }
    };

    //----------------------------------------
    //◆デバッグ処理
    //----------------------------------------
    _.debug = lib.debug || {};
    (function () {
      var _ = lib.debug;

      //----------------------------------------
      //・assert関数
      //----------------------------------------
      //  ・  value が true でなければ
      //      例外を出力する関数
      //  ・  他言語でよく使う
      //----------------------------------------
      _.assert = function (value, message) {

        if ((typeof message === 'undefined')
        || (message === null)) {
          message = '';
        }
        if (typeof value !== 'boolean') {
          throw new Error('Error:' + message);
        }
        if (!value) {
          throw new Error('Error:' + message);
        }
      };

      //----------------------------------------
      //・check関数
      //----------------------------------------
      //  ・  2値が一致するかどうか確認する関数
      //----------------------------------------
      _.check = function (a, b, message) {
        if (a === b) {
          return true;
        }
        if ((typeof message === 'undefined')
        || (message === null)) {
          message = '';
        } else {
          message = 'Test:' + message + '\n';
        }
        message = message +
            'A != B' + '\n' +
            'A = ' + a + '\n' +
            'B = ' + b;
        alert(message);
        return false;
      };

      _.test_check = function () {

        d.check(true, '123' === '123');
        d.check(true, ' 123' == 123);
        d.check(false, ' 123' === 123);
      };

      //----------------------------------------
      //・例外チェック関数
      //----------------------------------------
      //  ・  関数と結果が、=か!=か例外発生かを
      //      判定することができる関数
      //----------------------------------------
      _.checkException = function (funcResult, func) {
        try {
          var args = [].slice.call(arguments,2);
          if (funcResult !== func.apply(null, args)) {
            return 'NG';
          } else {
            return 'OK';
          }
        } catch(e) {
          return 'ER';
        }
      };

      _.test_checkException = function () {

        var testFunc1 = function (a, b) {
          return a / b;
        };
        var testFunc2 = function (a, b) {
          if (b === 0) {
            throw new Error('error');
          }
          return a / b;
        };

        d.check('OK', _.checkException(5, testFunc1, 5, 1));
        d.check('NG', _.checkException(1, testFunc1, 5, 1));
        d.check('OK', _.checkException(2.5, testFunc1, 5, 2));
        d.check('OK', _.checkException(Infinity, testFunc1, 5, 0));
        d.check('OK', _.checkException(5, testFunc2, 5, 1));
        d.check('NG', _.checkException(1, testFunc2, 5, 1));
        d.check('OK', _.checkException(2.5, testFunc2, 5, 2));
        d.check('ER', _.checkException(Infinity, testFunc2, 5, 0));
      };

      //----------------------------------------
      //・例外を含めた結果チェック関数
      //----------------------------------------
      //  ・  returnResultに 'OK'/'NG'/'ER'の
      //      どれかを指定して
      //      funcResultとfuncの戻り値の、一致/不一致/例外発生
      //      をテストすることができる
      //  ・  check関数とcheckException関数の組み合わせで
      //      下記のように実装もできるが
      //      メッセージなど作り込みたかったり
      //      何より単独でコピペできないので
      //      コード行数は長いが、現在の実装を採用する
      //        var checkResult = function (returnResult, funcResult, func) {
      //          var args = [].slice.call(arguments, 1);
      //          check(returnResult, checkException.apply(null, args));
      //        };
      //----------------------------------------
      _.checkResult = function (returnResult, funcResult, func) {
        var args, message, a, b;
        message = '';
        args = [].slice.call(arguments, 3);
        a = funcResult;
        try {
          b = func.apply(null, args);
          if (a === b) {
            if (returnResult !== 'OK') {
              message = returnResult + '!=OK\n' + 
                'A == B' + '\n' +
                'A = ' + a.toString() + '\n' +
                'B = ' + b.toString();
            }
          } else {
            if (returnResult !== 'NG') {
              message = returnResult + '!=NG\n' + 
                'A != B' + '\n' +
                'A = ' + a.toString() + '\n' +
                'B = ' + b.toString();
            }
          }
        } catch(e) {
          if (returnResult !== 'ER') {
            message = returnResult + '!=ER\n' + 
              'A = ' + a.toString() + '\n' +
              'B = undefined';
          }
        }
        if (message !== '') {
          alert(message);
        }
      };

      _.test_checkResult = function () {

        var sampleDiv1 = function (a, b) {
          return a / b;
        };
        var sampleDiv2 = function (a, b) {
          if (b === 0) {
            throw new Error('error');
          }
          return a / b;
        };

        d.checkResult('OK', 5,       sampleDiv1, 5, 1);
        d.checkResult('NG', 1,       sampleDiv1, 5, 1);
        d.checkResult('OK', 2.5,     sampleDiv1, 5, 2);
        d.checkResult('OK', Infinity,sampleDiv1, 5, 0);
        d.checkResult('OK', 5,       sampleDiv2, 5, 1);
        d.checkResult('NG', 1,       sampleDiv2, 5, 1);
        d.checkResult('OK', 2.5,     sampleDiv2, 5, 2);
        d.checkResult('ER', Infinity,sampleDiv2, 5, 0);
      };

      _.benchMark = function (loopCount, func) {
        var startTime = new Date();

        var args = [].slice.call(arguments,2);

        for (var i = 0, max = loopCount - 1;
          i <= max - 1; i++) {
          func.apply(null, args);
        }

        var endTime = new Date();
        return endTime - startTime;
      };

    }());
    var d = lib.debug;  //ショートカット呼び出し

    //----------------------------------------
    //◆条件判断
    //----------------------------------------
    _.compare = lib.compare || {};
    (function () {
      var _ = lib.compare;

      //----------------------------------------
      //・orValue関数
      //----------------------------------------
      //  ・  値が引数と一致しているかどうかを確認する関数
      //  ・  orValue(a, 0, 1); として
      //      aが0か1かならtrueを返す
      //----------------------------------------
      _.orValue = function (value, compares) {

        d.assert(2 <= arguments.length);
        var count = arguments.length;
        for (var i = 1; i < count; i += 1) {
          if (value === arguments[i]) {
            return true;
          }
        }
        return false;
      };

      _.test_orValue = function () {

        var a = 1;
        d.check(true, _.orValue(a, 1));
        d.check(true, _.orValue(a, 1, 2));
        d.check(true, _.orValue(a, 1, 2, 3));
        d.check(false,_.orValue(a, 2, 3, 4));
        d.checkResult('ER', 0, _.orValue, a);
      };

    }());
    var c = lib.compare;  //ショートカット呼び出し

    //----------------------------------------
    //◆型 確認/変換 処理
    //----------------------------------------
    _.type = lib.type || {};
    (function () {
      var _ = lib.type;

      //----------------------------------------
      //◇引数すべてに型をチェックする
      //----------------------------------------

      //----------------------------------------
      //・argumentsのような arraylike なものを配列にする
      //----------------------------------------
      //  ・ES6だと args = Array.from(arguments) とできる
      //  ・private関数なのでライブラリ内のみ使用可能
      //----------------------------------------
      var argsToArray = function (values) {
        return Array.prototype.slice.call(values);
      };

      _.isTypeCheck = function (checkFunc, argsArray) {
        d.assert(1 <= arguments.length);
        d.assert(typeof checkFunc == 'function');
        d.assert(Array.isArray(argsArray));

        var l = argsArray.length;
        if (l === 0) {
          return false;
        } else if (l === 1) {
          return checkFunc(argsArray[0]);
        } else {
          for (var i = 0; i < l; i += 1) {
            if (!checkFunc(argsArray[i])) {
              return false;
            }
          }
          return true;
        }
      };

      //----------------------------------------
      //◇Undefined/null チェック
      //----------------------------------------
      //  ・引数の数が1で配列ではない場合は
      //    高速化のために単独でチェックする
      //----------------------------------------
      _.isUndefined = function (value) {
        var func = function (v) {
          return (typeof v === 'undefined');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotUndefined = function (value) {
        var func = function (v) {
          return (typeof v !== 'undefined');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNull = function (value) {
        var func = function (v) {
          return (v === null);
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotNull = function (value) {
        var func = function (v) {
          return (v !== null);
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNullOrUndefined = function (value) {
        var func = function (v) {
          return _.isNull(v) || _.isUndefined(v);
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotNullOrUndefined = function (value) {
        var func = function (v) {
          return !(_.isNull(v) || _.isUndefined(v));
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.test_isNullOrUndefined = function () {

        var u1;
        var n1 = null;
        var v1 = 1;

        d.check(true,   _.isUndefined(u1));
        d.check(false,  _.isNull(u1));
        d.check(true,   _.isNullOrUndefined(u1));

        d.check(false,  _.isUndefined(n1));
        d.check(true,   _.isNull(n1));
        d.check(true,   _.isNullOrUndefined(n1));

        d.check(false,  _.isUndefined(v1));
        d.check(false,  _.isNull(v1));
        d.check(false,  _.isNullOrUndefined(v1));

        var u2;
        var n2 = null;
        var v2 = 1;
        d.check(true,   _.isUndefined(u1, u2));
        d.check(false,  _.isUndefined(u1, n2));
        d.check(false,  _.isUndefined(u1, v2));

        d.check(false,  _.isNull(n1, u2), '01');
        d.check(true,   _.isNull(n1, n2));
        d.check(false,  _.isNull(n1, v2));

        d.check(true,   _.isNullOrUndefined(u1, u2));
        d.check(true,   _.isNullOrUndefined(u1, n2));
        d.check(false,  _.isNullOrUndefined(u1, v2));
        d.check(true,   _.isNullOrUndefined(n1, u2));
        d.check(true,   _.isNullOrUndefined(n1, n2));
        d.check(false,  _.isNullOrUndefined(n1, v2));

        d.check(false,  _.isNotNullOrUndefined(u1, u2));
        d.check(false,  _.isNotNullOrUndefined(u1, n2));
        d.check(false,  _.isNotNullOrUndefined(u1, v2));
        d.check(false,  _.isNotNullOrUndefined(n1, u2));
        d.check(false,  _.isNotNullOrUndefined(n1, n2));
        d.check(false,  _.isNotNullOrUndefined(n1, v2));
        d.check(true,   _.isNotNullOrUndefined(v1, v2));

      };

      //----------------------------------------
      //◇isBoolean
      //----------------------------------------
      //  ・可変引数の全てがBooleanかどうかを確認する
      //----------------------------------------
      _.isBoolean = function (value) {
        var func = function (v) {
          return (typeof v === 'boolean');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotBoolean = function (value) {
        var func = function (v) {
          return (typeof v !== 'boolean');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.test_isBoolean = function () {

        d.check(true, _.isBoolean(true));
        d.check(true, _.isBoolean(false));
        d.check(false,_.isBoolean(undefined));
        d.check(false,_.isBoolean(null));
        d.check(false,_.isBoolean(''));
        d.check(false,_.isBoolean('true'));
        d.check(false,_.isBoolean('false'));
        d.check(false,_.isBoolean(123));
        d.check(false,_.isBoolean(0));
        d.check(false,_.isBoolean(-1));

        d.check(true, _.isBoolean(true, true));
        d.check(true, _.isBoolean(true, true, true));
        d.check(true, _.isBoolean(true, false, true));
        d.check(false, _.isBoolean(true, 1, true));
      };

      //----------------------------------------
      //◇isNumbers
      //----------------------------------------
      //  ・可変引数の全てが有効数値かどうかを確認する
      //  ・NaNやInfinityは有効数値ではないとしておく
      //----------------------------------------

      _.isNumber = function (value) {
        var func = function (v) {
          return ((typeof v === 'number') && (isFinite(v)));
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotNumber = function (value) {
        var func = function (v) {
          return !((typeof v === 'number') && (isFinite(v)));
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.test_isNumber = function () {

        d.check(true, _.isNumber(123));
        d.check(true, _.isNumber(0));
        d.check(true, _.isNumber(-1));
        d.check(true ,_.isNumber(123.4));
        d.check(true, _.isNumber(123.0));
        d.check(false,_.isNumber(true));
        d.check(false,_.isNumber(false));
        d.check(false,_.isNumber(null));
        d.check(false,_.isNumber(undefined));
        d.check(false,_.isNumber(Infinity));  //InfinityもNumberとして許可しないことにする
        d.check(false,_.isNumber(NaN));
        d.check(false,_.isNumber(''));
        d.check(false,_.isNumber('ABC'));
        d.check(false,_.isNumber('ABC10'));
        d.check(false,_.isNumber('10ABC'));
        d.check(false,_.isNumber('0ABC'));
        d.check(false,_.isNumber('0'));
        d.check(false,_.isNumber('5'));
        d.check(false,_.isNumber('-5'));
        d.check(false,_.isNumber('100'));
        d.check(false,_.isNumber('-100'));
        d.check(false,_.isNumber([]));
        d.check(false,_.isNumber({}));

        d.check(false,  _.isNotNumber(123));
        d.check(false,  _.isNotNumber(0));
        d.check(true,   _.isNotNumber(true));
        d.check(true,   _.isNotNumber(null));
        d.check(true,   _.isNotNumber(undefined));
        d.check(true,   _.isNotNumber(Infinity));
        d.check(true,   _.isNotNumber(NaN));
        d.check(true,   _.isNotNumber(''));

        d.check(true,   _.isNumber(1, 2));
        d.check(true,   _.isNumber(3, 4, 5));
        d.check(true,   _.isNumber(10.5, 20.5, 30.5));
        d.check(false,  _.isNumber(1, 2, true));

        d.check(false,  _.isNotNumber(1, 2));
        d.check(false,  _.isNotNumber(3, 4, 5));
        d.check(false,  _.isNotNumber(10.5, 20.5, 30.5));
        d.check(false,  _.isNotNumber(1, 2, true));
        d.check(true,   _.isNotNumber(false, true));
        d.check(true,   _.isNotNumber('a', 'b'));
      };

      //----------------------------------------
      //◇isInt
      //----------------------------------------
      //  ・可変引数の全てが整数かどうかを確認する
      //----------------------------------------

      _.isInt = function (value) {
        var func = function (v) {
          if (!_.isNumber(v)) {
            return false;
          }
          return Math.round(v) === v;
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotInt = function (value) {
        var func = function (v) {
          if (!_.isNumber(v)) {
            return true;
          }
          return Math.round(v) !== v;
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.test_isInt = function () {

        d.check(true, _.isInt(123));
        d.check(true, _.isInt(0));
        d.check(true, _.isInt(-1));
        d.check(false,_.isInt(123.4));
        d.check(true, _.isInt(123.0));
        //.0の場合は整数か小数かは判断できない

        d.check(false,_.isInt(true));
        d.check(false,_.isInt(false));
        d.check(false,_.isInt(null));
        d.check(false,_.isInt(undefined));
        d.check(false,_.isInt(''));
        d.check(false,_.isInt('ABC'));
        d.check(false,_.isInt('0'));
        d.check(false,_.isInt('5'));
        d.check(false,_.isInt('-5'));
        d.check(false,_.isInt('100'));
        d.check(false,_.isInt('-100'));
        d.check(false,_.isInt([]));
        d.check(false,_.isInt({}));

        d.check(true,   _.isInt(1, 2));
        d.check(true,   _.isInt(3, 4, 5));
        d.check(true,   _.isInt(10, 20, 30));
        d.check(false,  _.isInt(1, 2, 3.5));

        d.check(false,  _.isNotInt(1, 2));
        d.check(false,  _.isNotInt(3, 4, 5));
        d.check(false,  _.isNotInt(10, 20, 30));
        d.check(false,  _.isNotInt(1, 2, 3.5));
        d.check(false,  _.isNotInt(1, 2.1, 3.5));
        d.check(true,   _.isNotInt(1.1, 2.2, 3.5));

        d.check(false,  _.isInt([]));
        d.check(true,   _.isInt([1]));
        d.check(true,   _.isInt([1, 2, 3]));
        d.check(true,   _.isInt([1, 2, 0]));
        d.check(false,  _.isInt([1, 2, NaN]));
        d.check(false,  _.isInt([1, 2, null]));
        d.check(false,  _.isInt(['a', 'b', 1]));
      };

      //----------------------------------------
      //◇isString
      //----------------------------------------
      //  ・可変引数の全てが文字列かどうかを確認する
      //----------------------------------------
      _.isString = function (value) {
        var func = function (v) {
          return (typeof v === 'string');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotString = function (value) {
        var func = function (v) {
          return (typeof v !== 'string');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.test_isString = function () {
        d.check(false,  _.isString([]));
        d.check(true,   _.isString(['']));
        d.check(true,   _.isString(['a']));
        d.check(true,   _.isString(['a', 'b', 'c']));
        d.check(true,   _.isString(['a', 'b', '']));
        d.check(false,  _.isString(['a', 'b', 0]));
        d.check(false,  _.isString(['a', 'b', 1]));
        d.check(false,  _.isString(['a', 'b', null]));
        d.check(false,  _.isString(['a', 'b', undefined]));
      };

      //----------------------------------------
      //◇isFunction
      //----------------------------------------
      //  ・可変引数の全てが関数かどうかを確認する
      //----------------------------------------

      _.isFunction = function (value) {
        var func = function (v) {
          return (typeof v === 'function');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      _.isNotFunction = function (value) {
        var func = function (v) {
          return (typeof v !== 'function');
        };
        if ((arguments.length === 1) && (!Array.isArray(value))) {
          return func(value);
        }
        return _.isTypeCheck(func,
          a.multiDimensionExpand(argsToArray(arguments)));
      };

      //----------------------------------------
      //◇Null Undefined 
      //----------------------------------------

      //----------------------------------------
      //・値が NullOrUndefined なら特定の値を返す
      //----------------------------------------
      //  ・引数のデフォルト値として使える
      //----------------------------------------
      _.ifNullOrUndefinedValue = function (value, defaultValue) {
        if (_.isNullOrUndefined(value)) {
          return defaultValue;
        } else {
          return value;
        }
      };

      _.test_ifNullOrUndefinedValue = function () {
        d.check(1,  _.ifNullOrUndefinedValue(1, 5));
        d.check(5,  _.ifNullOrUndefinedValue(null, 5));
        d.check(5,  _.ifNullOrUndefinedValue(undefined, 5));
        d.check('', _.ifNullOrUndefinedValue('', 5));
      };


    }());
    var t = lib.type;  //ショートカット呼び出し

    //----------------------------------------
    //◆数値
    //----------------------------------------
    _.number = lib.number || {};
    (function () {
      var _ = lib.number;

      //----------------------------------------
      //・四捨五入する
      //----------------------------------------
      //  ・  digitは桁数
      //      0なら1の位
      //      1なら小数点1位
      //      2なら小数点2位
      //      -1なら10の位
      //      -2なら100の位
      //      四捨五入して、その位にする
      //----------------------------------------
      _.round = function (value, digit) {

        var powResult;
        if (t.isNullOrUndefined(digit)) {
          digit = 0;
        }
        d.assert(t.isInt(digit));
        var minusFlag = value < 0 ? true: false;
        powResult = Math.pow(10, digit);
        if (minusFlag !== true) {
          return Math.round(value * powResult) / powResult;
        } else {
          return -1 * Math.round(-1 * value * powResult) / powResult;
        }
      };

      _.test_round = function () {

        d.check(5,    _.round(5));
        d.check(5,    _.round(5.4));
        d.check(6,    _.round(5.5));
        d.check(5,    _.round(5,    0));
        d.check(5,    _.round(5.4,  0));
        d.check(6,    _.round(5.5,  0));
        d.check(5.4,  _.round(5.44, 1));
        d.check(5.5,  _.round(5.45, 1));
        d.check(5.5,  _.round(5.54, 1));
        d.check(5.6,  _.round(5.55, 1));
        d.check(5.04, _.round(5.044, 2));
        d.check(5.05, _.round(5.045, 2));
        d.check(5.05, _.round(5.054, 2));
        d.check(5.06, _.round(5.055, 2));
        d.check(540,  _.round(544, -1));
        d.check(550,  _.round(545, -1));
        d.check(550,  _.round(554, -1));
        d.check(560,  _.round(555, -1));
        d.check(5400, _.round(5440, -2));
        d.check(5500, _.round(5450, -2));
        d.check(5500, _.round(5540, -2));
        d.check(5600, _.round(5550, -2));

        d.check(-5,    _.round(-5));
        d.check(-5,    _.round(-5.4));
        d.check(-6,    _.round(-5.5));
        d.check(-5,    _.round(-5,    0));
        d.check(-5,    _.round(-5.4,  0));
        d.check(-6,    _.round(-5.5,  0));
        d.check(-5.4,  _.round(-5.44, 1));
        d.check(-5.5,  _.round(-5.45, 1));
        d.check(-5.5,  _.round(-5.54, 1));
        d.check(-5.6,  _.round(-5.55, 1));
        d.check(-5.04, _.round(-5.044, 2));
        d.check(-5.05, _.round(-5.045, 2));
        d.check(-5.05, _.round(-5.054, 2));
        d.check(-5.06, _.round(-5.055, 2));
        d.check(-540,  _.round(-544, -1));
        d.check(-550,  _.round(-545, -1));
        d.check(-550,  _.round(-554, -1));
        d.check(-560,  _.round(-555, -1));
        d.check(-5400, _.round(-5440, -2));
        d.check(-5500, _.round(-5450, -2));
        d.check(-5500, _.round(-5540, -2));
        d.check(-5600, _.round(-5550, -2));
      };

      //----------------------------------------
      //・ニアイコールを判定する
      //----------------------------------------
      _.nearEqual = function (a, b, diff) {

        d.assert(t.isNumber(a));
        d.assert(t.isNumber(b));
        d.assert(t.isNumber(diff));
        d.assert(0 <= diff);
        if ( Math.abs(a - b) <= diff ) {
          return true;
        } else {
          return false;
        }
      };

      _.test_nearEqual = function () {

        d.check(true, _.nearEqual(0.049999,   0.050011,     0.001));
        d.check(true, _.nearEqual(0.050,      0.051,        0.001));
        d.check(true, _.nearEqual(0.050,      0.0509,       0.001));
        d.check(true, _.nearEqual(0.050,      0.0510,       0.001));
        d.check(false,_.nearEqual(0.050,      0.051000001,  0.001));
        d.check(true, _.nearEqual(0.050011,   0.049999,     0.001));
        d.check(true, _.nearEqual(0.051,      0.050,        0.001));
        d.check(true, _.nearEqual(0.0509,     0.050,        0.001));
        d.check(true, _.nearEqual(0.0510,     0.050,        0.001));
        d.check(false,_.nearEqual(0.051000001,0.050,        0.001));

        d.checkResult('ER', null, _.nearEqual, '0.50', 0.51, 0.001);
        d.checkResult('ER', null, _.nearEqual, 0.50, '0.51', 0.001);
        d.checkResult('ER', null, _.nearEqual, 0.50, 0.51, '0.001');
        d.checkResult('ER', null, _.nearEqual, 0.50, 0.51, -0.001);
      };

      //----------------------------------------
      //・範囲内に値が含まれるかどうか確認
      //----------------------------------------
      _.isRange = function (value, from, to) {

        d.assert(t.isNumber(from));
        d.assert(t.isNumber(to));
        d.assert(from <= to);

        if ((from <= value) && (value <= to)) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・数値を3桁カンマ区切りなどにする
      //----------------------------------------
      //  ・整数部分は右から
      //    小数部分は左から桁区切りする
      //----------------------------------------
      _.formatDigitComma = function (value,
        delimiterInt, digitInt, delimiterFloat, digitFloat) {

        d.assert(t.isNumber(value));
        d.assert(t.isInt(digitInt, digitFloat));
        d.assert(t.isString(delimiterInt, delimiterFloat));

        var valueStr = value.toString();
        if (t.isInt(value)) {
          return s.formatInsertLast(valueStr, delimiterInt, digitInt);
        } else {
          return (
            s.formatInsertLast(
              s.startFirstDelim(valueStr, '.'),
              delimiterInt, digitInt) +
            '.' + 
            s.formatInsertFirst(
              s.endFirstDelim(valueStr, '.'),
              delimiterFloat, digitFloat));
        }
      };

      _.test_formatDigitComma = function () {

        d.check('123,456,789.123 456 7',
          _.formatDigitComma(123456789.1234567, ',', 3, ' ', 3));
        d.check('123,456,789',
          _.formatDigitComma(123456789, ',', 3, ' ', 3));
        d.check('1,234,567,890',
          _.formatDigitComma(1234567890, ',', 3, ' ', 3));
        d.check('0.123 456 789 012',
          _.formatDigitComma(.123456789012, ',', 3, ' ', 3));
        d.check('0.012 345 678 901 2',
          _.formatDigitComma(.0123456789012, ',', 3, ' ', 3));
      };

    }());
    // var n = lib.number;  //ショートカット呼び出し

    //----------------------------------------
    //◆角度
    //----------------------------------------
    _.angle = lib.angle || {};
    (function () {
      var _ = lib.angle;

      //----------------------------------------
      //・ラジアンと角度相互変換
      //----------------------------------------
      _.degreeToRadian = function (value) {
        return value * Math.PI / 180;
      };

      _.radianToDegree = function (value) {
        return value * 180 / Math.PI;
      };

      _.test_degreeToRadian = function () {

        d.check(0, _.degreeToRadian(0));
        d.check(Math.PI / 6, _.degreeToRadian(30));
        d.check(0, _.radianToDegree(0));
        d.check(30, Math.round(_.radianToDegree(Math.PI / 6)));
      };

      //----------------------------------------
      //・絶対角度から相対角度を求める
      //----------------------------------------
      //  ・  base と target は角度の絶対座標で
      //      0度から360度とする。
      //      それ以上それ以下でも0-360に丸め込まれる
      //  ・  戻り値は -180～+180 になる
      //----------------------------------------
      _.angleRelative = function (base, target) {
        base = base % 360;
        target = target % 360;
        var result = target - base;
        //result は -360～+360になる
        if (180 < result) {
          result = result -360;
        } else if (result < -180) {
          result = result + 360;
        }
        return result;
      };

      _.test_angleRelative = function () {

        d.check(10, _.angleRelative(5, 15));
        d.check(-10, _.angleRelative(15, 5));

        d.check(90, _.angleRelative(90, 180));
        d.check(180, _.angleRelative(90, 270));
        d.check(180, _.angleRelative(0, 180));

        d.check(-179, _.angleRelative(0, 181));
        d.check(179, _.angleRelative(181, 0));
        d.check(-179, _.angleRelative(179, 0));
      };
    }());

    //----------------------------------------
    //◆配列処理
    //----------------------------------------

    _.array = lib.array || {};
    (function () {
      var _ = lib.array;

      //----------------------------------------
      //・配列の値で比較する関数
      //----------------------------------------
      _.equal = function (value1, value2) {

        d.assert(Array.isArray(value1));
        d.assert(Array.isArray(value2));

        return value1.toString() === value2.toString();
      };

      _.test_equal = function ()
      {

        var a1 = [1, 2, 3];
        var a2 = [1, 2, 3];

        d.check(false, a1 == a2);
        d.check(false, a1 === a2);

        d.check(true, _.equal(a1, a2));
      };


      //----------------------------------------
      //◇insert add
      //----------------------------------------

      //----------------------------------------
      //・insert
      //----------------------------------------
      //  ・元の配列の内容を変更するinsert
      //  ・戻り値も同じ配列の参照を返す
      //  ・indexはarray.lengthと同じ値の場合は
      //    配列に追加することになる
      //  ・unshiftやpushはspliceを使えば使わなくてよい
      //----------------------------------------
      _.insert = function (array, value, index) {
        d.assert(Array.isArray(array));
        index = t.ifNullOrUndefinedValue(index, 0);
        d.assert(t.isInt(index));

        array.splice(index, 0, value);
        return array;
      };

      //----------------------------------------
      //・insertAdd
      //----------------------------------------
      //  ・指定した項目の下の位置にinsertする関数
      //----------------------------------------
      _.insertAdd = function (array, value, index) {
        return _.insert(array, value, index + 1);
      };

      //----------------------------------------
      //・add
      //----------------------------------------
      //  ・Array.prototype.push と同等の機能。
      //----------------------------------------

      _.add = function (array, value) {
        _.insert(array, value, array.length);
        return array;
      };

      _.test_insert = function () {
        var a1 = [1,2,3];
        var a2 = _.insert(a1, 0);
        d.check(true, _.equal([0,1,2,3], a1));
        d.check(true, _.equal([0,1,2,3], a2));

        a1[0] = 4;
        d.check(true, _.equal([4,1,2,3], a1));
        d.check(true, _.equal([4,1,2,3], a2));

        d.check(true, _.equal([4,0,1,2,3], _.insert(a1, 0, 1)));
        d.check(true, _.equal([4,0,1,2,3,4], _.insert(a1, 4, 5)));
      };

      //----------------------------------------
      //◇delete
      //----------------------------------------

      //----------------------------------------
      //・Index指定のdelete
      //----------------------------------------
      //  ・indexは負の値などには対応しない
      //  ・endIndexを省略すると最後まで削除する
      //----------------------------------------
      _.deleteIndex = function (array, startIndex, endIndex) {
        d.assert(Array.isArray(array));
        endIndex = t.ifNullOrUndefinedValue(endIndex, array.length - 1);
        d.assert(t.isInt(startIndex, endIndex));
        d.assert((0 <= startIndex) && (startIndex <= array.length - 1));
        d.assert((0 <= endIndex));
        d.assert(startIndex <= endIndex);

        array.splice(startIndex, endIndex - startIndex + 1);
        return array;
      };

      _.test_deleteIndex = function () {
        d.check(true, _.equal([1,3],_.deleteIndex([1,2,3], 1, 1)));
        d.check(true, _.equal([1],  _.deleteIndex([1,2,3], 1, 2)));
        d.check(true, _.equal([],   _.deleteIndex([1,2,3], 0, 3)));
        d.check(true, _.equal([1,5],   _.deleteIndex([1,2,3,4,5], 1, 3)));
        d.check(true, _.equal([1,2],   _.deleteIndex([1,2,3,4,5], 2)));
      };

      //----------------------------------------
      //・Length指定のdelete
      //----------------------------------------
      _.deleteLength = function (array, startIndex, length) {
        d.assert(Array.isArray(array));
        length = t.ifNullOrUndefinedValue(length, array.length - startIndex);
        d.assert(t.isInt(startIndex, length));
        d.assert((0 <= startIndex) && (startIndex <= array.length - 1));
        d.assert((1 <= length));
        
        array.splice(startIndex, length);
        return array;
      };

      _.test_deleteLength = function () {
        d.check(true, _.equal([1,3],_.deleteLength([1,2,3], 1, 1)));
        d.check(true, _.equal([3],  _.deleteLength([1,2,3], 0, 2)));
        d.check(true, _.equal([],   _.deleteLength([1,2,3], 0, 3)));
        d.check(true, _.equal([1,5],   _.deleteLength([1,2,3,4,5], 1, 3)));
      };

      //----------------------------------------
      //◇indexOf
      //----------------------------------------

      _.indexOfFirst = function (array, search, startIndex) {

        d.assert(Array.isArray(array));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        d.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex, max = array.length; i < max; i += 1) {
            if (array[i] === search) {
              return i;
            }
          }
          return -1;
        }
        //上記ブロックはWSH以外なら下記で書ける
        //return array.indexOf(search, startIndex);
      }; 

      _.test_indexOfFirst = function () {

        d.check(-1, _.indexOfFirst(['a','b','c'], 'd'));
        d.check( 0, _.indexOfFirst(['a','b','c'], 'a'));
        d.check( 1, _.indexOfFirst(['a','b','c'], 'b'));
        d.check( 2, _.indexOfFirst(['a','b','c'], 'c'));
        d.check(-1, _.indexOfFirst(['a','b','c'], ''));
        d.check( 0, _.indexOfFirst(['a','b','c','a','b','c'], 'a'));
        d.check( 1, _.indexOfFirst(['a','b','c','a','b','c'], 'b'));
        d.check( 2, _.indexOfFirst(['a','b','c','a','b','c'], 'c'));

        d.check( 0, _.indexOfFirst(['a','b','c','a','b','c'], 'a', 0));
        d.check( 3, _.indexOfFirst(['a','b','c','a','b','c'], 'a', 1));
        d.check( 1, _.indexOfFirst(['a','b','c','a','b','c'], 'b', 1));
        d.check( 4, _.indexOfFirst(['a','b','c','a','b','c'], 'b', 2));
        d.check( 2, _.indexOfFirst(['a','b','c','a','b','c'], 'c', 2));
        d.check( 5, _.indexOfFirst(['a','b','c','a','b','c'], 'c', 3));

        d.check(-1, _.indexOfFirst(['a','b','c','a','b','c'], 'a', -1));
        d.check( 3, _.indexOfFirst(['a','b','c','a','b','c'], 'a', -3));
        d.check(-1, _.indexOfFirst(['a','b','c','a','b','c'], 'b', -1));
        d.check( 4, _.indexOfFirst(['a','b','c','a','b','c'], 'b', -2));
        d.check( 5, _.indexOfFirst(['a','b','c','a','b','c'], 'c', -1));
        d.check( 2, _.indexOfFirst(['a','b','c','a','b','c'], 'c', -4));
      };


      _.indexOfLast = function (array, search, startIndex) {

        d.assert(Array.isArray(array));
        startIndex = t.ifNullOrUndefinedValue(startIndex, array.length - 1);
        d.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex; 0 <= i; i -= 1) {
            if (array[i] === search) {
              return i;
            }
          }
          return -1;
        }
        //上記ブロックはWSH以外なら下記で書ける
        //return array.lastIndexOf(search, startIndex);
      }; 

      _.test_indexOfLast = function () {

        d.check(-1, _.indexOfLast(['a','b','c'], 'd'));
        d.check( 0, _.indexOfLast(['a','b','c'], 'a'));
        d.check( 1, _.indexOfLast(['a','b','c'], 'b'), '03');
        d.check( 2, _.indexOfLast(['a','b','c'], 'c'));
        d.check(-1, _.indexOfLast(['a','b','c'], ''));
        d.check( 3, _.indexOfLast(['a','b','c','a','b','c'], 'a'));
        d.check( 4, _.indexOfLast(['a','b','c','a','b','c'], 'b'));
        d.check( 5, _.indexOfLast(['a','b','c','a','b','c'], 'c'));

        d.check( 0, _.indexOfLast(['a','b','c','a','b','c'], 'a', 1));
        d.check( 3, _.indexOfLast(['a','b','c','a','b','c'], 'a', 3));
        d.check( 1, _.indexOfLast(['a','b','c','a','b','c'], 'b', 1));
        d.check( 4, _.indexOfLast(['a','b','c','a','b','c'], 'b', 4));
        d.check( 2, _.indexOfLast(['a','b','c','a','b','c'], 'c', 2));
        d.check( 5, _.indexOfLast(['a','b','c','a','b','c'], 'c', 5));

        d.check( 3, _.indexOfLast(['a','b','c','a','b','c'], 'a', -1));
        d.check( 0, _.indexOfLast(['a','b','c','a','b','c'], 'a', -4));
        d.check( 0, _.indexOfLast(['a','b','c','a','b','c'], 'a', -6));
        d.check(-1, _.indexOfLast(['a','b','c','a','b','c'], 'a', -7));
        d.check( 4, _.indexOfLast(['a','b','c','a','b','c'], 'b', -1));
        d.check( 1, _.indexOfLast(['a','b','c','a','b','c'], 'b', -3));
        d.check( 1, _.indexOfLast(['a','b','c','a','b','c'], 'b', -5));
        d.check(-1, _.indexOfLast(['a','b','c','a','b','c'], 'b', -6));
        d.check( 5, _.indexOfLast(['a','b','c','a','b','c'], 'c', -1));
        d.check( 2, _.indexOfLast(['a','b','c','a','b','c'], 'c', -2));
        d.check( 2, _.indexOfLast(['a','b','c','a','b','c'], 'c', -4));
        d.check(-1, _.indexOfLast(['a','b','c','a','b','c'], 'c', -5));
      };

      //----------------------------------------
      //◇配列内配列の場合に値の内容で見つけるためのindexOf
      //----------------------------------------
      _.indexOfArrayFirst = function (array, search, startIndex) {

        d.assert(Array.isArray(array));
        d.assert(Array.isArray(search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        d.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex, max = array.length; i < max; i += 1) {
            if (_.equal(array[i], search)) {
              return i;
            }
          }
          return -1;
        }
      };

      _.test_indexOfArrayFirst = function () {

        var arrayList = [];
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);

        var a1 = [1, 2, 3];
        d.check(-1, _.indexOfArrayFirst(arrayList, a1));

        d.check(0, _.indexOfArrayFirst(arrayList, [1, 1, 1]));
        d.check(1, _.indexOfArrayFirst(arrayList, [2, 2, 2]));
        d.check(2, _.indexOfArrayFirst(arrayList, [3, 3, 3]));
        d.check(3, _.indexOfArrayFirst(arrayList, [1, 1, 1], 1));
        d.check(4, _.indexOfArrayFirst(arrayList, [2, 2, 2], 2));
        d.check(5, _.indexOfArrayFirst(arrayList, [3, 3, 3], 3));
      };

      _.indexOfArrayLast = function (array, search, startIndex) {

        d.assert(Array.isArray(array));
        d.assert(Array.isArray(search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, array.length - 1);
        d.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex; 0 <= i; i -= 1) {
            if (_.equal(array[i], search)) {
              return i;
            }
          }
          return -1;
        }
      };

      _.test_indexOfArrayLast = function () {

        var arrayList = [];
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);

        var a1 = [1, 2, 3];
        d.check(-1, _.indexOfArrayLast(arrayList, a1));

        d.check( 3, _.indexOfArrayLast(arrayList, [1, 1, 1]));
        d.check( 4, _.indexOfArrayLast(arrayList, [2, 2, 2]));
        d.check( 5, _.indexOfArrayLast(arrayList, [3, 3, 3]));
        d.check( 3, _.indexOfArrayLast(arrayList, [1, 1, 1], -1));
        d.check( 3, _.indexOfArrayLast(arrayList, [1, 1, 1], -3));
        d.check( 0, _.indexOfArrayLast(arrayList, [1, 1, 1], -4));
        d.check( 0, _.indexOfArrayLast(arrayList, [1, 1, 1], -6));
        d.check(-1, _.indexOfArrayLast(arrayList, [1, 1, 1], -7));
        d.check( 4, _.indexOfArrayLast(arrayList, [2, 2, 2], -1));
        d.check( 4, _.indexOfArrayLast(arrayList, [2, 2, 2], -2));
        d.check( 1, _.indexOfArrayLast(arrayList, [2, 2, 2], -3));
        d.check( 1, _.indexOfArrayLast(arrayList, [2, 2, 2], -5));
        d.check(-1, _.indexOfArrayLast(arrayList, [2, 2, 2], -6));
        d.check( 5, _.indexOfArrayLast(arrayList, [3, 3, 3], -1));
        d.check( 2, _.indexOfArrayLast(arrayList, [3, 3, 3], -2));
        d.check( 2, _.indexOfArrayLast(arrayList, [3, 3, 3], -4));
        d.check(-1, _.indexOfArrayLast(arrayList, [3, 3, 3], -5));
      };

      //----------------------------------------
      //◇多次元配列
      //----------------------------------------

      //----------------------------------------
      //・多次元配列を展開する
      //----------------------------------------
      //  ・空配列に対しては何も展開しないので
      //    [1, [], 2, [[], 3]]は
      //    [1,2,3]になる
      //  ・空文字に対しては展開するので
      //    ['1', [], '2', [[], '3']]は
      //    ['1','2','3']になり
      //    ['1', [''], '2', [[''], '3']]は
      //    ['1','','2','','3']になる
      //----------------------------------------
      _.multiDimensionExpand = function (array) {
        d.assert(Array.isArray(array));
        var result = [];
        var f = function (value) {
          for (var i = 0, l = value.length; i < l; i += 1) {
            var arrayItem = value[i];
            if (Array.isArray(arrayItem)) {
              f(arrayItem);
            } else {
              result.push(arrayItem);
            }
          }
        };
        f(array);
        return result;
      };

      _.test_multiDimensionExpand = function () {
        d.check('1,2,3,4',          _.multiDimensionExpand([1,2,3,4]).join());
        d.check('1,2,3,4',          _.multiDimensionExpand([[1,2],3,4]).join());
        d.check('1,2,3,4',          _.multiDimensionExpand([[1,2],[3,4]]).join());
        d.check('1,2,3,4,5,6',      _.multiDimensionExpand([1,2,3,4,5,6]).join());
        d.check('1,2,3,4,5,6',      _.multiDimensionExpand([[1,2],[3,4], 5, 6]).join());
        d.check('1,2,3,4,5,6',      _.multiDimensionExpand([[1,2,3,4], 5, 6]).join());
        d.check('1,2,3,4,5,6',      _.multiDimensionExpand([[1,[2,3],4], 5, 6]).join());
        d.check('1,2,3,4,5,6',      _.multiDimensionExpand([[[1,[2,3]],4], [5, 6]]).join());
        d.check('1,2,3,4,5,6',      _.multiDimensionExpand([[[[[[1],2],3],4],5],6]).join());
        d.check('1,2,3,4,5,6,7,8',  _.multiDimensionExpand([[1,[2,3],4], [5, [6, 7], 8]]).join());
        d.check('', [].join());
        d.check('', [].join(','));
        d.check('1', [1].join(','));
        d.check('1,2', [1,2].join(','));
        d.check('1,2,3,4,5,6,7,8',  [[1,[2,3],4], [5, [6, 7], 8]].join());
        d.check('1,,4,5,6,7,8',  [[1,'',4], [5, [6, 7], 8]].join());
        d.check('',     _.multiDimensionExpand([]).join());
        d.check('3',    _.multiDimensionExpand([[], [3], []]).join());
        d.check('3,4',  _.multiDimensionExpand([[], [3,4], []]).join());
        d.check('3,4',  _.multiDimensionExpand([[], [3],[4], []]).join());
        d.check('3,4',  _.multiDimensionExpand([[], [[3],[4]], []]).join());
        d.check(',3,4,',  [[], [[3],[4]], []].join());
        d.check('1,2,3',  _.multiDimensionExpand([1, [], 2, [[], 3]]).join());
        d.check(3,        _.multiDimensionExpand([1, [], 2, [[], 3]]).length);
        d.check('1,2,3',  _.multiDimensionExpand(['1', [], '2', [[], '3']]).join());
        d.check(3,        _.multiDimensionExpand(['1', [], '2', [[], '3']]).length);
        d.check('1,,2,,3',_.multiDimensionExpand(['1', [''], '2', [[''], '3']]).join());
        d.check(5,        _.multiDimensionExpand(['1', [''], '2', [[''], '3']]).length);
      };


    }());
    var a = lib.array; //ショートカット呼び出し

    //----------------------------------------
    //◆文字列処理
    //----------------------------------------

    //文字列処理、名前空間
    _.string = lib.string || {};
    (function () {
      var _ = lib.string;

      /*----------------------------------------
      //・外部からの呼び出し時は
      //  静的関数的な使い方と拡張メソッドのような使い方ができる

        var d = lib.debug;

        //・静的関数的な使い方
        //  先頭小文字の string を使う
        d.check(true, lib.string.isInclude('abc', 'a'));

        //・拡張メソッド的な使い方
        //  先頭大文字の String を使う
        var str1 = new lib.String('abc');
        d.check(true, str1.isInclude('a'));

        //・拡張メソッド的な使い方
        //  newしなくても使用できる
        var str2 = lib.String('abc');
        d.check(true, str2.isInclude('a'));

      //・名前空間は何度宣言してもよいので、
      //  別ファイルに同名の名前空間コードをコピペして
      //  作成し、同じ書き方でメソッドを追加していくことができる

      var lib = lib || {};

        lib.string = lib.string || {};

        lib.String = lib.String || function (value) {
          var self = function () {};
          self.prototype = lib.String.prototype;
          self.prototype.value = value;
          return new self;
        }

      //----------------------------------------*/

      //----------------------------------------
      //◇空文字・空行
      //----------------------------------------

      //----------------------------------------
      //・NullかUndefinedか空文字('')ならTrueを返す
      //----------------------------------------
      _.isEmpty = function (str) {

        if (t.isNullOrUndefined(str) || str ===  '') {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・値が空文字/null/Undefinedの場合だけ別の値を返す関数
      //----------------------------------------
      _.ifEmptyValue = function (str, emptyValue) {
        if (_.isEmpty(str)) {
          return emptyValue;
        } else {
          return str;
        }
      };

      //----------------------------------------
      //・空行かどうか判断する
      //----------------------------------------
      _.isEmptyLine = function (line) {
        return _.isIncludeAll(line, [' ', '\t', '\r', '\n', '　']);
      };

      //----------------------------------------
      //・終端の改行コードを削除する
      //----------------------------------------
      //  ・\nを取り除き\rを取り除けば、
      //    \r\n/\r/\n すべてのタイプの改行コードを
      //    終端から取り除ける
      //----------------------------------------
      _.excludeEndLineBreak = function (line) {
        return _.excludeEnd(
          _.excludeEnd(line, ['\n']), ['\r']);
      };

      //----------------------------------------
      //◇Delete
      //----------------------------------------

      _.deleteIndex = function (str, startIndex, endIndex) {
        return a.deleteIndex(str.split(''), startIndex, endIndex).join('');
      };

      _.test_deleteIndex = function () {
        d.check('abde',   _.deleteIndex('abcde', 2, 2));
        d.check('abe',    _.deleteIndex('abcde', 2, 3));
        d.check('de',     _.deleteIndex('abcde', 0, 2));
        d.check('ae',     _.deleteIndex('abcde', 1, 3));
        d.check('ab',     _.deleteIndex('abcde', 2));
      };


      _.deleteLength = function (str, startIndex, length) {
        return a.deleteLength(str.split(''), startIndex, length).join('');
      };

      _.test_deleteLength = function () {
        d.check('abde',   _.deleteLength('abcde', 2, 1));
        d.check('abe',    _.deleteLength('abcde', 2, 2));
        d.check('de',     _.deleteLength('abcde', 0, 3));
        d.check('ae',     _.deleteLength('abcde', 1, 3));
        d.check('ab',     _.deleteLength('abcde', 2));
      };


      //----------------------------------------
      //◇Include
      //----------------------------------------

      _.isInclude = function (str, search) {
        return (0 <= _.indexOfFirst(str, search));
      };

      _.contains = function (str, search) {
        return _.isInclude(str, search);
      };

      _.test_isInclude = function () {

        d.check(true, _.isInclude('abc', 'a'));
        d.check(true, _.isInclude('abc', 'b'));
        d.check(true, _.isInclude('abc', 'c'));
        d.check(false,_.isInclude('abc', 'd'));
        d.check(false,_.isInclude('abc', ''));
        d.check(false,_.isInclude('', 'a'));
      };

      _.includeCount = function (str, search) {
        //if (search === '') { return 0; }
        var result = 0;
        var index = 0;
        do {
          index = _.indexOfFirst(str, search, index);
          if (index === -1) { break; }
          index = index + search.length;
          result++;
        } while (true);
        return result;
      };

      _.test_includeCount = function () {

        d.check(3, _.includeCount('123123123', '1'),    'A');
        d.check(3, _.includeCount('123123123', '2'),    'B');
        d.check(3, _.includeCount('123123123', '3'),    'C');
        d.check(3, _.includeCount('123123123', '12'),   'D');
        d.check(2, _.includeCount('123123123', '31'),   'E');
        d.check(6, _.includeCount('AAAAAA', 'A'),       'F');
        d.check(3, _.includeCount('AAAAAA', 'AA'),      'G');
      };

      //----------------------------------------
      //・全てが含まれているかどうか確認する
      //----------------------------------------
      //  ・  指定した配列の中身の内容で
      //      文字列が全て成り立っているかどうか確認する関数
      //  ・  isIncludeAll('abc', ['a', 'b', 'c'])
      //      とすると、true が戻る
      //----------------------------------------
      _.isIncludeAll = function (str, searchArray) {

        d.assert(Array.isArray(searchArray));
        for (var i = 0; i < searchArray.length; i += 1) {
          str = s.replaceAll(str, searchArray[i], '');
        }
        return s.isEmpty(str);
      };

      _.test_isIncludeAll = function () {

        d.check(true, _.isIncludeAll('abc', ['a', 'b', 'c']));
        d.check(true, _.isIncludeAll('abc', ['a', 'b', 'c', 'd']));
        d.check(false,_.isIncludeAll('abc', ['a', 'b']));
      };

      //----------------------------------------
      //◇indexOf
      //----------------------------------------

      _.indexOfFirst = function (str, search, startIndex) {
        d.assert(t.isString(str, search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        d.assert(t.isInt(startIndex));

        if (search === '') { return -1; }
        return str.indexOf(search, startIndex);
      };

      _.test_indexOfFirst = function () {

        d.check(-1, _.indexOfFirst('abc', 'd'));
        d.check( 0, _.indexOfFirst('abc', 'a'));
        d.check( 1, _.indexOfFirst('abc', 'b'));
        d.check( 2, _.indexOfFirst('abc', 'c'));
        d.check(-1, _.indexOfFirst('abc', ''));
        d.check( 0, _.indexOfFirst('abcabc', 'a'));
        d.check( 1, _.indexOfFirst('abcabc', 'b'));
        d.check( 2, _.indexOfFirst('abcabc', 'c'));

        d.check( 0, _.indexOfFirst('abcabc', 'a', 0));
        d.check( 3, _.indexOfFirst('abcabc', 'a', 1));
        d.check( 1, _.indexOfFirst('abcabc', 'b', 1));
        d.check( 4, _.indexOfFirst('abcabc', 'b', 2));
        d.check( 2, _.indexOfFirst('abcabc', 'c', 2));
        d.check( 5, _.indexOfFirst('abcabc', 'c', 3));
      };

      _.indexOfLast = function (str, search, startIndex) {
        d.assert(t.isString(str, search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, str.length - 1);
        d.assert(t.isInt(startIndex));

        if (search === '') { return -1; }
        return str.lastIndexOf(search, startIndex);
      };

      _.test_indexOfLast = function () {

        d.check(-1, _.indexOfLast('abc', 'd'));
        d.check( 0, _.indexOfLast('abc', 'a'));
        d.check( 1, _.indexOfLast('abc', 'b'));
        d.check( 2, _.indexOfLast('abc', 'c'));
        d.check(-1, _.indexOfLast('abc', ''));
        d.check( 3, _.indexOfLast('abcabc', 'a'));
        d.check( 4, _.indexOfLast('abcabc', 'b'));
        d.check( 5, _.indexOfLast('abcabc', 'c'));

        d.check( 3, _.indexOfLast('abcabc', 'a', 3));
        d.check( 0, _.indexOfLast('abcabc', 'a', 2));
        d.check( 4, _.indexOfLast('abcabc', 'b', 4));
        d.check( 1, _.indexOfLast('abcabc', 'b', 3));
        d.check( 5, _.indexOfLast('abcabc', 'c', 5));
        d.check( 2, _.indexOfLast('abcabc', 'c', 4));
      };


      //----------------------------------------
      //◇indexOfAny
      //----------------------------------------

      _.indexOfAnyFirst = function (str, searchArray, startIndex) {
        d.assert(t.isString(str));
        d.assert(t.isString(searchArray) && (Array.isArray(searchArray)));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        d.assert(t.isInt(startIndex));

        var result = Infinity;
        var findIndex;
        for (var i = 0, l = searchArray.length; i < l; i += 1) {
          findIndex = _.indexOfFirst(str, searchArray[i], startIndex);
          if (findIndex !== -1) {
            result = Math.min(findIndex, result);
          }
        }
        return result === Infinity ? -1 : result;
      };

      _.test_indexOfAnyFirst = function () {

        d.checkResult('ER', null, _.indexOfAnyFirst, 'abc', []);
        d.check(-1, _.indexOfAnyFirst('abc', ['d', 'e']));
        d.check( 0, _.indexOfAnyFirst('abc', ['a', 'c']));
        d.check( 1, _.indexOfAnyFirst('abc', ['b', 'c']));
        d.check( 2, _.indexOfAnyFirst('abc', ['', 'c']));
        d.check(-1, _.indexOfAnyFirst('abc', ['', '']));

        d.check( 0, _.indexOfAnyFirst('abcabc', ['a', 'c'], 0));
        d.check( 2, _.indexOfAnyFirst('abcabc', ['a', 'c'], 1));
        d.check( 2, _.indexOfAnyFirst('abcabc', ['a', 'c'], 2));
        d.check( 3, _.indexOfAnyFirst('abcabc', ['a', 'c'], 3));
        d.check( 1, _.indexOfAnyFirst('abcabc', ['b'], 1));
        d.check( 4, _.indexOfAnyFirst('abcabc', ['b'], 2));
      };

      _.indexOfAnyLast = function (str, searchArray, startIndex) {
        d.assert(t.isString(str));
        d.assert(t.isString(searchArray) && (Array.isArray(searchArray)));
        startIndex = t.ifNullOrUndefinedValue(startIndex, str.length - 1);
        d.assert(t.isInt(startIndex));

        var result = -1;
        var findIndex;
        for (var i = 0, l = searchArray.length; i < l; i += 1) {
          findIndex = _.indexOfLast(str, searchArray[i], startIndex);
          if (findIndex !== -1) {
            result = Math.max(findIndex, result);
          }
        }
        return result;
      };

      _.test_indexOfAnyLast = function () {
        d.checkResult('ER', null, _.indexOfAnyLast, 'abc', []);
        d.check(-1, _.indexOfAnyLast('abc', ['d', 'e']));
        d.check( 2, _.indexOfAnyLast('abc', ['a', 'c']));
        d.check( 1, _.indexOfAnyLast('abc', ['b', 'a']));
        d.check( 2, _.indexOfAnyLast('abc', ['', 'c']));
        d.check(-1, _.indexOfAnyLast('abc', ['', '']));

        d.check( 5, _.indexOfAnyLast('abcabc', ['a', 'c']));
        d.check( 5, _.indexOfAnyLast('abcabc', ['a', 'c'], 5));
        d.check( 3, _.indexOfAnyLast('abcabc', ['a', 'c'], 4));
        d.check( 3, _.indexOfAnyLast('abcabc', ['a', 'c'], 3));
        d.check( 2, _.indexOfAnyLast('abcabc', ['a', 'c'], 2));
      };

      //----------------------------------------
      //◇indexOfFunc
      //----------------------------------------

      _.indexOfFuncFirst = function (str, func, startIndex) {
        d.assert(t.isString(str));
        d.assert(t.isFunction(func));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        d.assert(t.isInt(startIndex));

        //WSHは文字列をstr[i]の形で扱えないので、その対策
        str = str.split('');
        for (var i = startIndex, l = str.length; i < l; i += 1) {
          //func(char, Index, str)に対してtrueが返れば
          //それを戻り値として返す
          if (func(str[i], i, str)) {
            return i;
          }
        }
        return -1;
      };

      _.test_indexOfFuncFirst = function () {

        d.check(-1, _.indexOfFuncFirst('abc def ghi abc',
          function (s, index, str) {
            return false;
          }));

        d.check( 4, _.indexOfFuncFirst('abc def ghi abc',
          function (s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }));

        d.check( 8, _.indexOfFuncFirst('abc def ghi abc',
          function (s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }, 5));

        d.check(10, _.indexOfFuncFirst('abc def ghi abc',
          function (s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }, 9));

        d.check( 6, _.indexOfFuncFirst('abcdefGhiAbc',
          function (s, index, str) {
            return (s === s.toUpperCase());
          }));
      };

      _.indexOfFuncLast = function (str, func, startIndex) {
        d.assert(t.isString(str));
        d.assert(t.isFunction(func));
        startIndex = t.ifNullOrUndefinedValue(startIndex, str.length - 1);
        d.assert(t.isInt(startIndex));

        //WSHは文字列をstr[i]の形で扱えないので、その対策
        str = str.split('');
        for (var i = startIndex; 0 <= i; i -= 1) {
          //func(char, Index, str)に対してtrueが返れば
          //それを戻り値として返す
          if (func(str[i], i, str)) {
            return i;
          }
        }
        return -1;
      };

      _.test_indexOfFuncLast = function () {

        d.check(-1, _.indexOfFuncLast('abc def ghi abc',
          function (s, index, str) {
            return false;
          }));

        d.check(10, _.indexOfFuncLast('abc def ghi abc',
          function (s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }));

        d.check( 4, _.indexOfFuncLast('abc def ghi abc',
          function (s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }, 7));

        d.check( 9, _.indexOfFuncLast('abcdefGhiAbc',
          function (s, index, str) {
            return (s === s.toUpperCase());
          }));
      };

      //----------------------------------------
      //◇Substring系
      //----------------------------------------

      //----------------------------------------
      //・Index指定のSubstring
      //----------------------------------------
      //  ・JavaScript標準のsubtring/sliceと似ているが
      //    Indexの不自然さを排除
      //    endIndexの位置で切り取り
      //  ・負の値のIndexに対応
      //    -1は最後の文字になる
      //----------------------------------------
      _.substrIndex = function (str, startIndex, endIndex) {

        d.assert(t.isString(str));
        d.assert(t.isInt(startIndex));
        if (t.isNullOrUndefined(endIndex)) {
          if (str.length <= startIndex) {
            return '';
          }
          endIndex = str.length - 1;
        }
        d.assert(t.isInt(endIndex));

        if (startIndex < 0) {
          startIndex = str.length + startIndex;
        }
        if (endIndex < 0) {
          endIndex = str.length + endIndex;
        }

        if (startIndex <= endIndex) {
          return str.substring(startIndex, endIndex + 1);
        } else {
          return str.substring(endIndex, startIndex + 1);
        }
      };

      _.test_substrIndex = function () {

        d.check('45',     _.substrIndex('012345', 4));
        d.check('2345',   _.substrIndex('012345', -4));
        d.check('1',      _.substrIndex('012345', 1, 1));
        d.check('1234',   _.substrIndex('012345', 1, 4));
        d.check('345',    _.substrIndex('012345', 3, 10));
        d.check('1234',   _.substrIndex('012345', 4, 1));
        d.check('345',    _.substrIndex('012345', 10, 3));

        d.check('5',      _.substrIndex('012345', -1, -1));
        d.check('2345',   _.substrIndex('012345', -1, -4));
        d.check('0123',   _.substrIndex('012345', -3, -10));
        d.check('2345',   _.substrIndex('012345', -4, -1));
        d.check('0123',   _.substrIndex('012345', -10, -3));

        d.check('0',      _.substrIndex('012345', 0, 0));
        d.check('5',      _.substrIndex('012345', 5, 5));
        d.check('45',     _.substrIndex('012345', -1, 4));
        d.check('45',     _.substrIndex('012345', 4, -1));
        d.check('12',   _.substrIndex('012345', -4, 1));
        d.check('12',   _.substrIndex('012345', 1, -4));
        d.check('0123',   _.substrIndex('012345', -10, 3));
        d.check('0123',   _.substrIndex('012345', 3, -10));
        d.check('345',   _.substrIndex('012345', 10, -3));
        d.check('345',   _.substrIndex('012345', -3, 10));

        d.check('',     _.substrIndex(' ', 1));
        d.check('',     _.substrIndex(' ', 1, 1));
      };

      //----------------------------------------
      //・Length指定のSubstring
      //----------------------------------------
      //  ・JavaScript標準のsubstrと似ているが
      //    負のlengthに対応
      //  ・負の値のIndexに対応
      //    -1は最後の文字になる
      //  ・lengthは1を指定しても-1を指定しても同じ
      //    -2を指定すると前方文字を取得する
      //----------------------------------------
      _.substrLength = function (str, startIndex, length) {
        if (length === 0) { return ''; }
        if ((startIndex < (-1 * str.length))
        || ((str.length) < startIndex)) { return '';}
        if (startIndex < 0) {
          startIndex = str.length + startIndex;
        }

        if (lib.type.isNullOrUndefined(length)) {
          length = str.length;
        }
        var endIndex;
        if (length < 0) {
          endIndex = startIndex + length + 1;
        } else {
          endIndex = startIndex + length - 1;
        }

        return _.substrIndex(str, startIndex, endIndex);
      };

      _.test_substrLength = function () {

        d.check('45',   _.substrLength('012345', 4));
        d.check('2345', _.substrLength('012345', -4));
        d.check('23',   _.substrLength('012345', 2, 2));
        d.check('234',  _.substrLength('012345', 2, 3));
        d.check('345',  _.substrLength('012345', 3, 10));
        d.check('4',    _.substrLength('012345', 4, 1));
        d.check('',     _.substrLength('012345', 10, 3));

        d.check('5',    _.substrLength('012345', -1, -1));
        d.check('45',   _.substrLength('012345', -1, -2));
        d.check('0123', _.substrLength('012345', -3, -10));
        d.check('34',   _.substrLength('012345', -3, 2));
        d.check('2',    _.substrLength('012345', -4, -1));
        d.check('2',    _.substrLength('012345', -4, 1));
        d.check('12',   _.substrLength('012345', -4, -2));
        d.check('23',   _.substrLength('012345', -4, 2));
        d.check('',     _.substrLength('012345', -10, -3));

        d.check('',     _.substrLength('012345', 0, 0));
        d.check('',     _.substrLength('012345', 3, 0));
      };

      //----------------------------------------
      //◇Start
      //----------------------------------------

      //----------------------------------------
      //・先頭を切り取るメソッド
      //----------------------------------------
      _.start = function (str, length) {

        d.assert(t.isString(str));
        d.assert(t.isInt(length));
        if (str === '') { return ''; }
        if (length <= 0) { return ''; }

        return _.substrLength(str, 0, length);
      };

      _.test_start = function () {

        d.check('0123',   _.start('012345', 4));
        d.check('',       _.start('012345', 0));
        d.check('',       _.start('012345', -3));
        d.check('01',     _.start('012345', 2));
        d.check('012',    _.start('012345', 3));
        d.check('012345', _.start('012345', 6));
        d.check('012345', _.start('012345', 10));
      };

      //----------------------------------------
      //・先頭の一致を調べる
      //----------------------------------------
      _.isStart = function (str, search) {
        if (search === '') { return false; }
        if (str === '') { return false; }
        if (str.length < search.length) { return false; }

        if (_.indexOfFirst(str, search) === 0) {
          return true;
        } else {
          return false;
        }
      };

      _.startsWith = function (str, search) {
        return _.isStart(str, search);
      };

      _.hasPrefix = function (str, search) {
        return _.isStart(str, search);
      };

      _.test_isStart = function () {

        d.check(true,  _.isStart('12345', '1'), 'A');
        d.check(true,  _.isStart('12345', '12'), 'B');
        d.check(true,  _.isStart('12345', '123'), 'C');
        d.check(false, _.isStart('12345', '23'), 'D');
        d.check(false, _.isStart('', '34'), 'E');
        d.check(false, _.isStart('12345', ''), 'F');
        d.check(false, _.isStart('123', '1234'), 'G');
      };

      //----------------------------------------
      //・先頭に含む
      //----------------------------------------
      _.includeStart = function (str, search) {
        if (_.isStart(str, search)) {
          return str;
        } else {
          return search + str;
        }
      };

      _.test_includeStart = function () {

        d.check('12345',  _.includeStart('12345', '1'));
        d.check('12345',  _.includeStart('12345', '12'));
        d.check('12345',  _.includeStart('12345', '123'));
        d.check('2312345',_.includeStart('12345', '23'));
      };

      //----------------------------------------
      //・先頭から取り除く
      //----------------------------------------
      _.excludeStart = function (str, search) {
        if (_.isStart(str, search)) {
          return _.substrIndex(str, search.length);
        } else {
          return str;
        }
      };

      _.test_excludeStart = function () {

        d.check('2345', _.excludeStart('12345', '1'));
        d.check('345',  _.excludeStart('12345', '12'));
        d.check('45',   _.excludeStart('12345', '123'));
        d.check('12345',_.excludeStart('12345', '23'));
        d.check('',     _.excludeStart(' ', ' '));
      };

      //----------------------------------------
      //◇End
      //----------------------------------------

      //----------------------------------------
      //・先頭を切り取るメソッド
      //----------------------------------------
      _.end = function (str, length) {
        if (str === '') { return ''; }
        if (length <= 0) { return ''; }
        return _.substrLength(str,
          Math.max(0, str.length - length));
      };

      _.test_end = function () {

        d.check('2345',   _.end('012345', 4));
        d.check('',       _.end('012345', 0));
        d.check('',       _.end('012345', -3));
        d.check('45',     _.end('012345', 2));
        d.check('345',    _.end('012345', 3));
        d.check('012345', _.end('012345', 6));
        d.check('012345', _.end('012345', 10));
      };

      //----------------------------------------
      //・終端の一致を調べる
      //----------------------------------------
      _.isEnd = function (str, search) {
        if (search === '') { return false; }
        if (str === '') { return false; }
        if (str.length < search.length) { return false; }

        if (_.indexOfLast(str, search) ===
          str.length - search.length) {
          return true;
        } else {
          return false;
        }
      };

      _.endsWith = function (str, search) {
        return _.isEnd(str, search);
      };

      _.hasSuffix = function (str, search) {
        return _.isEnd(str, search);
      };

      _.test_isEnd = function () {

        d.check(true,  _.isEnd('12345', '5'));
        d.check(true,  _.isEnd('12345', '45'));
        d.check(true,  _.isEnd('12345', '345'));
        d.check(false, _.isEnd('12345', '34'));
        d.check(false, _.isEnd('', '34'));
        d.check(false, _.isEnd('12345', ''));
        d.check(false, _.isEnd('123', '1234'));
      };

      //----------------------------------------
      //・終端に含む
      //----------------------------------------
      _.includeEnd = function (str, search) {
        if (_.isEnd(str, search)) {
          return str;
        } else {
          return str + search;
        }
      };

      _.test_includeEnd = function () {

        d.check('12345',   _.includeEnd('12345', '5'));
        d.check('12345',   _.includeEnd('12345', '45'));
        d.check('12345',   _.includeEnd('12345', '345'));
        d.check('1234534', _.includeEnd('12345', '34'));
      };

      //----------------------------------------
      //・終端から取り除く
      //----------------------------------------
      _.excludeEnd = function (str, search) {
        if (_.isEnd(str, search)) {
          if (str.length === search.length) {
            return '';
          } else {
            return _.substrIndex(str, 0,
              str.length - search.length - 1);
          }
        } else {
          return str;
        }
      };

      _.test_excludeEnd = function () {

        d.check('1234',   _.excludeEnd('12345', '5'));
        d.check('123',    _.excludeEnd('12345', '45'));
        d.check('12',     _.excludeEnd('12345', '345'));
        d.check('12345',  _.excludeEnd('12345', '34'));
        d.check('  ',     _.excludeEnd('   ', ' '));
        d.check('',       _.excludeEnd(' ', ' '));
      };

      //----------------------------------------
      //◇両端 BothEnds
      //----------------------------------------
      _.bothEndsWith = function (str, search) {
        return _.isStart(str, search) &&
          _.isEnd(str, search);
      };

      _.includeBothEnds = function (str, search) {
        return _.includeStart(
          _.includeEnd(str, search));
      };

      _.excludeBothEnds = function (str, search) {
        return _.excludeStart(
          _.excludeEnd(str, search));
      };

      //----------------------------------------
      //◇delimiter
      //----------------------------------------

      //----------------------------------------
      //・startFirstDelim
      //----------------------------------------
      _.startFirstDelim = function (str, delimiter) {
        var index = _.indexOfFirst(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === 0) {
          return '';
        } else {
          return _.substrIndex(str, 0, index - 1);
        }
      };

      _.test_startFirstDelim = function () {

        d.check('123', _.startFirstDelim('123,456', ','));
        d.check('123', _.startFirstDelim('123,456,789', ','));
        d.check('123', _.startFirstDelim('123ttt456', 'ttt'));
        d.check('123', _.startFirstDelim('123ttt456', 'tt'));
        d.check('123', _.startFirstDelim('123ttt456', 't'));
        d.check('123ttt456', _.startFirstDelim('123ttt456', ','));
        d.check('123', _.startFirstDelim('123,', ','));
        d.check('', _.startFirstDelim(',123', ','));
        d.check('', _.startFirstDelim(',123,', ','));
      };

      //----------------------------------------
      //・startLastDelim
      //----------------------------------------
      _.startLastDelim = function (str, delimiter) {
        var index = _.indexOfLast(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === 0) {
          return '';
        } else {
          return _.substrIndex(str, 0, index -1);
        }
      };

      _.test_startLastDelim = function () {

        d.check('123', _.startLastDelim('123,456', ','));
        d.check('123,456', _.startLastDelim('123,456,789', ','));
        d.check('123', _.startLastDelim('123ttt456', 'ttt'));
        d.check('123t', _.startLastDelim('123ttt456', 'tt'));
        d.check('123tt', _.startLastDelim('123ttt456', 't'));
        d.check('123ttt456', _.startLastDelim('123ttt456', ','));
        d.check('123', _.startLastDelim('123,', ','));
        d.check('', _.startLastDelim(',123', ','));
        d.check(',123', _.startLastDelim(',123,', ','));
      };

      //----------------------------------------
      //・endFirstDelim
      //----------------------------------------
      _.endFirstDelim = function (str, delimiter) {
        var index = _.indexOfFirst(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === str.length - 1) {
          return '';
        } else {
          return _.substrIndex(str, index + delimiter.length);
        }
      };

      _.test_endFirstDelim = function () {

        d.check('456', _.endFirstDelim('123,456', ','));
        d.check('456,789', _.endFirstDelim('123,456,789', ','));
        d.check('456', _.endFirstDelim('123ttt456', 'ttt'));
        d.check('t456', _.endFirstDelim('123ttt456', 'tt'));
        d.check('tt456', _.endFirstDelim('123ttt456', 't'));
        d.check('123ttt456', _.endFirstDelim('123ttt456', ','));
        d.check('', _.endFirstDelim('123,', ','));
        d.check('123', _.endFirstDelim(',123', ','));
        d.check('123,', _.endFirstDelim(',123,', ','));
      };

      //----------------------------------------
      //・endLastDelim
      //----------------------------------------
      _.endLastDelim = function (str, delimiter) {
        var index = _.indexOfLast(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === str.length - delimiter.length) {
          return '';
        } else {
          return _.substrIndex(str, index + delimiter.length);
        }
      };

      _.test_endLastDelim = function () {

        d.check('456', _.endLastDelim('123,456', ','));
        d.check('789', _.endLastDelim('123,456,789', ','));
        d.check('456', _.endLastDelim('123ttt456', 'ttt'));
        d.check('456', _.endLastDelim('123ttt456', 'tt'));
        d.check('456', _.endLastDelim('123ttt456', 't'));
        d.check('123ttt456', _.endLastDelim('123ttt456', ','));
        d.check('', _.endLastDelim('123,', ','));
        d.check('123', _.endLastDelim(',123', ','));
        d.check('', _.endLastDelim(',123,', ','));

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        d.check('', _.endLastDelim(Text, '<789>'));

      };

      //--------------------------------------
      //◇Trim
      //--------------------------------------
      _.trimStart = function (str, trimStrArray) {
        var result = str;
        do {
          str = result;
          for (var i = 0; i <= trimStrArray.length - 1; i++) {
            result = _.excludeStart(result, trimStrArray[i]);
          }
        } while (result !== str);
        return result;
      };

      _.trimLeft = function (str, trimStrArray) {
        return _.trimStart(str, trimStrArray);
      };

      _.test_trimStart = function () {

        d.check('123 ',           _.trimStart('   123 ', [' ']));
        d.check('\t  123 ',       _.trimStart('   \t  123 ', [' ']));
        d.check('123 ',           _.trimStart('   \t  123 ', [' ', '\t']));
        d.check('\t 456  \t   ',  _.trimStart('  \t 456  \t   ', [' ']));
        d.check('456  \t   ',     _.trimStart('  \t 456  \t   ', [' ', '\t']));
        d.check('\t   \t   ',     _.trimStart('  \t   \t   ', [' ']));
        d.check('',               _.trimStart('  \t   \t   ', [' ', '\t']));
      };

      _.trimEnd = function (str, trimStrArray) {
        var result = str;
        do {
          str = result;
          for (var i = 0; i <= trimStrArray.length - 1; i++) {
            result = _.excludeEnd(result, trimStrArray[i]);
          }
        } while (result !== str);
        return result;
      };

      _.trimRight = function (str, trimStrArray) {
        return _.trimEnd(str, trimStrArray);
      };

      _.test_trimEnd = function () {

        d.check(' 123',       _.trimEnd(' 123   ', [' ']));
        d.check(' 456  \t',   _.trimEnd(' 456  \t   ', [' ']));
        d.check(' 789',       _.trimEnd(' 789  \t   ', [' ', '\t']));
        d.check('  \t   \t',  _.trimEnd('  \t   \t   ', [' ']));
        d.check('',           _.trimEnd('  \t   \t   ', [' ', '\t']));
      };

      _.trimBothEnds = function (str, trimStrArray) {
        return _.trimStart(
          _.trimEnd(str, trimStrArray), trimStrArray);
      };

      _.trim = function (str) {
        return _.trimBothEnds(str, [' ', '\t', '\r', '\n']);
      };

      _.trimSpaceOnly = function (str) {
        return _.trimBothEnds(str, [' ']);
      };

      //----------------------------------------
      //・TrimでCutする方の文字列を取得する
      //----------------------------------------
      _.trimCutStart = function (str, trimStrArray) {
        return _.start(str,
          str.length - _.trimStart(str, trimStrArray).length);
      };

      _.trimCutEnd = function (str, trimStrArray) {
        return _.end(str,
          str.length - _.trimEnd(str, trimStrArray).length);
      };

      //--------------------------------------
      //◇Tag deleteFirst/Last
      //--------------------------------------

      _.deleteFirst = function (str, search) {
        if (_.indexOfFirst(str, search) === -1) {
          return str;
        } else {
          return _.startFirstDelim(str, search) +
            _.endFirstDelim(str, search);
        }
      };

      _.deleteLast = function (str, search) {
        if (_.indexOfLast(str, search) === -1) {
          return str;
        } else {
          return _.startLastDelim(str, search) +
            _.endLastDelim(str, search);
        }
      };

      _.test_deleteFirstLast = function () {

        d.check('abcdefghi', _.deleteFirst(
          _.deleteLast('abc<def>ghi', '>'), '<'));
        d.check('abc><def><ghi', _.deleteFirst(
          _.deleteLast('a<bc><def><gh>i', '>'), '<'));
        d.check('abcdefghi', _.deleteFirst(
          _.deleteLast('abc>def<ghi', '>'), '<'));
        d.check('abc>def<ghi', _.deleteFirst(
          _.deleteLast('a<bc>def<gh>i', '>'), '<'));
      };

      //--------------------------------------
      //◇Tag deleteFirstTagInner/Outer
      //--------------------------------------
      _.deleteFirstTagInner = function (str, startTag, endTag) {

        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag));
        d.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfFirst(str, startTag);
        var indexEndTag = _.indexOfFirst(str, endTag);
        if ((indexStartTag !== -1)
        && (indexEndTag !== -1)
        && (indexStartTag < indexEndTag)) {
          str = _.startFirstDelim(str, startTag) + startTag +
            endTag + _.endFirstDelim(str, endTag);
        }
        return str;
      };

      _.test_deleteFirstTagInner = function () {

        d.check('abc<>ghi', _.deleteFirstTagInner('abc<def>ghi', '<', '>'));
        d.check('abc<>ghi<jkl>mn', _.deleteFirstTagInner('abc<def>ghi<jkl>mn', '<', '>'));
      };

      _.deleteFirstTagOuter = function (str, startTag, endTag) {

        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag));
        d.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexStartTag = str.indexOf(startTag);
        var indexEndTag = str.indexOf(endTag);
        if ((indexStartTag !== -1)
        && (indexEndTag !== -1)
        && (indexStartTag < indexEndTag)) {
          str = _.startFirstDelim(str, startTag) +
            _.endFirstDelim(str, endTag);
        }
        return str;
      };

      _.test_deleteFirstTagOuter = function () {

        d.check('abcghi', _.deleteFirstTagOuter('abc<def>ghi', '<', '>'));
        d.check('abcghi<jkl>mn', _.deleteFirstTagOuter('abc<def>ghi<jkl>mn', '<', '>'));
      };

      //--------------------------------------
      //◇Tag deleteLastTagInner/Outer
      //--------------------------------------
      _.deleteLastTagInner = function (str, startTag, endTag) {

        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag));
        d.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfLast(str, startTag);
        var indexEndTag = _.indexOfLast(str, endTag);
        if ((indexStartTag !== -1)
        && (indexEndTag !== -1)
        && (indexStartTag < indexEndTag)) {
          str = _.startLastDelim(str, startTag) + startTag +
            endTag + _.endLastDelim(str, endTag);
        }
        return str;
      };

      _.test_deleteLastTagInner = function () {

        d.check('abc<>ghi', _.deleteLastTagInner('abc<def>ghi', '<', '>'));
        d.check('abc<def>ghi<>mn', _.deleteLastTagInner('abc<def>ghi<jkl>mn', '<', '>'));
      };

      _.deleteLastTagOuter = function (str, startTag, endTag) {

        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag));
        d.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfLast(str, startTag);
        var indexEndTag = _.indexOfLast(str, endTag);
        if ((indexStartTag !== -1)
        && (indexEndTag !== -1)
        && (indexStartTag < indexEndTag)) {
          str = _.startLastDelim(str, startTag) +
            _.endLastDelim(str, endTag);
        }
        return str;
      };

      _.test_deleteLastTagOuter = function () {

        d.check('abcghi', _.deleteLastTagOuter('abc<def>ghi', '<', '>'));
        d.check('abc<def>ghimn', _.deleteLastTagOuter('abc<def>ghi<jkl>mn', '<', '>'));
      };

      //--------------------------------------
      //◇deleteAllTag
      //--------------------------------------
      _.deleteAllTag = function (str, startTag, endTag) {
        var result = str;
        do {
          str = result;
          result = _.deleteFirstTagOuter(str, startTag, endTag);
        } while (str !== result);
        return result;
      };

      _.test_deleteAllTag = function () {

        d.check('abcghi', _.deleteAllTag('abc<def>ghi', '<', '>'));
        d.check('abcghimn', _.deleteAllTag('abc<def>ghi<jkl>mn', '<', '>'));
      };

      //--------------------------------------
      //◇Tag Inner/Outer
      //--------------------------------------

      //----------------------------------------
      //・最初の start,end の組み合わせのタグを含まない文字
      //----------------------------------------
      _.tagInnerFirst = function (str, startTag, endTag) {
        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfFirst(str, startTag);
        if (indexStartTag !== -1) {
          //startTagはある
          var indexEndTag = _.indexOfFirst(str, endTag, 
            indexStartTag + startTag.length);
          if (indexEndTag !== -1) {
            //endTagはある
            return _.startFirstDelim(
              _.endFirstDelim(str, startTag), endTag);
          } else {
            //endTagはない
            return '';
          }
        } else {
          //startTagはない
          return '';
        }
      };

      _.test_tagInnerFirst = function () {

        d.check('456',  _.tagInnerFirst('000<123>456<789>000', '<123>', '<789>'), 'test01');
        d.check('456',  _.tagInnerFirst('<123>456<789>', '<123>', '<789>'), 'test02');
        d.check('',     _.tagInnerFirst('000<123>456', '<123>', '<789>'), 'test03');
        d.check('',     _.tagInnerFirst('456<789>000', '<123>', '<789>'), 'test04');
        d.check('',     _.tagInnerFirst('456', '<123>', '<789>'), 'test05');
        d.check('',     _.tagInnerFirst('000<123><789>000', '<123>', '<789>'), 'test06');
        d.check('',     _.tagInnerFirst('000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        d.check('123',
          _.tagInnerFirst(Text, '<123>', '<789>'), 'test01');
        d.check('',
          _.tagInnerFirst(Text, '<123>', '<456>'), 'test02');
        d.check('',
          _.tagInnerFirst(Text, '<456>', '<789>'), 'test03');
        d.check('',
          _.tagInnerFirst(Text, '<456>', '<123>'), 'test04');
        d.check('',
          _.tagInnerFirst(Text, '<789>', '<456>'), 'test05');
        d.check('',
          _.tagInnerFirst(Text, '<321>', '<456>'), 'test06');
        d.check('123<789> <123>45',
          _.tagInnerFirst(Text, '<123>', '6<789>'), 'test07');
      };

      //----------------------------------------
      //・最初の start,end の組み合わせのタグを含む文字
      //----------------------------------------
      _.tagOuterFirst = function (str, startTag, endTag) {
        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfFirst(str, startTag);
        if (indexStartTag !== -1) {
          //startTagはある
          var indexEndTag = _.indexOfFirst(str, endTag, 
            indexStartTag + startTag.length);
          if (indexEndTag !== -1) {
            //endTagはある
            return startTag + _.startFirstDelim(
              _.endFirstDelim(str, startTag), endTag) + endTag;
          } else {
            //endTagはない
            return '';
          }
        } else {
          //startTagはない
          return '';
        }
      };

      _.test_tagOuterFirst = function () {

        d.check('<123>456<789>',  _.tagOuterFirst(
          '000<123>456<789>000', '<123>', '<789>'), 'test01');
        d.check('<123>456<789>',  _.tagOuterFirst(
          '<123>456<789>', '<123>', '<789>'), 'test02');
        d.check('',       _.tagOuterFirst(
          '000<123>456', '<123>', '<789>'), 'test03');
        d.check('',       _.tagOuterFirst(
          '456<789>000', '<123>', '<789>'), 'test04');
        d.check('',            _.tagOuterFirst(
          '456', '<123>', '<789>'), 'test05');
        d.check('<123><789>',     _.tagOuterFirst(
          '000<123><789>000', '<123>', '<789>'), 'test06');
        d.check('',  _.tagOuterFirst(
          '000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        d.check('<123>123<789>',
          _.tagOuterFirst(Text, '<123>', '<789>'), 'test01');
        d.check('',
          _.tagOuterFirst(Text, '<123>', '<456>'), 'test02');
        d.check('',
          _.tagOuterFirst(Text, '<456>', '<789>'), 'test03');
        d.check('',
          _.tagOuterFirst(Text, '<456>', '<123>'), 'test04');
        d.check('',
          _.tagOuterFirst(Text, '<789>', '<456>'), 'test05');
        d.check('',
          _.tagOuterFirst(Text, '<321>', '<456>'), 'test06');
        d.check('<123>123<789> <123>456<789>',
          _.tagOuterFirst(Text, '<123>', '6<789>'), 'test07');
      };

      //----------------------------------------
      //・最後の start,end の組み合わせのタグを含まない文字
      //----------------------------------------
      _.tagInnerLast = function (str, startTag, endTag) {
        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexEndTag = _.indexOfLast(str, endTag);
        if (indexEndTag !== -1) {
          //endTagはある
          var indexStartTag = _.indexOfLast(str, startTag,
            indexEndTag - 1);
          if (indexStartTag !== -1) {
            //startTagはある
            return _.endLastDelim(
              _.startLastDelim(str, endTag), startTag);
          } else {
            //startTagはない
            return '';
          } 
        } else {
          //endTagはない
          return '';
        }
      };

      _.test_tagInnerLast = function () {
        d.check('456',  _.tagInnerLast('000<123>456<789>000', '<123>', '<789>'), 'test01');
        d.check('456',  _.tagInnerLast('<123>456<789>', '<123>', '<789>'), 'test02');
        d.check('',     _.tagInnerLast('000<123>456', '<123>', '<789>'), 'test03');
        d.check('',     _.tagInnerLast('456<789>000', '<123>', '<789>'), 'test04');
        d.check('',     _.tagInnerLast('456', '<123>', '<789>'), 'test05');
        d.check('',     _.tagInnerLast('000<123><789>000', '<123>', '<789>'), 'test06');
        d.check('',     _.tagInnerLast('000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>ABC<789> <123>DEF<789> <123>GHI<789>';
        d.check('GHI',
          _.tagInnerLast(Text, '<123>', '<789>'), 'test01');
        d.check('',
          _.tagInnerLast(Text, '<123>', '<456>'), 'test02');
        d.check('',
          _.tagInnerLast(Text, '<456>', '<789>'), 'test03');
        d.check('',
          _.tagInnerLast(Text, '<456>', '<123>'), 'test04');
        d.check('',
          _.tagInnerLast(Text, '<789>', '<456>'), 'test05');
        d.check('',
          _.tagInnerLast(Text, '<321>', '<456>'), 'test06');
        d.check('DE',
          _.tagInnerLast(Text, '<123>', 'F<789>'), 'test07');
      };

      //----------------------------------------
      //・最後の start,end の組み合わせのタグを含む文字
      //----------------------------------------
      _.tagOuterLast = function (str, startTag, endTag) {
        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexEndTag = _.indexOfLast(str, endTag);
        if (indexEndTag !== -1) {
          //endTagはある
          var indexStartTag = _.indexOfLast(str, startTag,
            indexEndTag - 1);
          if (indexStartTag !== -1) {
            //startTagはある
            return startTag + _.endLastDelim(
              _.startLastDelim(str, endTag), startTag) + endTag;
          } else {
            //startTagはない
            return '';
          } 
        } else {
          //endTagはない
          return '';
        }
      };

      _.test_tagOuterLast = function () {

        d.check('<123>456<789>',  _.tagOuterLast(
          '000<123>456<789>000', '<123>', '<789>'), 'test01');
        d.check('<123>456<789>',  _.tagOuterLast(
          '<123>456<789>', '<123>', '<789>'), 'test02');
        d.check('',       _.tagOuterLast(
          '000<123>456', '<123>', '<789>'), 'test03');
        d.check('',       _.tagOuterLast(
          '456<789>000', '<123>', '<789>'), 'test04');
        d.check('',            _.tagOuterLast(
          '456', '<123>', '<789>'), 'test05');
        d.check('<123><789>',     _.tagOuterLast(
          '000<123><789>000', '<123>', '<789>'), 'test06');
        d.check('',            _.tagOuterLast(
          '000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        d.check('<123>789<789>',
          _.tagOuterLast(Text, '<123>', '<789>'), 'test01');
        d.check('',
          _.tagOuterLast(Text, '<123>', '<456>'), 'test02');
        d.check('',
          _.tagOuterLast(Text, '<456>', '<789>'), 'test03');
        d.check('',
          _.tagOuterLast(Text, '<456>', '<123>'), 'test04');
        d.check('',
          _.tagOuterLast(Text, '<789>', '<456>'), 'test05');
        d.check('',
          _.tagOuterLast(Text, '<321>', '<456>'), 'test06');
        d.check('<123>456<789>',
          _.tagOuterLast(Text, '<123>', '6<789>'), 'test06');
      };

      //----------------------------------------
      //・タグで囲まれた文字を全て抽出する
      //----------------------------------------
      _.tagOuterAll = function (str, startTag, endTag) {
        return _.tagOuterAllArray(str, startTag, endTag).join('');
      };

      _.test_tagOuterAll = function () {

        d.check('<def>', _.tagOuterAll('abc<def>ghi', '<', '>'));
        d.check('<def><jkl>', _.tagOuterAll('abc<def>ghi<jkl>mn', '<', '>'));
      };

      //----------------------------------------
      //・タグで囲まれた文字を全て抽出して配列に出力する
      //----------------------------------------
      _.tagOuterAllArray = function (str, startTag, endTag) {
        d.assert((!t.isNullOrUndefined(str)) );
        d.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexStartTag, indexEndTag;
        var result = [];

        while (true) {
          indexStartTag = _.indexOfFirst(str, startTag);
          if (indexStartTag !== -1) {
            //startTagはある
            indexEndTag = _.indexOfFirst(str, endTag, 
              indexStartTag + startTag.length);
            if (indexEndTag !== -1) {
              //endTagはある
              a.add(result, startTag + _.startFirstDelim(
                _.endFirstDelim(str, startTag), endTag) + endTag);
            } else {
              //endTagはない
              return result;
            }
          } else {
            //startTagはない
            return result;
          }

          str = _.substrIndex(str, indexEndTag + endTag.length);
        }
      };


      //----------------------------------------
      //◇文字列生成
      //----------------------------------------
      _.repeat = function (str, count) {
        var result = '';
        for (var i = 0; i < count; i += 1) {
          result += str;
        }
        return result;
      };

      _.test_repeat = function () {

        d.check('AAAAA',  _.repeat('A', 5));
        d.check('ABABAB', _.repeat('AB', 3));
        d.check('AB',     _.repeat('AB', 1));
        d.check('',       _.repeat('AB', 0));
        d.check('',       _.repeat('', 0));
        d.check('',       _.repeat('', 5));
      };

      //----------------------------------------
      //◇置き換え
      //----------------------------------------

      //----------------------------------------
      //・replaceAll
      //----------------------------------------
      //  ・  文字列の繰り返し置換
      //----------------------------------------
      _.replaceAll = function (str, before, after) {
        return str.split(before).join(after);
      };

      _.test_replaceAll = function () {

        d.check('AAABBBAAA', _.replaceAll('123BBB123', '123', 'AAA'));
        d.check('AAAABBBBBBBAAAA', 
          _.replaceAll('AAAAAAABBBBBBBAAAAAAA', 'AA', 'A'));
      };

      //----------------------------------------
      //◇変換
      //----------------------------------------

      //----------------------------------------
      //・逆順
      //----------------------------------------
      _.reverse = function (str) {
        return str.split('').reverse().join('');
      };

      _.test_reverse = function () {

        d.check('54321', _.reverse('12345'));
        d.check('321', _.reverse('123'));
        d.check('21', _.reverse('12'));
        d.check('2', _.reverse('2'));
        d.check('', _.reverse(''));
      };

      //----------------------------------------
      //◇カンマ区切り/スペース区切り
      //----------------------------------------

      //----------------------------------------
      //・先頭から区切る
      //----------------------------------------
      _.formatInsertFirst = function (str, delimiter, count) {

        d.assert(t.isString(str));
        d.assert(t.isString(delimiter));
        d.assert(t.isInt(count));

        if (s.isEmpty(str)) {
          return '';
        }

        //WSHは文字列をstr[i]の形で扱えないので
        //その対策を行う
        str = str.split('');

        var result = str[0];
        for (var i = 1; i <= str.length - 1; i += 1) {
          if (i % count === 0) {
            result += delimiter + str[i];
          } else {
            result += str[i];
          }
        }
        return result;
      };

      _.test_formatInsertFirst = function () {

        d.check('123 456 789 012 3',_.formatInsertFirst('1234567890123', ' ', 3));
        d.check('123 456 789 123',  _.formatInsertFirst('123456789123', ' ', 3));
        d.check('123,4',            _.formatInsertFirst('1234', ',', 3));
        d.check('123',              _.formatInsertFirst('123', ',', 3));
        d.check('12',               _.formatInsertFirst('12', ',', 3));
        d.check('0',                _.formatInsertFirst('0', ',', 3));
        d.check('',                 _.formatInsertFirst('', ',', 3));
      };

      //----------------------------------------
      //・後方から区切る
      //----------------------------------------
      _.formatInsertLast = function (str, delimiter, count) {

        d.assert(t.isString(str));
        d.assert(t.isString(delimiter));
        d.assert(t.isInt(count));

        if (s.isEmpty(str)) {
          return '';
        }

        //WSHは文字列をstr[i]の形で扱えないので
        //その対策を行う
        str = str.split('');

        var result = str[str.length - 1];
        for (var i = 1; i <= str.length - 1; i += 1) {
          if (i % count === 0) {
            result += delimiter + str[str.length - 1 - i];
          } else {
            result += str[str.length - 1 - i];
          }
        }
        return s.reverse(result);
      };

      _.test_formatInsertLast = function () {

        d.check('1 234 567 890 123',_.formatInsertLast('1234567890123', ' ', 3));
        d.check('123 456 789 123',  _.formatInsertLast('123456789123', ' ', 3));
        d.check('1,234',            _.formatInsertLast('1234', ',', 3));
        d.check('123',              _.formatInsertLast('123', ',', 3));
        d.check('12',               _.formatInsertLast('12', ',', 3));
        d.check('0',                _.formatInsertLast('0', ',', 3));
        d.check('',                 _.formatInsertLast('', ',', 3));
      };

    }());
    var s = lib.string; //ショートカット呼び出し

    //----------------------------------------
    //◆文字列拡張メソッド
    //----------------------------------------
    //  ・拡張メソッドのように後方にメソッドを接続して
    //    動作させることができる
    //      var str = new lib.String('abc');
    //      str.isInclude('a');  //true
    //  ・new 無しでも動作するようにする仕組みも組み込んでいる
    //  ・lib.String の名前空間部分だけ記述が下記のように長い
    //----------------------------------------

    _.String = lib.String || function (value) {
      if (!(this instanceof lib.String)) {
        return new lib.String(value);
      }
      this.value = value;
    };
    (function () {
      var _ = lib.String;

      _.prototype.isEmpty = function () {
        return lib.string.isEmpty(this.value);
      };

      _.prototype.ifEmptyValue = function (emptyValue) {
        return lib.string.ifEmptyValue(this.value, emptyValue);
      };

      _.prototype.isInclude = function (search) {
        return lib.string.isInclude(this.value, search);
      };

      _.prototype.includeCount = function (search) {
        return lib.string.includeCount(this.value, search);
      };

      _.prototype.indexOfFirst = function (search, startIndex) {
        return lib.string.indexOfFirst(this.value, search, startIndex);
      };

      _.prototype.indexOfLast = function (search, startIndex) {
        return lib.string.indexOfLast(this.value, search, startIndex);
      };

      _.prototype.substrIndex = function (startIndex, endIndex) {
        return lib.string.substrIndex(this.value, startIndex, endIndex);
      };

      _.prototype.substrLength = function (startIndex, length) {
        return lib.string.substrLength(this.value, startIndex, length);
      };

      _.prototype.start = function (length) {
        return lib.string.start(this.value, length);
      };

      _.prototype.isStart = function (search) {
        return lib.string.isStart(this.value, search);
      };

      _.prototype.includeStart = function (search) {
        return lib.string.includeStart(this.value, search);
      };

      _.prototype.excludeStart = function (search) {
        return lib.string.excludeStart(this.value, search);
      };

      _.prototype.end = function (length) {
        return lib.string.end(this.value, length);
      };

      _.prototype.isEnd = function (search) {
        return lib.string.isEnd(this.value, search);
      };

      _.prototype.includeEnd = function (search) {
        return lib.string.includeEnd(this.value, search);
      };

      _.prototype.excludeEnd = function (search) {
        return lib.string.excludeEnd(this.value, search);
      };

      _.prototype.bothEndsWith = function (search) {
        return lib.string.bothEndsWith(this.value, search);
      };

      _.prototype.includeBothEnds = function (search) {
        return lib.string.includeBothEnds(this.value, search);
      };

      _.prototype.excludeBothEnds = function (search) {
        return lib.string.excludeBothEnds(this.value, search);
      };

      _.prototype.startFirstDelim = function (delimiter) {
        return lib.string.startFirstDelim(this.value, delimiter);
      };

      _.prototype.startLastDelim = function (delimiter) {
        return lib.string.startLastDelim(this.value, delimiter);
      };

      _.prototype.endFirstDelim = function (delimiter) {
        return lib.string.endFirstDelim(this.value, delimiter);
      };

      _.prototype.endLastDelim = function (delimiter) {
        return lib.string.endLastDelim(this.value, delimiter);
      };

      _.prototype.trimStart = function (trimStrArray) {
        return lib.string.trimStart(this.value, trimStrArray);
      };

      _.prototype.trimEnd = function (trimStrArray) {
        return lib.string.trimEnd(this.value, trimStrArray);
      };

      _.prototype.trimBothEnds = function (trimStrArray) {
        return lib.string.trimBothEnds(this.value, trimStrArray);
      };

      _.prototype.trim = function () {
        return lib.string.trim(this.value);
      };

      _.prototype.deleteFirst = function (search) {
        return lib.string.deleteFirst(this.value, search);
      };

      _.prototype.deleteLast = function (search) {
        return lib.string.deleteLast(this.value, search);
      };

      _.prototype.deleteFirstTagInner = function (startTag, endTag) {
        return lib.string.deleteFirstTagInner(this.value, startTag, endTag);
      };

      _.prototype.deleteFirstTagOuter = function (startTag, endTag) {
        return lib.string.deleteFirstTagOuter(this.value, startTag, endTag);
      };

      _.prototype.deleteLastTagInner = function (startTag, endTag) {
        return lib.string.deleteLastTagInner(this.value, startTag, endTag);
      };

      _.prototype.deleteLastTagOuter = function (startTag, endTag) {
        return lib.string.deleteLastTagOuter(this.value, startTag, endTag);
      };

      _.prototype.deleteAllTag = function (startTag, endTag) {
        return lib.string.deleteAllTag(this.value, startTag, endTag);
      };

      _.prototype.tagInnerFirst = function (startTag, endTag) {
        return lib.string.tagInnerFirst(this.value, startTag, endTag);
      };

      _.prototype.tagOuterFirst = function (startTag, endTag) {
        return lib.string.tagOuterFirst(this.value, startTag, endTag);
      };

      _.prototype.tagInnerLast = function (startTag, endTag) {
        return lib.string.tagInnerLast(this.value, startTag, endTag);
      };

      _.prototype.tagOuterLast = function (startTag, endTag) {
        return lib.string.tagOuterLast(this.value, startTag, endTag);
      };

      _.prototype.tagOuterAll = function (startTag, endTag) {
        return lib.string.tagOuterAll(this.value, startTag, endTag);
      };

      _.prototype.replaceAll = function (before, after) {
        return lib.string.replaceAll(this.value, before, after);
      };

      _.prototype.test = function () {

        //拡張メソッド的な使い方
        var str1 = new lib.String('abc');
        d.check(true, str1.isInclude('a'));
        d.check(true, str1.isInclude('b'));
        d.check(true, str1.isInclude('c'));
        d.check(false,str1.isInclude('d'));

        //newしなくてもよい
        var str2 = lib.String('abc');
        d.check(true, str2.isInclude('a'));
        d.check(true, str2.isInclude('b'));
        d.check(true, str2.isInclude('c'));
        d.check(false,str2.isInclude('d'));
      };
    }());

    //----------------------------------------
    //◇オブジェクト拡張メソッド継承
    //----------------------------------------
    //  ・拡張メソッドの方のオブジェクトは継承して
    //    次のようなものを作ることができる
    //  ・StringEx は継承の実装例なので
    //    ライブラリとして使うためのものではない
    //----------------------------------------

    _.StringEx = lib.StringEx || function (value) {
      if (!(this instanceof lib.StringEx)) {
        return new lib.StringEx(value);
      }
      _.String.call(this, value);
    };
    lib.inherits(_.StringEx, _.String);

    (function () {
      var _ = lib.StringEx;

      _.prototype.isNotInclude = function (search) {
        return !lib.string.isInclude(this.value, search);
      };

      _.prototype.test = function () {

        //継承しているので継承元のメソッドが使える
        var str3 = new lib.StringEx('abc');
        d.check(false,str3.isNotInclude('a'));
        d.check(false,str3.isNotInclude('b'));
        d.check(false,str3.isNotInclude('c'));
        d.check(true, str3.isNotInclude('d'));
        d.check(true, str3.isInclude('a'));
        d.check(true, str3.isInclude('b'));
        d.check(true, str3.isInclude('c'));
        d.check(false,str3.isInclude('d'));

        //継承しても new しなくてもよい
        var str4 = lib.StringEx('abc');
        d.check(false,str4.isNotInclude('a'));
        d.check(false,str4.isNotInclude('b'));
        d.check(false,str4.isNotInclude('c'));
        d.check(true, str4.isNotInclude('d'));
        d.check(true, str4.isInclude('a'));
        d.check(true, str4.isInclude('b'));
        d.check(true, str4.isInclude('c'));
        d.check(false,str4.isInclude('d'));

        var str5 = new lib.String('abc');
        //d.check(false,str5.isNotInclude('a'));
        //str5にはisNotIncludeメソッドはないために
        //これはエラーになる

        d.check(true,  str3 instanceof lib.String);
        d.check(true,  str3 instanceof lib.StringEx);
        d.check(false, str3.constructor === lib.String);
        d.check(true,  str3.constructor === lib.StringEx);

        d.check(true,  str4 instanceof lib.String);
        d.check(true,  str4 instanceof lib.StringEx);
        d.check(false, str4.constructor === lib.String);
        d.check(true,  str4.constructor === lib.StringEx);

        d.check(true,  str5 instanceof lib.String);
        d.check(false, str5 instanceof lib.StringEx);
        d.check(true,  str5.constructor === lib.String);
        d.check(false, str5.constructor === lib.StringEx);

      };

    }());

    _.Document = lib.Document || function (value) {
      if (!(this instanceof lib.Document)) {
        return new lib.Document(value);
      }
      this._textArray = [];
      this.setText(value);
    };
    (function () {
      var _ = lib.Document;

      _.prototype.getLine = function (index) {

        var n = stsLib.number;
        d.assert(t.isInt(index));
        d.assert(n.isRange(index, 0, this._textArray.length - 1));
        return this._textArray[index];
      };

      _.prototype.setLine = function (index, line) {

        var n = stsLib.number;
        d.assert(t.isInt(index));
        d.assert(n.isRange(index, 0, this._textArray.length));
        if (n.isRange(index, 0, this._textArray.length - 1)) {
          this._textArray[index] = line;
        } else {
          this._textArray.push(line);
        }
        this.setText(this.getText());
        //改行コードなしのlineをセットした時にでも
        //配列がリフレッシュされる
      };

      _.prototype.getText = function () {
        return this._textArray.join('');
      };

      _.prototype.setText = function (value) {
        this._textArray = value.match(/[^\r\n]*(\r\n|\r|\n|$)/g);
      };

    }());
    (function () {
      var _ = lib.Document;

      _.prototype.test = function () {

        var originalText = '0123\r456\n789\r\n0123\r\r456\n\n789\r\n\r\n0123\n\r\n\r456';
        var doc = lib.Document(originalText);

        d.check('0123\r',   doc.getLine(0));
        d.check('456\n',    doc.getLine(1));
        d.check('789\r\n',  doc.getLine(2));
        d.check('0123\r',   doc.getLine(3));
        d.check('\r',       doc.getLine(4));
        d.check('456\n',    doc.getLine(5));
        d.check('\n',       doc.getLine(6));
        d.check('789\r\n',  doc.getLine(7));
        d.check('\r\n',     doc.getLine(8));
        d.check('0123\n',   doc.getLine(9));
        d.check('\r\n',     doc.getLine(10));
        d.check('\r',       doc.getLine(11));
        d.check('456',      doc.getLine(12));

        //getTextのテスト
        d.check(originalText, doc.getText());

        //setLineのテスト
        doc.setLine(0, 'ABC\r\n');
        doc.setLine(1, 'DEF\r');
        d.check('ABC\r\n',  doc.getLine(0));
        d.check('DEF\r',    doc.getLine(1));
        d.check('789\r\n',  doc.getLine(2));

        //setLine 最終行追加のテスト
        doc.setLine(0, '0123\r');
        doc.setLine(1, '456\n');
        doc.setLine(13, 'GHI\r\n');
        d.check(originalText + 'GHI\r\n', doc.getText());

        //setLine 改行コード無しのテスト
        doc.setLine(0, 'A');
        doc.setLine(0, 'B');
        d.check('B789\r\n',  doc.getLine(0));
        d.check('0123\r',   doc.getLine(1));
      };

    }());

    //----------------------------------------
    //◆日付時刻処理
    //----------------------------------------
    _.datetime = lib.datetime || {};
    (function () {
      var _ = lib.datetime;

      //----------------------------------------
      //◆日付時刻処理
      //----------------------------------------

      _.format_yyyy_mm_dd = function (value, delimiter){

        return value.getFullYear() +
          delimiter +
          s.end('0' + (value.getMonth()+1), 2) +
          delimiter +
          s.end('0' + value.getDate(), 2);
      };

      _.format_hh_mm_dd = function (value, delimiter){

        return value.getHours() +
          delimiter +
          s.end('0' + value.getMinutes(), 2) +
          delimiter +
          s.end('0' + value.getSeconds(), 2);
      };

      //年齢
      _.getAgeYearMonthDay = function (todayDate, birthDate) {

        var birthYear = birthDate.getFullYear();
        var birthMonth = birthDate.getMonth() + 1;
        var birthDay = birthDate.getDate();
        var todayYear = todayDate.getFullYear();
        var todayMonth = todayDate.getMonth() + 1;
        var todayDay = todayDate.getDate();

        //年齢計算
        var diffYear = todayYear - birthYear;
        //過去と同一日を過ぎていなければ１引く
        if (todayMonth < birthMonth) {
          diffYear = diffYear - 1;
        } else {
          if ((todayMonth === birthMonth) && (todayDay < birthDay)) {
            diffYear = diffYear - 1;
          }
        }
        //年齢の月計算
        var diffMonth = ((todayYear * 12) + todayMonth)
          - ((birthYear * 12) + birthMonth);
        if (todayDay < birthDay) {
          diffMonth = diffMonth - 1;
        }
        //年齢の日計算
        var diffDay = todayDate.getDate() - birthDate.getDate();
        if (diffDay < 0) {
          //前月の過去日と同一日からの経過日数を計算している
          diffDay =
            _.getMonthEndDay(todayDate.getYear(), todayDate.getMonth())
            - birthDate.getDate()
            + todayDate.getDate();
        }
        return {'year': diffYear,
          'month': diffMonth - (diffYear * 12),
          'day': diffDay};
      };

      //年齢
      _.getAgeMonthDay = function (todayDate, birthDate) {

        var birthYear = birthDate.getFullYear();
        var birthMonth = birthDate.getMonth() + 1;
        var birthDay = birthDate.getDate();
        var todayYear = todayDate.getFullYear();
        var todayMonth = todayDate.getMonth() + 1;
        var todayDay = todayDate.getDate();

        //年齢の月計算
        var diffMonth = ((todayYear * 12) + todayMonth)
          - ((birthYear * 12) + birthMonth);
        if (todayDay < birthDay) {
          diffMonth = diffMonth - 1;
        }
        //年齢の日計算
        var diffDay = todayDate.getDate() - birthDate.getDate();
        if (diffDay < 0) {
          //前月の過去日と同一日からの経過日数を計算している
          diffDay =
            _.getMonthEndDay(todayDate.getYear(), todayDate.getMonth())
            - birthDate.getDate()
            + todayDate.getDate();
        }
        return {'month': diffMonth,
          'day': diffDay};
      };

      _.getAgeDay = function (todayDate, birthDate) {

        var birthYear = birthDate.getFullYear();
        var birthMonth = birthDate.getMonth() + 1;
        var birthDay = birthDate.getDate();
        var todayYear = todayDate.getFullYear();
        var todayMonth = todayDate.getMonth() + 1;
        var todayDay = todayDate.getDate();

        //年齢の日計算
        var date1 = new Date(birthYear, birthMonth - 1, birthDay);
        var date2 = new Date(todayYear, todayMonth - 1, todayDay);

        var diffDay = date2 - date1;
        diffDay = diffDay / ( 24 * 60 * 60 * 1000);
        return {'day': diffDay};
      };

      _.dayCount = function (todayDate, birthDate) {
        var diff = todayDate - birthDate;
        diff = diff / ( 24 * 60 * 60 * 1000);
        return Math.floor(diff);
      };

      _.hoursCount = function (todayDate, birthDate) {
        var diff = todayDate - birthDate;
        diff = diff / ( 60 * 60 * 1000);
        return Math.floor(diff);
      };

      _.minutesCount = function (todayDate, birthDate) {
        var diff = todayDate - birthDate;
        diff = diff / ( 60 * 1000);
        return Math.floor(diff);
      };

      _.secondsCount = function (todayDate, birthDate) {
        var diff = todayDate - birthDate;
        diff = diff / (1000);
        return Math.floor(diff);
      };

      /*  --------------
      年月を指定して月末日を求める関数
      引数：  year 年
          month 月
      備考：  指定月の翌月の0日を取得して末日を求める
          monthに11(月)を指定すると
          Dateは0～11で月を表すためDate(year, 11, 0)は
          12月の0日を表すので11月末日を示すことになる
      参考：
        JavaScript による日付・時刻・時間の計算・演算のまとめ - hoge256ブログ
        http://www.hoge256.net/2007/08/64.html
      ------------  */
      _.getMonthEndDay = function (year, month) {
        var dt = new Date(year, month, 0);
        return dt.getDate();
      };

    }());

    //----------------------------------------
    //◆ファイルフォルダパス処理
    //----------------------------------------
    _.path = lib.path || {};
    (function () {
      var _ = lib.path;

      _.getFileName = function (fileName) {
        return fileName.substring(fileName.lastIndexOf('/')+1,fileName.length);
      };

      _.test_getFileName = function () {

        d.check('a.txt', _.getFileName('file://test/test/a.txt'));
      };

      //----------------------------------------
      //・ピリオドを含んだ拡張子を取得する
      //----------------------------------------
      _.getExtensionIncludePeriod = function (path) {

        var result = '';
        result = s.endLastDelim(path, '.');
        if (result == path) {
          result = '';
        } else {
          result = s.includeStart(result, '.');
        }
        return result;
      };

    }());

    //----------------------------------------
    //◆グローバル拡張
    //----------------------------------------
    (function () {
      var _ = global;

      //----------------------------------------
      //・alert
      //----------------------------------------
      //  ・ライブラリ内部で alert を使うので
      //    alert がない環境(node.jsとか)での動作の時に
      //    エラーにならないように定義する
      //----------------------------------------
      _.alert = _.alert || function (message) {
        console.log(message);
      };

      //----------------------------------------
      //◇Array
      //----------------------------------------

      //----------------------------------------
      //・Array.isArray
      //----------------------------------------
      //  ・Array.isArray が存在しない環境(WSHなど)
      //    のために実装
      //  ・参考:書籍:JavaScriptパターン P51
      //----------------------------------------
      _.Array.isArray = _.Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };

      //----------------------------------------
      //・Array.every
      //----------------------------------------
      //  ・配列がすべてfuncで指定した条件を満たしているか
      //    を調べるメソッド
      //  ・thisObjを指定すると、funcで呼び出される時にthisを指定できる
      //----------------------------------------
      _.Array.prototype.every = _.Array.prototype.every || function(func, thisObj) {
        for (var i = 0, max = this.length; i < max; i += 1) {
          if (!func.call(thisObj, this[i], i, this)) {
            return false;
          }
        }
        return true;
      };

      //----------------------------------------
      //・Array.some
      //----------------------------------------
      //  ・配列のどれかがfuncで指定した条件を満たしているか
      //    を調べるメソッド
      //  ・thisObjを指定すると、funcで呼び出される時にthisを指定できる
      //----------------------------------------
      _.Array.prototype.some = _.Array.prototype.some || function(func, thisObj) {
        for (var i = 0, max = this.length; i < max; i += 1) {
          if (func.call(thisObj, this[i], i, this)) {
            return true;
          }
        }
        return false;
      };

      //----------------------------------------
      //・Array.some
      //----------------------------------------
      //  ・すべての要素に対してfuncを実行する
      //  ・thisObjを指定すると、funcで呼び出される時にthisを指定できる
      //----------------------------------------
      _.Array.prototype.forEach = _.Array.prototype.forEach || function(func, thisObj) {
        for (var i = 0, max = this.length; i < max; i += 1) {
          func.call(thisObj, this[i], i, this);
        }
      };

    }()); //global

    //----------------------------------------
    //◆動作確認
    //----------------------------------------
    _.test = lib.test || {};
    (function () {
      var _ = lib.test;

      _.test_stslib_core = function () {

        d.test_check();
        d.test_checkException();
        d.test_checkResult();

        var c = stsLib.compare;
        c.test_orValue();

        t.test_isNullOrUndefined();
        t.test_isBoolean();
        t.test_isNumber();
        t.test_isInt();
        // t.test_isIntArray();
        t.test_isString();
        t.test_ifNullOrUndefinedValue();

        var n = stsLib.number;
        n.test_round();
        n.test_nearEqual();
        n.test_formatDigitComma();

        s.test_deleteIndex();
        s.test_deleteLength();
        s.test_isInclude();
        s.test_includeCount();
        s.test_isIncludeAll();
        s.test_indexOfFirst();
        s.test_indexOfLast();
        s.test_indexOfAnyFirst();
        s.test_indexOfAnyLast();
        s.test_indexOfFuncFirst();
        s.test_indexOfFuncLast();
        s.test_substrIndex();
        s.test_substrLength();
        s.test_start();
        s.test_isStart();
        s.test_includeStart();
        s.test_excludeStart();
        s.test_end();
        s.test_isEnd();
        s.test_includeEnd();
        s.test_excludeEnd();
        s.test_startFirstDelim();
        s.test_startLastDelim();
        s.test_endFirstDelim();
        s.test_endLastDelim();

        var str = new stsLib.String('abc');
        str.test();

        //WSH 非対応なので実行させない
        var strEx = new stsLib.StringEx('123');
        strEx.test();

        stsLib.test.test_equalOperator();

        s.test_trimStart();
        s.test_trimEnd();

        s.test_deleteFirstLast();
        s.test_deleteFirstTagInner();
        s.test_deleteFirstTagOuter();
        s.test_deleteLastTagInner();
        s.test_deleteLastTagOuter();
        s.test_deleteAllTag();

        s.test_tagInnerFirst();
        s.test_tagOuterFirst();
        s.test_tagInnerLast();
        s.test_tagOuterLast();
        s.test_tagOuterAll();

        s.test_repeat();
        s.test_replaceAll();
        s.test_reverse();

        s.test_formatInsertFirst();
        s.test_formatInsertLast();

        var a = stsLib.array;
        a.test_equal();
        a.test_insert();
        a.test_deleteIndex();
        a.test_deleteLength();
        a.test_indexOfFirst();
        a.test_indexOfLast();
        a.test_indexOfArrayFirst();
        a.test_indexOfArrayLast();
        a.test_multiDimensionExpand();

        var angle = stsLib.angle;
        angle.test_angleRelative();
        angle.test_degreeToRadian();

        var path = stsLib.path;
        path.test_getFileName();

        var doc = stsLib.Document('');
        doc.test();

        d.check(true,   Array.isArray([]));
        d.check(false,  Array.isArray(123));
        d.check(false,  Array.isArray('abc'));
        d.check(false,  Array.isArray({}));

        //Array.prototype.everyの動作確認
        d.check(true, [1,1,1].every(
          function (element, index, array) {
            return (element === 1);
          }));
        d.check(false, [1,1,2].every(
          function (element, index, array) {
            return (element === 1);
          }));
        var testObj;
        testObj = {value: 1};
        d.check(true, [1,1,1].every(
          function (element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //everyのthis指定
        d.check(false, [1,1,2].every(
          function (element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //everyのthis指定

        //Array.prototype.someの動作確認
        d.check(true, [1,2,3].some(
          function (element, index, array) {
            return (element === 1);
          }));
        d.check(false, [2,2,3].some(
          function (element, index, array) {
            return (element === 1);
          }));
        testObj = {value: 1};
        d.check(true, [1,2,3].some(
          function (element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //someのthis指定
        d.check(false, [2,2,3].some(
          function (element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //someのthis指定

        //Array.prototype.forEach
        var result = '';
        [1, 2, 3].forEach(function (element, index, array) {
          result += element;
        });
        d.check('123', result);
        testObj = {value: 'A'};
        result = '';
        [1, 2, 3].forEach(function (element, index, array) {
          result += element.toString() + this.value;
        }, testObj);
        d.check('1A2A3A', result);

        alert('finish stslib_core_test テスト終了');
        //日本語メッセージが表示されることで
        //エンコード確認も兼ねる

      };  //test_stslib_core

      //----------------------------------------
      //・イコール演算子の挙動調査
      //----------------------------------------
      _.test_equalOperator = function () {

        var value;
        value = true;
        d.check(true , value==true        ,'v01-01');
        //↓boolean型とstring型は比較一致不可能
        d.check(false, value=='true'      ,'v01-02');
        //↓『+''』を付属して文字列化すれば一致確認OK
        d.check(true , value+''=='true'   ,'v01-03');
        //↓文字列に『!!』を付属するとtrueが返される
        d.check(true , value==!!'true'    ,'v01-04');
        d.check(true , !!value==!!'true'  ,'v01-05');
        //↓boolean型側に『!!』を付属させてもNG
        d.check(false, !!value=='true'    ,'v01-06');
        d.check(true , !!value==true      ,'v01-06-02');

        d.check(false, value==false       ,'v01-07');
        d.check(false, value=='false'     ,'v01-08');
        d.check(false, value+''=='false'  ,'v01-09');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  判定はできない
        d.check(true , value==!!'false'   ,'v01-10');
        d.check(true , !!value==!!'false' ,'v01-11');
        d.check(false, !!value=='false'   ,'v01-12');
        d.check(false, !!value==false     ,'v01-13');

        value = false;
        d.check(false , value==true       ,'v02-01');
        d.check(false, value=='true'      ,'v02-02');
        d.check(false, value+''=='true'   ,'v02-03');
        d.check(false, value==!!'true'    ,'v02-04');
        d.check(false, !!value==!!'true'  ,'v02-05');
        d.check(false, !!value=='true'    ,'v02-06');
        d.check(false, !!value==true      ,'v02-06-02');

        d.check(true , value==false       ,'v02-07');
        //↓boolean型とstring型は比較一致不可能
        d.check(false, value=='false'     ,'v02-08');
        //↓『+''』を付属して文字列化すれば一致確認OK
        d.check(true , value+''=='false'  ,'v02-09');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  判定はできない
        d.check(false, value==!!'false'   ,'v02-10');
        d.check(false, !!value==!!'false' ,'v02-11');
        d.check(false, !!value=='false'   ,'v02-12');
        d.check(true , !!value==false     ,'v02-13');

        //というわけで
        //falseの場合は[!!値]では判定できないので
        //!!でキャストできるという噂は嘘

        var s;
        s = 'true';
        d.check(true , s=='true'          ,'V03-01');
        //↓boolean型とstring型は比較一致不可能
        d.check(false, s==true            ,'V03-01');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  合っているようにみえるが
        d.check(true , !!s==true          ,'V03-02');

        d.check(false, s==false           ,'V03-03');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  合っているようにみえるが
        d.check(false, !!s==false         ,'V03-04');

        s = 'false';
        d.check(false, s=='true'          ,'V04-01');
        d.check(false, s==true            ,'V04-01');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  falseの場合でもtrueと判定してしまう
        d.check(true , !!s==true          ,'V04-02');

        d.check(false, s==false           ,'V04-03');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  falseの場合でも一致しない
        d.check(false, !!s==false         ,'V04-04');

      };

    }()); //_.test

  }(stsLib, this));   //stsLib

  if (typeof module === 'undefined') {
    requireList['stsLib'] = stsLib;
  } else {
    module.exports = stsLib;
  }

}());   //(function () {
