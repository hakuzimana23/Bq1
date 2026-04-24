const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("Step 1: Deploying VaultV1...");

  const VaultV1 = await ethers.getContractFactory("VaultV1");
  const vault = await upgrades.deployProxy(VaultV1, [1000], {
    initializer: "initialize",
    kind: "uups",
  });
  await vault.waitForDeployment();

  const proxyAddress = await vault.getAddress();
  console.log("✅ VaultV1 deployed to:", proxyAddress);

  // Check initial multiplier
  const v1Multiplier = await vault.rewardMultiplier();
  console.log("✅ V1 rewardMultiplier:", v1Multiplier.toString());

  // Check total deposited (should be 0)
  const totalBefore = await vault.totalDeposited();
  console.log("✅ Total ETH Locked before upgrade:", totalBefore.toString());

  console.log("\nStep 2: Upgrading to VaultV2...");

  const VaultV2 = await ethers.getContractFactory("VaultV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, VaultV2, {
    kind: "uups",
  });
  await upgraded.waitForDeployment();

  console.log("✅ Upgraded to VaultV2 at proxy:", proxyAddress);

  // Verify version
  const version = await upgraded.version();
  console.log("✅ Contract version:", version);

  // Verify state preserved
  const totalAfter = await upgraded.totalDeposited();
  console.log("✅ Total ETH Locked after upgrade:", totalAfter.toString());

  // Double the multiplier
  console.log("\nStep 3: Doubling rewardMultiplier...");
  const tx = await upgraded.upgradeMultiplier();
  await tx.wait();

  const newMultiplier = await upgraded.rewardMultiplier();
  console.log("✅ New rewardMultiplier:", newMultiplier.toString());
  console.log("\n🎉 Full upgrade flow complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });