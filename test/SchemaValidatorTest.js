var buster          = require("buster"),
    sinon           = require("sinon"),
    SchemaValidator = require("../lib/lymph/SchemaValidator");

buster.testCase("Schema Validator", {

    "given an empty schema": {

        setUp: function(){
            this.validator = new SchemaValidator({});
        },

        "return false for any object": function(){
            var self = this;
            assert.equals(false, self.validator.validate({name:"foo"}));
        }
    },

    "given a simple schema validator": {

        setUp: function(){

            var schema = {
                property: {
                    propertyId:"String"
                }
            };

            this.validator = new SchemaValidator(schema);
        },

        "return false for ": function(){
            var self = this;
            assert.equals(false, self.validator.validate({name:"foo"}));
        }
    },

});

var schema = {
    property: {
        propertyId:"String",
        units: [
            {
            unitId:"String"
            name:"String",
            leases: [
                {
                leaseId:"String"
                tenants:[
                    { tenantId:"String"},
                    { name:"String"}
                ]
            }
            ]
        }
        ],
        name: {
            first: "String",
            last: "String"
        },
        created: "Date",
        amount: "Money",
        status: "Number",
        colors: "String|[]",
        favNums: "Number|[]",
        favNums: "Double|[]",
    }
};
