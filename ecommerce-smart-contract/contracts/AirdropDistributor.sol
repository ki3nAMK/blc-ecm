// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AirdropDistributor is ReentrancyGuard {
    address public immutable adminAddress;

    // campaignId => merkle root of (recipient, amount) leaves
    mapping(uint256 => bytes32) public merkleRoots;

    // campaignId => remaining ETH available to claim
    mapping(uint256 => uint256) public campaignBalances;

    // campaignId => recipient => already claimed
    mapping(uint256 => mapping(address => bool)) public claimed;

    // --- Events
    event MerkleRootSet(uint256 indexed campaignId, bytes32 merkleRoot);
    event CampaignFunded(uint256 indexed campaignId, uint256 amount);
    event AirdropClaimed(
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount
    );

    // --- Modifiers
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin");
        _;
    }

    // --- Constructor
    constructor(address _adminAddress) {
        require(_adminAddress != address(0), "admin zero");
        adminAddress = _adminAddress;
    }

    /// @notice Admin publishes the merkle root for a campaign. One-shot: cannot be
    /// changed once set, so a root can never be altered after recipients start claiming.
    function setMerkleRoot(
        uint256 campaignId,
        bytes32 root
    ) external onlyAdmin {
        require(merkleRoots[campaignId] == bytes32(0), "Root already set");
        require(root != bytes32(0), "Root required");

        merkleRoots[campaignId] = root;
        emit MerkleRootSet(campaignId, root);
    }

    /// @notice Admin deposits ETH earmarked for a specific campaign.
    function fundCampaign(uint256 campaignId) external payable onlyAdmin {
        require(msg.value > 0, "No funds sent");

        campaignBalances[campaignId] += msg.value;
        emit CampaignFunded(campaignId, msg.value);
    }

    /// @notice Recipient claims their airdrop by proving membership in the merkle tree.
    function claim(
        uint256 campaignId,
        uint256 amount,
        bytes32[] calldata proof
    ) external nonReentrant {
        require(merkleRoots[campaignId] != bytes32(0), "Campaign not active");
        require(!claimed[campaignId][msg.sender], "Already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(
            MerkleProof.verify(proof, merkleRoots[campaignId], leaf),
            "Invalid proof"
        );
        require(
            campaignBalances[campaignId] >= amount,
            "Insufficient campaign funds"
        );

        // Effects before interaction
        claimed[campaignId][msg.sender] = true;
        campaignBalances[campaignId] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit AirdropClaimed(campaignId, msg.sender, amount);
    }

    // allow contract to receive ETH
    receive() external payable {}
}
