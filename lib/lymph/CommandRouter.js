var _ = require("underscore");

module.exports = function(appContext, commands){
    var self = this, handlers = {};

    _.each(commands, function(CH, key) {
        handlers[key] = new CH(appContext);
    });

    return function(app) {

        app.post("/c/:contextId/:domain/:command", function(req, res, next) {

            var handler = handlers[req.params.domain];

            if(handler === undefined) {
                res.writeHead(404);
                res.end();
            } else {
                if(handler[req.params.command] === undefined) {
                    res.writeHead(404);
                    res.end();
                } else {
                    handler[req.params.command](req.body, function(resBody) {
                        var output = JSON.stringify({status:0, body:resBody});
                        var headers = {
                            "Content-Length": output.length,
                            "Content-Type": "application/json"
                        };
                        res.writeHead(200, headers);
                        res.end(output);
                    },
                    req.params.contextId);
                }
            }
        });
    };
};


