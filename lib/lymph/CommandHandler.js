var CommandHandler = function(repo, collectionName, collectionId){
    var self = this;

    self.repo = repo;
    self.collectionName = collectionName;
    self.collectionId = collectionId;
};

CommandHandler.prototype.insert = function(data, callback){
    var self = this;

    self.repo.insert(self.collectionName, self.collectionId, data, callback);
};

module.exports = CommandHandler;

