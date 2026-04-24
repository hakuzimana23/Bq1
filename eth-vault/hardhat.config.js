require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    tenderly: {
      url: "https://virtual.sepolia.eu.rpc.tenderly.co/6057966d-a3ee-47d9-9873-c376ec9300dd",
      chainId: 99911155111,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk"
      }
    }
  }
};