import React, { useState } from 'react';
import "../StyleSheets/searchResults.css"
import ToggleComponent from './ToggleComponent'; // Import the ToggleComponent or whatever component you are using

function SearchResults({ homes, account, escrow, provider, propertyCID, sethomes, setRefresh, handleRefresh }) {
  console.log(homes, account, escrow, provider, propertyCID, sethomes, setRefresh, handleRefresh)
  const [toggle, setToggle] = useState(false);
  const [House, setHouse] = useState([]);
  const [updatehome, setupdatehome] = useState([]);
  const [Sold, setSold] = useState([]);

  const reload = () => {
    console.log("reload run ");
    handleRefresh();
    console.log(homes);
  }

  const toggleProp = (home) => {
    console.log("propertycid", propertyCID);

    if (toggle) {
      setToggle(false);
    } else {
      if (!home.sold) {
        setToggle(true);
        setHouse(home);
      }
    }
    console.log(home);
  }

  return (
    <>
      <div className='headingD'>
        <h2>Search Results for the properties</h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop:'4rem' }}>
        {homes.length === 0 ? (
          <h2 className="heading1">No search results found</h2>
        ) : (
          homes.map((home, index) => (
            <div key={index} style={{ flex: '0 0 18rem', margin: '1rem', marginTop: '4rem' }}>
              <div className="card" style={{ width: "18rem", margin: "1rem", height: "25rem" }}>
                <img src={home.image} className="card-img-top" alt="..." style={{ height: "15rem" }} />
                <div className="card-body">
                  <h5 className="card-title">{home.name}</h5>
                  <p className="card-text">{home.description}</p>
                  {!home.sold ? (
                    <button onClick={() => toggleProp(home)} className="btn btn-warning">
                      BUY
                    </button>
                  ) : (
                    <h1>SOLD</h1>
                  )}
                </div>
              </div>
              {toggle && (
                <ToggleComponent
                  toggleProps={toggleProp}
                  account={account}
                  escrow={escrow}
                  provider={provider}
                  home={House}
                  propertyCID={propertyCID}
                  updateCID={updatehome} // You might need to replace 'updateCID' with 'updatehome' or whatever is appropriate
                  sethomes={sethomes}
                  setRefresh={setRefresh}
                  reload={reload}
                  setSold={setSold}
                  handleRefresh={handleRefresh}
                />
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default SearchResults;
