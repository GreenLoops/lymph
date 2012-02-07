var _ = require("underscore");

module.exports = function(devMode, fs, handler){
    var self = this;

    return function(app){

        app.get("/a/:contextId/:type", function(req, res, next){

            if(handler === undefined){
                res.writeHead(404);
                res.end();
            }else{
                handler(req.params.contextId, req.params.type, function(templateName, templateData){

                    fs.readFile("./templates/"+templateName, "utf-8", function(err, data){

                        if(err){
                            throw err;
                        }

                        var compiled = _.template(data);
                        res.writeHeader(200, {"Content-Type": "text/html"});
                        res.end(compiled(templateData));
                    });
                });
            }
        });

    };
};

