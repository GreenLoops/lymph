function SchemaValidator(schema) {
   var self = this;
   self.schema = schema || {};
}

SchemaValidator.prototype.validate = function(data) {
    var self = this;
    return false;
};

module.exports = SchemaValidator;

