// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC1155 is ERC1155, Ownable {
    uint256 public currentTokenId;

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner {
        _mint(to, id, amount, data);
    }

    function mintAuto(
        address to,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner returns (uint256) {
        currentTokenId += 1;
        uint256 newTokenId = currentTokenId;

        _mint(to, newTokenId, amount, data);

        return newTokenId; 
    }
}
