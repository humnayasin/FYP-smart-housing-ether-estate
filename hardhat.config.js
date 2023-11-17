require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337, // Replace with your desired chainId
      ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      allowUnlimitedContractSize: true,
      
    },
  },
};
