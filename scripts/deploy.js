const hre = require("hardhat");


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // const Authentication = await hre.ethers.getContractFactory("Authentication");
  // const authentication = await Authentication.deploy();

  // await authentication.deployed();

  // console.log("Authentication deployed to:", authentication.address);









  // Setup accounts
  const [buyer, seller, inspector, lender] = await ethers.getSigners()
  // console.log("buyer address"+buyer+"inspector address = " + inspector);

   //Deploy Real Estate
  const RealEstate = await ethers.getContractFactory('RealEstate')
   const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

    console.log(`Deployed Real Estate Contract at: ${realEstate.address}`)





  // console.log(`Minting 1 properties...\n`)


  //   let transaction  = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/1.json`)   
  //   await transaction.wait()
    

    
  //   //Deploy Escrow contract 
  //   const Escrow = await ethers.getContractFactory('Escrow')

  //   const escrow = await Escrow.deploy(
  //     realEstate.address,seller.address, inspector.address, lender.address
  //       )
  //       await escrow.deployed()
  //       console.log(`Deployed Escrow Contract at: ${escrow.address}`)
  //       console.log(`Listing  properties...\n`)
  //        //APPROVE PROPERTY 
  //         transaction = await realEstate.connect(seller).approve(escrow.address, 1)
  //         await transaction.wait();

  //           // listing properties

  //           transaction =await escrow.connect(seller).list(1, buyer.address, tokens(20) , tokens(10))
  //           await transaction.wait();


}
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });