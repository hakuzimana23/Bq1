// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VaultV1.sol";

contract VaultV2 is VaultV1 {

    event RewardMultiplierDoubled(uint256 oldValue, uint256 newValue);

    function upgradeMultiplier() external onlyOwner {
        uint256 oldMultiplier = rewardMultiplier;
        rewardMultiplier = rewardMultiplier * 2;
        emit RewardMultiplierDoubled(oldMultiplier, rewardMultiplier);
    }

    function version() external pure returns (string memory) {
        return "V2";
    }
}