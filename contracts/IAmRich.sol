pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract IAmRich is Ownable {
    struct Person {
        address addr;
        string name;
        string msg;
        uint amount;
    }

    Person richPerson;

    function proofOfRich(string _name, string _msg) external payable  {
        require(msg.value > richPerson.amount, "You are not rich enough.");
        richPerson = Person(msg.sender, _name, _msg, msg.value);
    }

    function claim() external onlyOwner  {
        owner.transfer(address(this).balance);
    }
}