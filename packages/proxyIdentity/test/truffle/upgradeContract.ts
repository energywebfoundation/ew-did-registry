import fs from "fs";

const claimManagerContract = fs.readFileSync(
  "./contracts/IdentityManager.sol",
  "utf8",
);

// Creates a v0.2 of the IdentityManager contract so that it can be used as an input to the upgrade test
// (i.e. the test needs a contract to upgrade to)
const upgradedIdentityManagerContract = claimManagerContract
  .replace(`contract IdentityManager is `, `contract IdentityManagerUpgradeTest is `)
  .replace(`return "v0.1";`, `return "v0.2";`);

fs.writeFileSync(
  "./contracts/IdentityManagerUpgradeTest.sol",
  upgradedIdentityManagerContract,
);