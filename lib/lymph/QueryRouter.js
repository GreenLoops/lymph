module.exports = function(devMode, handlers){
    var self = this;

    return function(app){

        app.get("/q/:contextId/:domain/:query/:type", function(req, res, next){

            var handler = handlers[req.params.domain];

            if(handler === undefined){
                res.writeHead(404);
                res.end();
            }else{
                if(handler[req.params.query] === undefined){
                    res.writeHead(404);
                    res.end();
                }else{
                    handler[req.params.query](req.params.type, function(resBody){
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

