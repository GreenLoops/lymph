var Mongolian = require("mongolian");

module.exports = {

    CommandRouter: require("./lymph/CommandRouter"),
    QueryRouter: require("./lymph/QueryRouter"),
    Repository: require("./lymph/Repository"),
    CommandHandler: require("./lymph/CommandHandler"),

    initRepo: function(name, callback) {
        var server = new Mongolian();
        var db = server.db(name);
        var repo = new this.Repository(db);
        callback(repo); 
    }
};

