import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//abis
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";
//config file
import config from "./config.json";
//style Sheet
import "./App.css";
//Components

import BrowseHomes from "./Routing/BrowseHomes";
import SearchResults from "./MyComponents/SearchResults";
import Predict from "./MyComponents/Predict";
import SignIn from "./Routing/SignIN";
import Footer from "./MyComponents/footer";
import SellHome from "./Routing/SellHomes";
import SigninBox from "./MyComponents/signinBox.js";
import Searchbar from "./MyComponents/Searchbar.js";
import CardBox from "./MyComponents/Card.js";
import Navbar from "./MyComponents/navbar.js";
import Carousel from "./MyComponents/carousel.js";
//assets
import image from "./assets/img1.png";
import image2 from "./assets/img2.jpg";
import image3 from "./assets/img4.jpg";

Modal.setAppElement("#root");

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [EscrowConstract, setEscrowContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [homes, sethomes] = useState([]);
  const [Signer, setSigner] = useState([]);
  const [propertyCID, setPropertyCID] = useState();

  const [RealEstateContract, setRealEstateContract] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState(homes);
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    console.log("refresh handle run ");
    setRefresh(!refresh);
  };
  const updateCID = (newCID) => {
    setPropertyCID(newCID);
  };
  useEffect(() => {
  
    const loadBlockchainData = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        // MetaMask is available
        const ethereumProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        setProvider(ethereumProvider);

        const network = await ethereumProvider.getNetwork();

        // contracts js
        const realEstate = new ethers.Contract(
          config[network.chainId].realEstate.address,
          RealEstate.abi,
          ethereumProvider
        );
        setRealEstateContract(realEstate);
        const Supply = await realEstate.totalSupply();
        const totalSupply = Supply.toString();
        console.log("Total Supply:", totalSupply);

        if (ethereumProvider && ethereumProvider.getSigner) {
          // Get the signer
          const signer = ethereumProvider.getSigner();
          setSigner(signer);

          const escrow = new ethers.Contract(
            config[network.chainId].escrow.address,
            Escrow.abi,
            signer
          );
          setEscrowContract(escrow);
          const realEstate = new ethers.Contract(
            config[network.chainId].realEstate.address,
            RealEstate.abi,
            signer
          );
          setRealEstateContract(realEstate);
          console.log(escrow);
          console.log("this is signer" + Signer);
        } else {
          console.log("contract not loaded");
        }

        const homes = [];
        for (var i = 1; i <= totalSupply; i++) {
        const valid = await realEstate.isTokenValid(i);

           if(valid){
            const uri = await realEstate.tokenURI(i);
            const response = await fetch(uri);
            const metadata = await response.json();
            homes.push(metadata);
            metadata.homeid = i;
            metadata.sold = false;
          }
        }

        sethomes(homes);

        console.log(homes);

        // Handling account changes
        window.ethereum.on("accountsChanged", async (accounts) => {
          const updatedAccounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const updatedAccount = ethers.utils.getAddress(updatedAccounts[0]);
          setAccount(updatedAccount);
        });
      } else {
        // MetaMask is not available
        setAccount("not provided");
        setProvider("not provided");
        console.log("Need to install MetaMask");
        setErrorMessage(
          "Please install MetaMask browser extension to interact"
        );
        setIsModalOpen(true);
      }
    };

    loadBlockchainData();
  }, [refresh]);

 

      const handleSearch = async  (query)  => {
      console.log(query);
        if (query === '') {
          setFilteredHomes(homes); // Reset to all homes
        } else {
          // Filter homes based on the query
          console.log(query);
          const lowerQuery = query.toLowerCase();
          console.log(homes);
          const filteredHomes = homes.filter((home) => {
            if(homes==='')
            {
              console.log("niulll");
                return('');
            }
            else{
        
              console.log(home.attributes.find(attr => attr.address).value.toLowerCase());
              const location = home.attributes.find(attr => attr.address).value.toLowerCase();
              return location.includes(lowerQuery);

            }
          });
          setFilteredHomes(filteredHomes);
        } 
      };
    


    













  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Routes>
        <Route
          path="/browsehomes"
          element={
            <>
              <div>
                <Navbar account={account} setAccount={setAccount} />
              </div>
              <div>
                <BrowseHomes
                  account={account}
                  homes={homes}
                  escrow={EscrowConstract}
                  provider={provider}
                  propertyCID={propertyCID}
                  updateCID={updateCID}
                  sethomes={sethomes}
                  setRefresh={setRefresh}
                  handleRefresh={handleRefresh}
                />
              </div>
            </>
          }
        />

        <Route
          path="/predict"
          element={
            <>
              <div>
                <Navbar account={account} setAccount={setAccount} />
              </div>
              <div>
                <Predict />
              </div>
            </>
          }
        />
        <Route
        path="/SearchResults"
        element={
          <>
          <div>
          <div>
                <Navbar account={account} setAccount={setAccount} />
              </div>
            <Searchbar 
            placeholderText="Enter Location to Search" 
            handleSearch={(query) => handleSearch(query, setFilteredHomes)} 
         />
           
          </div>
          <div>
          <SearchResults homes={filteredHomes} 
             account={account}
             escrow={EscrowConstract}
             provider={provider}
             propertyCID={propertyCID}
             sethomes={sethomes}
             setRefresh={setRefresh}
             handleRefresh={handleRefresh}
          
          />
          </div>
          </>
        }
      />





        <Route
          path="/SignIn"
          element={


            <>
  
              <div>
                <Navbar account={account} setAccount={setAccount} />
              </div>
              <SignIn />
            </>
          }
        />
        <Route
          path="/SellHomes"
          element={
            <>
              <div>
                <Navbar
                  account={account}
                  setAccount={setAccount}
                  refresh={refresh}
                  handleRefresh={handleRefresh}
                 
                />
              </div>
              <SellHome
                account={account}
                provider={provider}
                handleRefresh={handleRefresh}
                setRefresh={setRefresh}
                propertyCID={propertyCID}
                updateCID={updateCID}
               
              />
            </>
          }
        />
        <Route
          path="/"
          element={
            <div>
              <Navbar account={account} setAccount={setAccount} />
              <div>
                <div>
                  <Searchbar placeholderText="Enter Location to Search  "  handleSearch={handleSearch} />
                </div>
                <Carousel />
              </div>
              <div className="cardbox container">
                <CardBox
                  title="SELL PROPERTY"
                  image={image}
                  info="sell your property now with great profit"
                  button="SELL  HOMES"
                  link="/SellHomes"
                  click="null"
                />
                <CardBox
                  title="BUY PROPERTY"
                  image={image2}
                  info="Buy property now in exciting prices"
                  button="BROWSE HOMES"
                  link="./BrowseHomes"
                  click=""
                />
                <CardBox
                  title="Price Prediction"
                  image={image3}
                  info="Do a predictive Analysis now"
                  button="CLICK NOW"
                  link="/predict"
                  click="null"
                />
              </div>
              <h1>WELCOME TO ETHER ESTATE </h1>

              <div className="container">
                <SigninBox />
              </div>
            </div>
          }
        />
      </Routes>

      {/* Modal for displaying the error message */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Error Modal"
      >
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <button id="close" onClick={closeModal}>
          Close
        </button>
      </Modal>

      <Footer />
    </>
  );
}

export default App;
