var buster     = require("buster"),
    Repository = require("../lib/lymph/Repository"),
    Mongolian  = require("mongolian");

buster.testCase("Repository", {

    setUp: function(done){
        this.server = new Mongolian();
        done();
    },

    tearDown: function(done){
        this.server.close();
        done();
    },

    "given a server connection": {

        setUp: function(done){
            this.db = this.server.db("lymph");
            done();
        },

        tearDown: function(done){
            this.db.dropDatabase(function(){
                done();
            });
        },

        "can insert objects into a collection": function(done){
            var self = this;

            var repo = new Repository(self.db);

            repo.insert("sample", "sampleId", {sampleId:"1", name:"foo"}, function(inserted){

                self.db.collection("sample").find().toArray(function(err, rst){
                    assert.equals(rst.length, 1);
                    done();
                });

            });
        },

        "can get objects from a collection by query": function(done) {
            var self = this;

            self.db.collection("sample").insert({_id:"1", sampleId:"1", name:"foo"}, function(err, inserted){

                var repo = new Repository(self.db);

                repo.find("sample", {name:"foo"}, function(items) {
                    assert.equals(items.length, 1);
                    assert.equals(items[0], {sampleId:"1", name:"foo"});
                    done();
                });
            });
        },

        "can get an object from a collection by it's id": function(done){
            var self = this;

            self.db.collection("sample").insert({_id:"1", sampleId:"1", name:"foo"}, function(err){

                var repo = new Repository(self.db);

                repo.byId("sample", "1", function(item){
                    assert.equals(item, {sampleId:"1", name:"foo"});
                    done();
                });
            });
        },

        "can update fields in an eixting object by id": function(done){
            var self = this;

            self.db.collection("sample").insert({_id:"1", sampleId:"1", name:"foo"}, function(err, inserted){

                var repo = new Repository(self.db);

                repo.updateById("sample", "1", {name:"bar"}, function(){

                    self.db.collection("sample").find().toArray(function(err, items){
                        assert.equals(items[0], {_id:"1", sampleId:"1", name:"bar"});
                        done();
                    });
                });
            });
        },

        "can update fields in an eixting object by a query": function(done){
            var self = this;
            var items = [
                {_id:"1", sampleId:"1", name:"foo"},
                {_id:"2", sampleId:"2", name:"bar"},
            ];

            self.db.collection("sample").insert(items, function(err, inserted){

                var repo = new Repository(self.db);

                repo.update("sample", {name:"foo"}, {name:"foobar"}, function(){

                    self.db.collection("sample").find().toArray(function(err, items){
                        assert.equals(items.length, 2);
                        assert.equals(items[1], {_id:"1", sampleId:"1", name:"foobar"});
                        done();
                    });
                });
            });
        }
    }
});

