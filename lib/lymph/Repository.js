function Repository(db) {
    this.db = db;
}

Repository.prototype.insert = function(collectionName, objId, objToSave, callback){
    var self = this;
    objToSave._id = objToSave[objId];
    self.db.collection(collectionName).insert(objToSave, function(err, inserted){
        callback(inserted, self.db);
    });
};

Repository.prototype.find = function(collectionName, query, callback) {
    var self = this;
    self.db.collection(collectionName).find(query, {_id:false}).toArray(function(err, rst) {
        callback(rst);
    });
};

Repository.prototype.byId = function(collectionName, id, callback) {
    var self = this;
    self.db.collection(collectionName).findOne({_id:id}, function(err, rst){
        delete rst._id;
        callback(rst);
    });
};

Repository.prototype.updateById = function(collectionName, id, objUpdates, callback) {
    var self = this;
    self.db.collection(collectionName).update({_id:id}, {$set:objUpdates}, function(err, updated) {
        callback();
    });
};

Repository.prototype.update = function(collectionName, query, objUpdates, callback) {
    var self = this;
    self.db.collection(collectionName).update(query, {$set:objUpdates}, function(err, updated) {
        callback();
    });
};

module.exports = Repository;

