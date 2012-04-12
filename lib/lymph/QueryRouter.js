var _ = require("underscore");

module.exports = function(appContext, queries){
    var self = this, handlers = {};

    _.each(queries, function(QH, key) {
        handlers[key] = new QH(appContext);
    });

    return function(app){

        app.get("/q/:contextId/:queryGroup/:query/:criteria", function(req, res, next){

            var handler = handlers[req.params.queryGroup];

            if(handler === undefined){
                res.writeHead(404);
                res.end();
            }else{
                if(handler[req.params.query] === undefined){
                    res.writeHead(404);
                    res.end();
                }else{
                    handler[req.params.query]({
                                contextId: req.params.contextId,
                                criteria:  req.params.criteria,
                                query:     req.query
                            },
                            function(resBody){
                                                var output = JSON.stringify(resBody);
                                                var headers = {
                                                    "Content-Length": output.length,
                                                    "Content-Type": "application/json"
                                              };
                        res.writeHead(200, headers);
                        res.end(output);
                    });
                }
            }
        });

    };
};

