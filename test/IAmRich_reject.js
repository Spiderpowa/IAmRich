require('chai').use(require('chai-as-promised')).should();
var IAmRich = artifacts.require("IAmRich");
var addrIndex = 0;
var nameIndex = 1;
var msgIndex = 2;
var amountIndex = 3;

contract('IAmRich', async(accounts) => {
    it("should let person knows that he or she is not rich enough", async() => {
        let instance = await IAmRich.deployed();
        await instance.proofOfRich("SomeRandomPerson", "I think I am rich.",
            {from:accounts[2], value: web3.toWei(1.1, "ether")}).
            should.be.rejectedWith("You are not rich enough");
    });

    it("should reject non-owner claims", async() => {
        let instance = await IAmRich.deployed();
        await instance.claim({from: accounts[1]}).should.be.rejected;
    });

    it("should reject non-owner update amount increase", async() => {
        let instance = await IAmRich.deployed();
        await instance.updateAmountIncrease(130, {from: accounts[1]}).should.be.rejected;
    });


    it("should reject update amount increase if less than 100", async() => {
        let instance = await IAmRich.deployed();
        await instance.updateAmountIncrease(90, {from: accounts[0]})
            .should.be.rejectedWith("Amount increase should be more than 100.");
    });
});
