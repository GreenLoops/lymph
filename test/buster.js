var config = module.exports;

config["My tests"] = {
    env: "node",
    tests: [
        //"**/*Test.js"
        "SchemaValidatorTest.js",
        "RepositoryTest.js"
    ]
};

