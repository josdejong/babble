var assert = require('assert'),
    Block = require('../../lib/block/Block'),
    Decision = require('../../lib/block/Decision');

describe('Decision', function() {

  it('should create a decision', function () {
    var decision1 = new Decision(function () {}, {});
    assert.ok(decision1 instanceof Decision);

    var decision2 = new Decision({
      yes: new Block(),
      no: new Block()
    });
    assert.ok(decision2 instanceof Decision);
  });

  it('should throw an error when wrongly creating a decision', function () {
    assert.throws(function () { Decision()}, SyntaxError);
    assert.throws(function () { Decision({
      yes: new Block(),
      no: 'no block'
    })}, SyntaxError);
    assert.throws(function () { Decision('no function', {}) }, SyntaxError);
  });

  it('should throw an error when decision function returns a non existing id', function () {
    assert.throws(function () {
      Decision(function () {
        return 'non existing id'
      }, {
        yes: new Block(),
        no: new Block()
      })
    }, Error);
  });

  it('should throw an error when decision function doesn\'t return a string', function () {
    assert.throws(function () {
      var decision = new Decision(function () {
        return 123
      }, {});
      decision.execute();
    }, TypeError);
  });

  it('should execute a decision without decision function', function () {
    var yes = new Block();
    var no = new Block();
    var decision = new Decision({
      yes: yes,
      no: no
    });

    var context = {};
    var next = decision.execute(context, 'yes');
    assert.deepEqual(next, {
      result: undefined,
      block: yes
    })
  });

  it('should execute a decision without arguments', function () {
    var yes = new Block();
    var no = new Block();
    var decision = new Decision(function (response, context) {
      assert.strictEqual(response, undefined);
      assert.strictEqual(context, undefined);
      return 'yes';
    }, {
      yes: yes,
      no: no
    });

    var next = decision.execute();
    assert.deepEqual(next, {
      result: undefined,
      block: yes
    })
  });

  it('should execute a decision with context', function () {
    var yes = new Block();
    var context = {a: 2};
    var decision = new Decision(function (response, context) {
      assert.strictEqual(response, undefined);
      assert.deepEqual(context, {a: 2});
      return 'yes';
    }, {
      yes: yes
    });

    var next = decision.execute(context);
    assert.deepEqual(next, {
      result: undefined,
      block: yes
    })
  });

  it('should execute a decision with context and argument', function () {
    var yes = new Block();
    var context = {a: 2};
    var decision = new Decision(function (response, context) {
      assert.strictEqual(response, 'hello world');
      assert.deepEqual(context, {a: 2});
      return 'yes';
    }, {
      yes: yes
    });

    var next = decision.execute(context, 'hello world');
    assert.deepEqual(next, {
      result: undefined,
      block: yes
    })
  });

});
