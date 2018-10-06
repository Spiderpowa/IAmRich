var IAmRich = artifacts.require("IAmRich");

contract('IAmRich', function() {
    it("should have 1 ether for the richest when deployed", function() {
        return IAmRich.deployed().then(function(instance) {
            return instance.richPerson.call();
        }).then(function(richPerson) {
            assert.equal(
                richPerson[3].valueOf(),
                web3.toWei(1, "ether"),
                "richest person does not contribute 1 ether.");
        });
    });
});