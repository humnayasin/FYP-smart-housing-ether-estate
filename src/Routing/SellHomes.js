import React, { useState } from 'react';
import { ethers } from "ethers";
import config from "../config.json";
import '../StyleSheets/form.css';
import imageHome from "../assets/Home.png"
import axios from 'axios';
import RealEstate from "../abis/RealEstate.json";
import Escrow from "../abis/Escrow.json";

function SellHomes({account, provider, refresh, handleRefresh, setRefresh, updateCID }) {  
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRealEstate, setRealEstate] = useState(false);
  const [isSubmit, setisSubmit] = useState('Submit');
  const [isSellerAccount, setisSellerAccount] = useState('Submit');






  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setisSubmit('.....');
    console.log("Submit button is clicked");
    setIsLoading(true);


    if(account){

    
    // Collect form data and create the property record object
    const propertyRecord = {
      name: event.target.name.value,
      description: event.target.description.value,
      mintedby: account,
   
      attributes: [
        {
          purchase_price: "Purchase Price",
          value: event.target.purchase_price.value
          
        },
        {
          address: "Address",
          value: event.target.address.value
        },
        {
          beds: "Bed Rooms",
          value: event.target.beds.value
        },
        {
          baths: "Bathrooms",
          value: event.target.baths.value
        },
        {
          square_feet: "Square Feet",
          value: event.target.square_feet.value
        },
        {
          year_built: "Year Built",
          value: event.target.year_built.value
        }
      ]
      
    };

    if (imageFile) {
      try {
        // Upload the image file to Pinata
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': 'fb133caa9c6d80215344', 
            'pinata_secret_api_key': '51a5929f5d0a65c5295551ce5fc3f3638d9fcce05c270ea746b46c298112ad7a' 
          }
        });

        const imageCID = response.data.IpfsHash;
        // const imageURL = `https://ipfs.io/ipfs/${imageCID.path}`;
        console.log("Image CID: " + imageCID);

       
        // Store the image URL in the property record object
        // const imageURL = `https://gateway.pinata.cloud/ipfs/${imageCID}`;
        const imageURL = `https://ipfs.io/ipfs/${imageCID}`;
        propertyRecord.image = imageURL;
      
        // Convert the property record object to JSON
        const propertyRecordJSON = JSON.stringify(propertyRecord);
        console.log("Property Record JSON: " + propertyRecordJSON);

         // Upload property record (JSON) to IPFS
         const propertyRecordUploadResponse = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", propertyRecord, {
          headers: {
           
            'pinata_api_key': 'fb133caa9c6d80215344', 
            'pinata_secret_api_key':  '51a5929f5d0a65c5295551ce5fc3f3638d9fcce05c270ea746b46c298112ad7a' 
          },
        });
    
        const ipfsUrl = `https://tan-innovative-chimpanzee-109.mypinata.cloud/ipfs/${propertyRecordUploadResponse.data.IpfsHash}`;
        console.log(ipfsUrl);
       
        const newCID = propertyRecordUploadResponse.data.IpfsHash;

       
        updateCID(newCID);

        const network = await provider.getNetwork();
        const signer = provider.getSigner();
        const realEstateAddress = config[network.chainId].realEstate.address;
        const realEstateContract = new ethers.Contract(realEstateAddress, RealEstate.abi, signer);


          setRealEstate(realEstateContract);
        
           // Mint the property using the mint function of the RealEstate contract
          let homeid = await realEstateContract.connect(signer).mint(ipfsUrl);
           await homeid.wait();
          
          const receipt = await homeid.wait();
         
          const tokenId = receipt.logs[0].topics[3];

            console.log("Token ID:", tokenId);
           console.log("HOmeid: "+homeid);

           console.log("this is the token id of the given property" + tokenId);
           const token = parseInt(tokenId, 16);
           console.log("this is the token id number of the given property" + token);


       

      
      
           
           
           console.log(realEstateContract.totalSupply());
   




        setIsLoading(false); // Stop loading
        setisSubmit('Submit');
        event.target.reset(); // Reset the form
        handleRefresh();
        
        
      } catch (error) {
        console.log("Error Occured", error);
      }
    } else {
      // Image file not selected  
      console.log("No image file selected");
    }


  }
  else{
    console.log("connect wallet");
  }


  };
 
 
 

  const handleFocus = () => {
    setIsNotEmpty(true);
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      setIsNotEmpty(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {

        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };



  return (
    <div id='container1'>
      <h1 className='heading1'>ADD AND SELL YOUR PROPERTY</h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-5 d-flex align-items-center">
            <h1 className='heading1'>INVEST AND ENJOY PROFIT</h1>
          </div>
          <div className="col-md-6 offset-md-1">
            <form  onSubmit={handleSubmit} className="mt-4 mt-md-0">
            <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-name">Property Name</label>
                <input
                  className="form-control"
                  type="text"
                  id="property-name"
                  name="name"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div className="form-group">
                <label id = "label"htmlFor="property-image">Property Image</label>
              </div>
                <div className="d-flex">
                  <input
                    className="form-control"
                    type="file"
                    id="property-image"
                    name="image"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                  />
                </div>
             
              <div className="form-group">
                <label>Preview:</label>
                <div className="image-preview" >
                  {imagePreview ? (
                    <img
                      id="image-preview"
                      src={imagePreview}
                      alt="Preview"
                     
                    />
                  ) : (
                    <img
                      id="default-image-preview"
                      src={imageHome}
                      alt="Default Preview"
                     
                    />
                  )}
                </div>
              </div>
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-description">Property Description</label>
                <textarea
                  className="form-control"
                  id="property-description"
                  name="description"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                ></textarea>
              </div>
             
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-address">Address</label>
                <input
                  className="form-control"
                  type="text"
                  id="property-address"
                  name="address"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-purchase-price">Purchase Price in ETH</label>
                <input
                  className="form-control"
                  type="number"
                  id="property-purchase-price"
                  name="purchase_price"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-beds">Bed Rooms</label>
                <input
                  className="form-control"
                  type="number"
                  id="property-beds"
                  name="beds"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-baths">Bathrooms</label>
                <input
                  className="form-control"
                  type="number"
                  id="property-baths"
                  name="baths"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-square-feet">Square Feet</label>
                <input
                  className="form-control"
                  type="number"
                  id="property-square-feet"
                  name="square_feet"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div className={`form-group ${isNotEmpty ? 'not-empty' : ''}`}>
                <label htmlFor="property-year-built">Year Built</label>
                <input
                  className="form-control"
                  type="number"
                  id="property-year-built"
                  name="year_built"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <button className="btn btn-primary" type="submit">
                {isSubmit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellHomes;
