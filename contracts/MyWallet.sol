pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyWallet is ERC20 {
    // set up totalSupply for creator
    constructor() ERC20("MyWallet", "MW") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    // call the internal _mint function to mint tokens
    function mint(address account, uint amount) public {
        _mint(account, amount);
    }
}