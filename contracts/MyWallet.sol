pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyWallet is ERC20 {
    constructor() ERC20("MyWallet", "MW") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}