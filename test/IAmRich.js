require('chai').use(require('chai-as-promised')).should();
var IAmRich = artifacts.require("IAmRich");
var addrIndex = 0;
var nameIndex = 1;
var msgIndex = 2;
var amountIndex = 3;

contract('IAmRich', async(accounts) => {
    it("should have 1 ether for the richest when deployed", async() => {
        let instance = await IAmRich.deployed();
        let richPerson = await instance.richPerson();
        assert.equal(
            richPerson[amountIndex].valueOf(),
            web3.toWei(1, "ether"),
            "richest person does not contribute 1 ether.");
    });

    it("should let rich person proves that he or she is rich", async() => {
        let instance = await IAmRich.deployed();
        await instance.proofOfRich("Jeff", "I'm also rich.",
            {from:accounts[1], value: web3.toWei(2, "ether")});
        let richPerson = await instance.richPerson();
        assert.equal(
            richPerson[addrIndex], accounts[1],
            "richest person's address is not updated.");
        assert.equal(
            richPerson[nameIndex], "Jeff",
            "richest person's name is not updated.");
        assert.equal(
            richPerson[msgIndex], "I'm also rich.",
            "richest person's message is not updated.");
        assert.equal(
            richPerson[amountIndex].valueOf(),
            web3.toWei(2, "ether"),
            "richest person's value is not updated to 2 ether.");
    });

    it("should let person knows that he or she is not rich enough", async() => {
        let instance = await IAmRich.deployed();
        await instance.proofOfRich("SomeRandomPerson", "I think I am rich.",
            {from:accounts[2], value: web3.toWei(0.5, "ether")}).
            should.be.rejectedWith("You are not rich enough");
    });

    it("should let owner claim ethers", async() => {
        let instance = await IAmRich.new("NAME", "MSG", {from: accounts[0]});
        let oldBalance = web3.eth.getBalance(accounts[0]);
        await instance.proofOfRich("NAME", "MSG",
            {from:accounts[1], value: web3.toWei(2, "ether")});
        await instance.proofOfRich("NAME", "MSG",
            {from:accounts[2], value: web3.toWei(4, "ether")});
        assert.equal(web3.eth.getBalance(instance.address), web3.toWei(6, "ether"));
        await instance.claim({from: accounts[0]});
        let newBalance = web3.eth.getBalance(accounts[0]);
        assert.ok(newBalance.toNumber() > oldBalance.toNumber(),
            "balance of owner did not increased.");
        assert.equal(web3.eth.getBalance(instance.address), 0,
            "there are remaining balance in the contract.");
    })

    it("should reject non-owner claims", async() => {
        let instance = await IAmRich.deployed();
        await instance.claim({from: accounts[1]}).should.be.rejected;
    })
});
