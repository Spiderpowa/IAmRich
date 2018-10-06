var IAmRich = artifacts.require("./IAmRich.sol");

module.exports = function(deployer) {
  deployer.deploy(IAmRich, "Trump", "I am rich.");
};
