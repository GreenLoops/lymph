var buster          = require("buster"),
    sinon           = require("sinon"),
    SchemaValidator = require("../lib/lymph/SchemaValidator");

buster.testCase("Schema Validator", {

    "should validate, given an optional schema": function(){
        var validator = new SchemaValidator("*");
        assert.equals(true, validator.validate("property", {name:"foo"}).isValid);
    },

    "should not validate, given an empty schema": function(){
        var validator = new SchemaValidator({});
        assert.equals(false, validator.validate("property", {name:"foo"}).isValid);
    },

    "given a type with an id field": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    thingId: "Id"
                }
            });
        },

        "should be valid if document has an id field": function(){
            var validity = this.validator.validate("thing", {thingId:"1234"});
            assert(validity.isValid);
        },

        "should be invalid if document doesn't have an id field": function(){
            var validity = this.validator.validate("thing", {});
            assert.equals(false, validity.isValid);
        },

        "should be valid if document id field is a string": function(){
            assert.equals(true,  this.validator.validate("thing", {thingId:"1234"}).isValid);
            assert.equals(false, this.validator.validate("thing", {thingId:1234}).isValid);
        }
    },

    "given a type with a String field": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    name: "String"
                }
            });
        },

        "should validate if document has configured string field": function(){
            var validity = this.validator.validate("thing", {name:"someName"});
            assert(validity.isValid);
        },

        "should invalidate if document does not have the configured string field": function(){
            var validity = this.validator.validate("thing", {});
            assert.equals(false, validity.isValid);
        }
    },

    "given a type with a Number field": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    count: "Number"
                }
            });
        },

        "should validate if document has configured Number field": function(){
            var validity = this.validator.validate("thing", {count:2});
            assert(validity.isValid);
        },

        "should invalidate if document's field is not a Number": function(){
            var validity = this.validator.validate("thing", {count:"2"});
            assert.equals(false, validity.isValid);
        },

        "should invalidate if document doesn't have the configured Number field": function(){
            var validity = this.validator.validate("thing", {});
            assert.equals(false, validity.isValid);
        }
    },

    "given a type with a Date field": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    begin: "Date"
                }
            });
        },

        "should validate if document has configured Date field": function(){
            var validity = this.validator.validate("thing", {begin:1000});
            assert(validity.isValid);
        },

        "should invalidate if document doesn't have the configured date field": function(){
            var validity = this.validator.validate("thing", {});
            assert.equals(false, validity.isValid);
        },

        "should invalidate if date field is not an integer": function(){
            var validity = this.validator.validate("thing", {begin:100.1});
            assert.equals(false, validity.isValid);
        }
    },

    "given a type with a string array field": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    colors:["String"]
                }
            });
        },

        "should invalidate a document if the string array field is not present": function(){
            var validity = this.validator.validate("thing", {});
            assert.equals(false, validity.isValid);
        },

        "should invalidate a document if the string array field does not contain all strings": function(){
            var validity = this.validator.validate("thing", {colors:["red", 1]});
            assert.equals(false, validity.isValid);
        },

        "should validate a document if the string array field is present": function(){
            var validity = this.validator.validate("thing", {colors:["red","green","blue"]});
            assert.equals(true, validity.isValid);
        }
    },

    "given a type with a number array field": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    scores: ["Number"]
                }
            });
        },

        "should invalidate a document if the number array field is not present": function(){
            var validity = this.validator.validate("thing", {});
            assert.equals(false, validity.isValid);
        },

        "should invalidate a document if the number array field does not contain all numbers": function(){
            var validity = this.validator.validate("thing", {scores:["one", 1]});
            assert.equals(false, validity.isValid);
        },

        "should validate a document if the number array field exists": function(){
            var validity = this.validator.validate("thing", {scores:[1,2]});
            assert.equals(true, validity.isValid);
        }
    },

    "given a type with an embedded object type": { 

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    name: {
                        first: "String"
                    }
                }
            });
        },

        "should validate the document if the embedded object field exists": function(){
            var validity = this.validator.validate("thing", {name:{first:"whatup"}});
            assert.equals(true, validity.isValid);
        },

        "should invalidate the document if the embedded object is not valid": function(){
            var validity = this.validator.validate("thing", {name:{last:"whatup"}});
            assert.equals(false, validity.isValid);
        }
    },

    "given a type with an array of an embedded object type": {

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    names: [{
                        first: "String"
                    }]
                }
            });
        },

        "should validate the document, if the field exists": function(){
            var validity = this.validator.validate("thing", {names:[]});
            assert.equals(true, validity.isValid);
        },

        "should invalidate the document, if the any of the sub object are invalid": function(){
            var validity = this.validator.validate("thing", { names:[ {} ] });
            assert.equals(false, validity.isValid);
        },

        "should validate the document, if all sub objects are valid": function(){
            var validity = this.validator.validate("thing", {
                names:[
                    {first:"foo1"},
                    {first:"foo2"} 
                ]
            });
            assert.equals(true, validity.isValid);
        }
    },

    "given a type with an embedded associative array": {

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    people: {
                        key: {
                            first: "String"
                        }
                    }
                }
            });
        },

        "should validate the document, if the field exists": function(){
            var validity = this.validator.validate("thing", {people:{}});
            assert.equals(true, validity.isValid);
        },

        "should validate the document, if all associative objects are valid": function(){
            var validity = this.validator.validate("thing", {
                people:{
                    "1": { first: "foo1" },
                    "2": { first: "foo2" }
                }
            });
            assert.equals(true, validity.isValid);
        }
    },

    "given an optional type": {

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: "*"
            });
        },

        "should validate object, regardless of it's content": function(){
            var validity = this.validator.validate("thing", {name:"foo"});
            assert.equals(true, validity.isValid);
        }
    },

    "given an optional sub type": {

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    name: "*",
                    other: "String"
                }
            });
        },

        "should validate object, regardless of it's content": function(){
            var validity = this.validator.validate("thing", {other:"foo"});
            assert.equals(true, validity.isValid);
        }
    },

    "given a simple schema": {

        setUp: function(){
            this.validator = new SchemaValidator({
                thing: {
                    name: "String",
                    other: "String"
                }
            });
        },

        "should validate the object, as long as it does not contanin something in addition to the schema": function(){
            var validity = this.validator.validate("thing", {other:"foo", notvalid:"bar"});
            assert.equals(false, validity.isValid);
        }
    }
});

