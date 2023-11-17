import React from 'react';
import  {useState} from "react";
import '../StyleSheets/Toggle.css';
import ToggleComponent from '../MyComponents/ToggleComponent';
import Cards from '../MyComponents/Card'
import { Link } from 'react-router-dom';

function BrowseHomes({ homes, escrow, provider, account, propertyCID, updateCID, sethomes, setRefresh, handleRefresh}) {
  const [toggle, setToggle] = useState(false);
  const [House, setHouse] = useState([]);
  const [updatehome, setupdatehome] = useState([]);
  const[Sold, setSold]= useState([]);



  console.log(homes);
  const reload =()=>{
    console.log("reload run ");
    handleRefresh();
    console.log(homes);






  }


  const toggleProp = (home) => {
    console.log("propertycid" , propertyCID);
    
    if(toggle){


  
    setToggle(false);

    }
  
  else {
    if(home.sold==false){
      setToggle(true);
      setHouse(home);}
    }
 
   
    console.log(home);

  }

  return (
    <>
      <h1 style={{ color: 'black' }}>HOME FOR YOU</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {homes.map((home, index) => (
        <div  key={index} style={{ flex: '0 0 18rem', margin: '1rem' }}>
           
              <div  className="card" style={{ width: "18rem", margin: "1rem", height: "25rem" }}>
              <img  onClick={() => toggleProp(home)} src={home.image} className="card-img-top" alt="..." style={{ height: "15rem" }} />
              <div className="card-body">
                <h5 className="card-title">{home.name}</h5>
                <p className="card-text">{home.description}</p>
               { !home.sold==true?(
                  <button   onClick={() => toggleProp(home)} className="btn btn-warning">

                    BUY
                  
                </button>):
                <h1>SOLD</h1>
                }
                
               
              </div>
        
            </div>


              
            
          {toggle && 
            <ToggleComponent toggleProps={toggleProp} account={account} escrow={escrow} provider={provider} home={House}   propertyCID={propertyCID} updateCID={updateCID}  sethomes={sethomes} setRefresh={setRefresh} reload = {reload}
           setSold={setSold}  handleRefresh={handleRefresh}/>}
          </div>
        ))}
      </div>
    </>
  );
}

export default BrowseHomes;
