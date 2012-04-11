var Mongolian = require("mongolian"),
    SchemaValidator = require("../lib/lymph/SchemaValidator");

module.exports = {

    CommandRouter: require("./lymph/CommandRouter"),
    QueryRouter: require("./lymph/QueryRouter"),
    AppRouter: require("./lymph/AppRouter"),

    Repository: require("./lymph/Repository"),
    CommandHandler: require("./lymph/CommandHandler"),

    LessEngine: require("./lymph/LessEngine"),

    initRepo: function(name, schema, callback) {
        var server = new Mongolian();
        var db = server.db(name);

        var schemaValidator = new SchemaValidator(schema);
        var repo = new this.Repository(db, schemaValidator);

        callback(repo); 
    }
};

