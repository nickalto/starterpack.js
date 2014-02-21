## Data Validations [![Build Status](https://secure.travis-ci.org/dresende/node-enforce.png?branch=master)](http://travis-ci.org/dresende/node-enforce)

This is the package responsible for data validations in [ORM](http://dresende.github.io/node-orm2).

## Enforce

You can create a list of validations for several properties of an `Object` and then run the checks to
see if everything is OK.

```js
var enforce = require("enforce");
var checks  = new enforce.Enforce();

checks
	.add("name", enforce.notEmptyString())
	.add("age", enforce.ranges.number(18, undefined, "under-age"));

checks.check({
	name : "John Doe",
	age  : 16
}, function (err) {
	// err should have an error with "msg" = "under-age"
});
```

You can pass some options in the constructor. One of them is `returnAllErrors` which makes the validations
be all checked before returning errors. With this option, if any error is found, even if it's only one, it will be
returned in an `Array`.

```js
var enforce = require("enforce");
var checks  = new enforce.Enforce({
	returnAllErrors : true
});

checks
	.add("name", enforce.notEmptyString())
	.add("name", enforce.ranges.length(2)) // yes, you can have multiple validators per property
	.add("age", enforce.ranges.number(18, undefined, "under-age"));

checks.check({
	name : "J",
	age  : 16
}, function (err) {
	console.log(err);
	// [ { [Error: "out-of-range-length"], property: "name", value: "J" },
	//   { [Error: "under-age"], property: "age", value: 16 }]
});
```

## Validators

All validators accept a `msg` argument at the end. These argument is the error message returned if the
validation fails. All validators return a `function` that is called by `Enforce` with the value of the property
in question and a `next` callback.

### Required

`enforce.required([ msg ])`

Checks if a property is not `null` and not `undefined`. If can be `false`, `0` or `""`.

### Empty string

`enforce.notEmptyString([ msg ])`

Checks if a property length is not zero. It can actually work with `Array`s.

### Lists

#### Inside a list

`enforce.lists.inside(list[, msg ])`

Checks if the property is inside a list of items.

#### Outside a list

`enforce.lists.outside(list[, msg ])`

Checks if the property is not inside a list of items.

### Ranges

#### In a number range

`enforce.ranges.number(min[, max[, msg ]])`

Checks if a value is inside a specific range of numbers. Either `min` or `max` can be set to `undefined` meaning
that range side is `Infinity`.

Please note that this does not check for the type of value passed, you can even use this with `Date` objects.

#### In a length range

`enforce.ranges.length(min[, max[, msg ]])`

Does the same as the above but for the `length` property.

### Security

#### Username

`enforce.security.username([[ opts, ]msg ])`

Checks if a value matches a username format. `opts` is also optional and is an object with the following keys:

- `length`: the minimal length of the username (default = 2)
- `expr`: the regular expression to be used to match a valid username (if not passed, it's built based on the minimal length)

#### Password

`enforce.security.password([[ checks, ]msg ])`

Checks if a value has some types of characters and a minimal length. `checks` has a default string `luns6` which means:

- `l`: lowercase letters
- `u`: uppercase letters
- `n`: numbers
- `s`: special characters
- `6`: minimal length of 6

You can of course change this to "lu4" (lowercase, uppercase, minimal length of 4). Please note that if you pass only one argument
to this validator, it will assume it's the `msg` argument. If you want to change the default checks, you have to pass both arguments.

#### Credit Card

`enforce.security.creditcard([[ types, ] msg ])`

Checks if a value is a valid credit card number. It supports `amex` (American Express), `visa`, `maestro`, `discover` and `mastercard`.
You can change the list of supported cards (`types`) by passing a list with only some of them. You can also pass `luhn` which will ignore card
prefixes and lenght and only pass the number using the Luhn algorithm.

### Patterns

#### Match

`enforce.patterns.match(pattern, modifiers[, msg ])`

Checks if property passes a specific regular expression. You can pass the `pattern` as a `RegExp` object (setting `modifiers` as `null`)
or just pass a regular expression and it will be converted.

#### Hex string

`enforce.patterns.hexString([ msg ])`

Checks if a property matches a predefined `RegExp` object accepting insensitive hexadecimal characters.

#### E-mail

`enforce.patterns.email([ msg ])`

Checks if a property matches a predefined `RegExp` object accepting valid e-mail addresses.

#### IPv4

`enforce.patterns.ipv4([ msg ])`

Checks if a property matches a predefined `RegExp` object accepting valid IPv4 address.
