function SchemaValidator(schema) {
   var self = this;
   self.schema = schema || {};
}

SchemaValidator.prototype.validate = function(typeName, data) {
    var self = this;
    var rootType = self.schema[typeName]
    var validity = { isValid: false };

    if(rootType !== undefined){
        validity = self.subValidate(rootType, data);
    }
    return validity;
};

SchemaValidator.prototype.subValidate = function(subSchema, data) {
    var self = this;
    var validity = { isValid: false };

    if(subSchema !== undefined){
        for(var propertyName in data){
            var subType = subSchema[propertyName]; 
            var subNode = data[propertyName];

            if(subType === "Id" || subType === "String"){
                validity.isValid = (subNode !== undefined) && (typeof subNode === "string");
            }else if(subType === "Number"){
                validity.isValid = (subNode !== undefined) && (typeof subNode === "number");
            }else if(subType === "Date"){
                validity.isValid = (subNode !== undefined) && (typeof subNode === "number") && subNode === parseInt(subNode);
            }else if(typeof subType === "object" && Object.prototype.toString.call(subNode) !== "[object Array]"){
                for(var subTypeKey in subType){
                    if(subTypeKey === "key"){
                        validity.isValid = true;
                        for(var subNodeKey in subNode){
                            validity = self.subValidate(subType["key"], subNode[subNodeKey]);
                        }
                    }else{
                        validity = self.subValidate(subType, subNode)
                    }
                }
            }else if(typeof subType === "object" && Object.prototype.toString.call(subType) === "[object Array]" && Object.prototype.toString.call(subNode) === "[object Array]"){
                validity.isValid = true;
                if(subType[0] === "String"){
                    subNode.forEach(function(subNodeItem){
                        if(typeof subNodeItem !== "string"){
                            validity.isValid = false;
                        }
                    });
                }else if(subType[0] === "Number"){
                    subNode.forEach(function(subNodeItem){
                        if(typeof subNodeItem !== "number"){
                            validity.isValid = false;
                        }
                    });
                }else if(typeof subType[0] === "object"){
                    subNode.forEach(function(subNodeItem){
                        validity = self.subValidate(subType[0], subNodeItem)
                    });
                }
            }
        }
    }
    return validity;
};

module.exports = SchemaValidator;

