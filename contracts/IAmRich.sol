pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract IAmRich is Ownable {
  using SafeMath for uint;

  event richPersonChanged(
    address indexed _addr,
    string _name,
    string _msg,
    uint indexed _amount
  );

  struct Person {
    address addr;
    string name;
    string msg;
    uint amount;
  }

  Person public richPerson;
  uint amountIncrease;
  uint public nextAmount;

  constructor(string _name, string _msg, uint _incr) public {
    richPerson = Person(msg.sender, _name, _msg, 1 ether);
    amountIncrease = _incr;
    _updateNextAmount();
  }

  function proofOfRich(string _name, string _msg) external payable {
    require(msg.value > nextAmount, "You are not rich enough.");
    richPerson = Person(msg.sender, _name, _msg, msg.value);
    emit richPersonChanged(msg.sender, _name, _msg, msg.value);
    _updateNextAmount();
  }

  function updateAmountIncrease(uint _incr) external onlyOwner {
    require(_incr > 100, "Amount increase should be more than 100.");
    amountIncrease = _incr;
    _updateNextAmount();
  }

  function claim() external onlyOwner {
    owner.transfer(address(this).balance);
  }

  function _updateNextAmount() private {
    nextAmount = richPerson.amount.mul(amountIncrease).div(100);
  }
}