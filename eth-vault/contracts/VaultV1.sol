// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract VaultV1 is 
    Initializable, 
    UUPSUpgradeable, 
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable 
{
    uint256 public rewardMultiplier;
    uint256 public totalDeposited;
    
    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositTimestamp;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 _rewardMultiplier) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        rewardMultiplier = _rewardMultiplier;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        balances[msg.sender] += msg.value;
        depositTimestamp[msg.sender] = block.timestamp;
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() external nonReentrant {
        uint256 userBalance = balances[msg.sender];
        require(userBalance > 0, "No balance to withdraw");

        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = userBalance + reward;

        balances[msg.sender] = 0;
        depositTimestamp[msg.sender] = 0;
        totalDeposited -= userBalance;

        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, userBalance, reward);
    }

    function calculateReward(address user) public view returns (uint256) {
        if (balances[user] == 0) return 0;
        uint256 timeElapsed = block.timestamp - depositTimestamp[user];
        uint256 reward = (balances[user] * rewardMultiplier * timeElapsed) / 1e18;
        return reward;
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function getTotalDeposited() external view returns (uint256) {
        return totalDeposited;
    }

    function updateRewardMultiplier(uint256 _newMultiplier) external onlyOwner {
        rewardMultiplier = _newMultiplier;
    }

    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyOwner 
    {}

    receive() external payable {}
}