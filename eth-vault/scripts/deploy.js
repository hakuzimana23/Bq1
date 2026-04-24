const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("Deploying VaultV1...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get contract factory
  const VaultV1 = await ethers.getContractFactory("VaultV1");

  // Deploy as UUPS proxy
  // rewardMultiplier = 1000 (starting value)
  const vault = await upgrades.deployProxy(VaultV1, [1000], {
    initializer: "initialize",
    kind: "uups",
  });

  await vault.waitForDeployment();

  const proxyAddress = await vault.getAddress();
  console.log("✅ VaultV1 (Proxy) deployed to:", proxyAddress);
  console.log("✅ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });