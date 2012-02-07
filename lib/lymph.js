var Mongolian = require("mongolian");

module.exports = {

    Repository: require("./lymph/Repository"),

    initRepo: function(name, callback) {
        var server = new Mongolian();
        var db = server.db(name);
        var repo = new this.Repository(db);
        callback(repo); 
    }
};

