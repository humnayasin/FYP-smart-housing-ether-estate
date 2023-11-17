import { ethers } from "ethers";
import config from "../config.json";
import { useEffect, useState } from "react";
import Escrow from "../abis/Escrow.json";
import RealEstate from "../abis/RealEstate.json";
import close from "../assets/close.jpg";
import axios from "axios";
const cors = require("cors");
const ToggleComponent = ({
  toggleProps,
  home,
  provider,
  account,
  propertyCID,
  updateCID,
  setSold,
  sethomes,
  setRefresh,
  handleRefresh,
 reload
}) => {
  console.log(propertyCID);

  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
  };

  const [buyer, setBuyer] = useState(null);
  const [lender, setLender] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [seller, setSeller] = useState(null);
  const [owner, setOwner] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const [hasLended, setHasLended] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);

  const [homeID, sethomeID] = useState(home.homeid);
  const [buyerAddress, setbuyerAddress] = useState("");

  const [start, setstart] = useState(true);
  const [requestAddress, setrequestAddress] = useState("");
  const [contract1, setcontract1] = useState("");
  const [Econtract, setEcontract] = useState("");

  const [hasRequested, sethasRequested] = useState(false);
  const [hasdeployed, sethasdeployed] = useState(false);
  const [flag, setflag] = useState(false);
  const [flag1, setflag1] = useState(true);
  const [hasSold, setHasSold] = useState(false);

  const undoRequestHandler = async () => {
    sethasRequested(false);
    setstart(true);

    try{
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const realEstate = new ethers.Contract(
        config[network.chainId].realEstate.address,
        RealEstate.abi,
        signer
      );
  
      await realEstate.removePropertyFromSale(homeID);
     

     


    }catch(error){
      console.error("unable to cancel the request" , error)
    }




  };

  const deleteHandler = async () => {
    try {
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const realEstate = new ethers.Contract(
        config[network.chainId].realEstate.address,
        RealEstate.abi,
        signer
      );

      await realEstate.unmintProperty(homeID);



      sethomes(prevhomes => prevhomes.filter(home => home.homeid !== homeID));
    
      
    
      handleRefresh();
      // Remove the property from the homes array based on its tokenId
      // sethomes((prevHomes) => prevHomes.filter((home) => home.tokenId == homeID));
      console.log(propertyCID);

      try{

        sethomes(prevhomes => prevhomes.filter(home => home.homeid !== homeID));
        handleRefresh();
        reload();

        toggleProps();
      

      
      const url = `https://api.pinata.cloud/pinning/unpin/${propertyCID}`;
      
      const headers = {
        "Content-Type": "application/json",
        pinata_api_key: "fb133caa9c6d80215344",
        pinata_secret_api_key:
        "51a5929f5d0a65c5295551ce5fc3f3638d9fcce05c270ea746b46c298112ad7a",
      };
    
      const response = await axios.delete(url, { headers });
      
      console.log("File deleted from IPFS successfully:", response.data);
        
         
          
          reload();
        }  
        catch(error){
          handleRefresh();
            reload();
         }
         


      
      
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const checkRequest = async () => {
    try{

      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const realEstate = new ethers.Contract(
        config[network.chainId].realEstate.address,
        RealEstate.abi,
        provider
      );
      const isrequest = await realEstate.hasRequested(homeID);
  
      if (isrequest) {
        const buyer = await realEstate.getRequestAddress(homeID);
        sethasRequested(true);
        setstart(false);
        setbuyerAddress(buyer);

      }
    }catch(error){
      console.error(error);
      sethasRequested(false);
    }
  };
  checkRequest();

  const deployContract = async (buyerAccount) => {
    try{
      
      
      console.log("deploy script run" + "homeid id " + homeID);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      // const escrow = await new ethers.Contract(config[network.chainId].escrow.address, Escrow.abi, signer);
      // setescrow(escrow);
      const realEstate = new ethers.Contract(
        config[network.chainId].realEstate.address,
        RealEstate.abi,
        provider
      );
  
      const lenderaddress = "0x71bE63f3384f5fb98995898A86B02Fb2426c5788";
      const Raddress = realEstate.address;
      const inspectoraddress = "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a";
      const seller = home.mintedby;
      const factory1 = new ethers.ContractFactory(
        Escrow.abi,
        Escrow.bytecode,
        signer
      );
      const contract1 = await factory1.deploy(
        Raddress,
        seller,
        inspectoraddress,
        lenderaddress
      );
      await contract1.deployed();
  
      setcontract1(contract1);
      let transaction = await realEstate
        .connect(signer)
        .approve(contract1.address, homeID);
      await transaction.wait();
  
      console.log("so here is the buyer account" + buyerAddress);
      let number = parseFloat(home.attributes[0].value / 2);
      let number1 = parseFloat(home.attributes[0].value);
      console.log("hellow" + number + "   " + number1 + parseInt(home.id));
      transaction = await contract1
        .connect(signer)
        .list(homeID, buyerAddress, tokens(number1), tokens(number));
      await transaction.wait();
      setflag(true);
      setflag1(false);
    }catch(error){
      console.log(error)
   
    }
  };

  const deployHandler = async () => {
    try{
      
      await deployContract(requestAddress);
      sethasdeployed(true);

    }catch(error){
      console.log(error)
    }


  };

  const RequestHandler = async (address) => {
    try{
      setrequestAddress(account);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const realEstate = new ethers.Contract(
        config[network.chainId].realEstate.address,
        RealEstate.abi,
        provider
      );
      console.log(realEstate.address);
      // Check if the token exists
      const isTokenValid = await realEstate.isTokenValid(homeID);
      console.log(isTokenValid);
      if (isTokenValid) {
        // Perform your request logic here, such as calling the request function in the RealEstate contract
        await realEstate
          .connect(signer)
          .makeRequest(homeID, { gasLimit: 300000 });
  
        // Update the hasRequested state to true
        sethasRequested(true);

      } else {
        console.log("Invalid token");
      }
      

    }catch(error){
      console.log(error)
    }
  };

  const fetchDetails = async () => {
    console.log("fetch details run");
    if (flag) {
      console.log(homeID);

      const buyer = await contract1.buyer(homeID);
      setBuyer(buyer);
      console.log(buyer);

      const hasBought = await contract1.approval(homeID, buyer);
      setHasBought(hasBought);

      // // -- Seller

      const seller = await contract1.seller();
      setSeller(seller);

      const hasSold = await contract1.approval(homeID, seller);
      setHasSold(hasSold);

      // // -- Lender

      const lender = await contract1.lender();
      setLender(lender);

      const hasLended = await contract1.approval(homeID, lender);
      setHasLended(hasLended);

      // // -- Inspector

      const inspector = await contract1.inspector();
      setInspector(inspector);

      const hasInspected = await contract1.inspectionPassed(homeID);
      setHasInspected(hasInspected);
      console.log(
        " all data is fetched " + lender + buyer + seller + inspector
      );
    }
  };

  const fetchOwner = async () => {
    if (flag) {
      if (await contract1.isListed(homeID)) return;
      console.log("owner is set");
      console.log("owner has been changed ");
      const owner = await contract1.buyer(homeID);
      setOwner(owner);
      home.sold = true;

    }
  };

  useEffect(() => {
    fetchDetails();

    fetchOwner();
  }, [hasdeployed, hasSold]);

  const buyHandler = async () => {
    const escrowAmount = await contract1.escrowAmount(homeID);
    const signer = await provider.getSigner();

    // Buyer deposit earnest
    let transaction = await contract1
      .connect(signer)
      .depositEarnest(homeID, { value: escrowAmount });
    await transaction.wait();

    // Buyer approves...
    transaction = await contract1.connect(signer).approveSale(homeID);
    await transaction.wait();

    setHasBought(true);
  };

  const inspectHandler = async () => {
    const signer = await provider.getSigner();

    // Inspector updates status
    const transaction = await contract1
      .connect(signer)
      .updateInspectionStatus(homeID, true);
    await transaction.wait();

    setHasInspected(true);
  };

  const lendHandler = async () => {
    const signer = await provider.getSigner();

    // Lender approves...
    const transaction = await contract1.connect(signer).approveSale(homeID);
    await transaction.wait();

    // Lender sends funds to contract...
    const lendAmount =
      (await contract1.purchasePrice(homeID)) -
      (await contract1.escrowAmount(homeID));
    await signer.sendTransaction({
      to: contract1.address,
      value: lendAmount.toString(),
      gasLimit: 60000,
    });

    setHasLended(true);
  };

  const sellHandler = async () => {
    const signer = await provider.getSigner();

    // Seller approves...
    let transaction = await contract1.connect(signer).approveSale(homeID);
    await transaction.wait();

    // Seller finalize...
    transaction = await contract1.connect(signer).finalizeSale(homeID);
    await transaction.wait();

    setHasSold(true);
  };

  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={home.image} alt="Home" />
        </div>
        <div className="home__overview">
          <h1>{home.name}</h1>
          <p>
            <strong>{home.attributes[2].value}</strong> bds |
            <strong>{home.attributes[3].value}</strong> ba |
            <strong>{home.attributes[4].value}</strong> sqft
          </p>
          <p>{home.address || home.attributes[1].value}</p>

          <h2>
            {home.attributes[0].value || Object.keys(home.attributes)[0]} ETH
          </h2>

          {(Econtract && Econtract.buyer(homeID)) ||
          (owner && !flag1 && hasRequested) ? (
            <div className="home__owned">
              Owned by {owner.slice(0, 6) + "..." + owner.slice(38, 42)}
            </div>
          ) : !hasRequested  ? (
            account.toLowerCase() !== home.mintedby.toLowerCase() ? (
              <button
                className="btn home__buy"
                onClick={() => RequestHandler(account)}
                disabled={hasRequested}
              >
                Send Request
              </button>
            ) : (
              <div>
                <hr />
                <h3 style={{ color: "red" }}>You minted this property</h3>
              </div>
            )
          ) : start === false &&
            flag1 == true  &&
            account.toLowerCase() === home.mintedby.toLowerCase() ? (
            <button
              className="btn home__buy"
              onClick={deployHandler}
              disabled={hasdeployed}
            >
              Deploy Contracts
            </button>
          ) : (
            <div>
              {account === inspector ? (
                <button
                  className="btn home__buy"
                  onClick={inspectHandler}
                  disabled={hasInspected}
                >
                  Approve Inspection
                </button>
              ) : account === lender ? (
                <button
                  className="btn home__buy"
                  onClick={lendHandler}
                  disabled={hasLended}
                >
                  Approve & Lend
                </button>
              ) : account === seller &&
                hasBought &&
                hasInspected &&
                hasLended ? (
                <button
                  className="btn home__buy"
                  onClick={sellHandler}
                  disabled={hasSold}
                >
                  Approve & Sell
                </button>
              ) : flag && account === buyer ? (
                <button
                  className="btn home__buy"
                  onClick={buyHandler}
                  disabled={hasBought}
                >
                  Buy
                </button>
              ) : (
                <div>
                  <h4 style={{ color: "red" }}>
                    Wait!!! Process not completed yet
                  </h4>
                </div>
              )}
            </div>
          )}

          {account.toLowerCase() === home.mintedby.toLowerCase() && !hasRequested&& (
            <button className="btn home__buy" onClick={deleteHandler}>
              Delete
            </button>
          )}
      

          {hasRequested && (requestAddress.toLowerCase() === account.toLowerCase() )&&(!hasBought)&& (!hasdeployed)&&
            (
              <button className="btn home__buy" onClick={undoRequestHandler}>
                Cancel Request
              </button>
            )}

          <hr />

          <h2>Overview</h2>

          <p>{home.description}</p>

          <hr />

          <h2>Facts and features</h2>

          <ul>
            {home.attributes.map((attribute, index) => (
              <li key={index}>
                <strong>
                  {attribute.trait_type || Object.keys(attribute)[0]}
                </strong>{" "}
                : {attribute.value}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={toggleProps} className="home__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};
export default ToggleComponent;
