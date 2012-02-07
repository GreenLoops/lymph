var url  = require("url"),
    less = require("less");

var LessEngine = function(fs, root, compress) {
    this.compress = compress || false;
    this.root = root || "";
    this.fs = fs;
};

LessEngine.prototype.parse = function(lessFileName, callback)
{
    var self     = this,
        encoding = "utf-8";

    self.fs.readFile(lessFileName, encoding, function(err, lessData) {
        if(err) 
        {
            callback(err);
        }
        else
        {
            var p = new less.Parser();

            p.parse(lessData, function(err, tree) {

                var imports = [];
                for(var i = 0; i < tree.rules.length; i++)
                {
                    if(tree.rules[i].path)
                    {
                        imports.push(tree.rules[i].path);
                    }
                }

                callback(err, lessData, imports);
            });
        }
    });
};

LessEngine.prototype.compile = function(lessData, cssFileName, callback)
{
    var self     = this,
        encoding = "utf-8";

    less.render(lessData, {compress:self.compress}, function(err, cssData) {
        if(err) {
            callback(err);
        } else {
            self.fs.writeFile(cssFileName, cssData, encoding, callback);
        }
    });
};

LessEngine.prototype.process = function(cssPath, callback) {

    var self = this, lessFileName, cssFileName;

    if(cssPath.match(/\.css$/)) {

        lessFileName = self.root + cssPath.replace(/\.css$/, ".less");
        cssFileName  = self.root + cssPath;

        self.fs.stat(cssFileName, function(err, cssStat) {
            if(cssStat === undefined) {
                self.fs.stat(lessFileName, function(err, lessStat) {
                    if(lessStat === undefined) {
                        callback(cssFileName + " does not exist");
                    } else {
                        self.parse(lessFileName, function(err, lessData, hasImport) {
                            self.compile(lessData, cssFileName, callback);
                        });
                    }
                });
            } else {
                self.fs.stat(lessFileName, function(err, lessStat) {
                    if(lessStat === undefined) {
                        callback(null);
                    } else {
                        self.parse(lessFileName, function(err, lessData, imports) {

                            var recompile = false;

                            if(cssStat.mtime < lessStat.mtime)
                            {
                                recompile = true;
                            }
                            else
                            {
                                for(var i = 0; i < imports.length; i++)
                                {
                                    var importStat = self.fs.statSync(imports[i]);
                                    if(importStat.mtime > lessStat.mtime)
                                    {
                                        recompile = true;
                                    }
                                }
                            }

                            if(recompile)
                            {
                                self.compile(lessData, cssFileName, callback);
                            }
                            else
                            {
                                callback(null);
                            }
                        });
                    }
                });
            }
        });
    } else {
        callback(null);
    }
};

LessEngine.filter = function(fs, root) {

    var le = new LessEngine(fs, root);

    return function(req, res, next) {
        le.process(req.url, function(err) {
            if(err === null) {
                next();
            } else {
                throw new Error(err);
            }
        });
    };
};

module.exports = LessEngine;

