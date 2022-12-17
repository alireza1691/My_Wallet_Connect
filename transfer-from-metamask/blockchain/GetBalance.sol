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

contract GetBalance {



constructor() {

}

function GetUsdc(address tokenAddress,address user) external view returns(uint256){
    IERC20 token = IERC20(tokenAddress);
    return(token.balanceOf(user));
}



}