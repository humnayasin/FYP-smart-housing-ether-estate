import React, { useState } from 'react';
import img1 from '../assets/img2.jpg';
import '../StyleSheets/predict.css';
const Predict = () => {
  // State variable to store the predicted price
  const [predictedPrice, setPredictedPrice] = useState(null);

  // Function to handle the prediction request
  const handlePrediction = () => {
 
    console.log("prediction run");
    // Gather the input data from the user
    const property_type = document.querySelector(
      'input[name="property-type"]:checked'
    )?.value;
    const location = document.getElementById('location').value;
    const city = document.getElementById('city').value;
    const baths = parseInt(document.getElementById('baths').value);
    const bedrooms = parseInt(document.getElementById('bedrooms').value);
    const area_Size = document.getElementById('area-size').value;
    const purpose= document.querySelector(
      'input[name="purpose"]:checked'
    )?.value;
 
  
    // Prepare the data to be sent to the backend
    const data = {
      attributes: {
        baths,
        bedrooms,
        "Area Size":area_Size,
        property_type,
        location,
        city,
        "purpose":purpose
      },
    };
  console.log(data);
  
    // Make a POST request to the backend for prediction
    fetch('http://localhost:5000/predict_house_price', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // Convert the predicted price to a number
  
      console.log(data)
      
    
      // Handle the predicted price received from the backend
      setPredictedPrice(data.knn_predicted_price);
    })
    .catch((error) => {
      console.error('Error:', error);
      


      setPredictedPrice("invalid");
    });
};
  
  return (
    <>
    <div className='body'>        
    <div className='signup-container'>
  <div className='left-container'>
    <h1>

      HOUSE PRICE PREDICTION....
    </h1>
    <div className='home'>
      <img id='image' src={img1}/>
    </div>
  </div>
  <div className='right-container'>
    <header>
      <h1>Yay, ENSURE YOU GET THE RIGHT PRICE PREDICTION</h1>



      <div className='set'>
      <div className='property-type'>
  <label htmlFor='property-type'>Property Type</label>
  <div className='radio-container'>
    <input id='property-type-flat' name='property-type' type='radio' value='Flat'/>
    <label htmlFor='property-type-flat'>Flat</label>  
    <input id='property-type-house' name='property-type' type='radio' value='House' />
    <label htmlFor='property-type-house'>House</label>
    <input id='property-type-upperPortion' name='property-type' type='radio' value='Upper Portion'/>
    <label htmlFor='property-type-upperPortion'>Upper Portion</label>
    <input id='property-type-lowerPortion' name='property-type' type='radio' value='Lower Portion'/>
    <label htmlFor='property-type-lowerPortion'>Lower Portion</label>
    <input id='property-type-penthouse' name='property-type' type='radio' value='Penthouse'/>
    <label htmlFor='property-type-penthouse'>Penthouse</label>
    <input id='property-type-room' name='property-type' type='radio' value='Room'/>
    <label htmlFor='property-type-room'>Room</label>
    <input id='property-type-farmhouse' name='property-type' type='radio' value='FarmHouse'/>
    <label htmlFor='property-type-farmhouse'>FarmHouse</label>
  </div>
</div>
        {/* <!-- New input for location --> */}




        
        <div className='location'>
          <label htmlFor='location'>Location</label>
          <input id='location' placeholder='Location' type='text'/>
        </div>



        
      </div>












      <div className='set'>
        {/* <!-- New input for city --> */}
         <div className='city'>
            <label htmlFor='city'>City</label>
            <select id='city' defaultValue=''>
              <option value='' disabled>Select a city</option>
              <option value='Faisalabad'>Faisalabad</option>
              <option value='Islamabad'>Islamabad</option>
              <option value='Karachi'>Karachi</option>
              <option value='Lahore'>Lahore</option>
              <option value='Rawalpindi'>Rawalpindi</option>
            </select>
          </div>





        {/* <!-- New input for baths --> */}
        <div className='baths'>
          <label htmlFor='baths'>Baths</label>
          <input id='baths' placeholder='Baths' type='number'/>
        </div>
      </div>
      <div className='set'>
        {/* <!-- New input for bedrooms --> */}
        <div className='bedrooms'>
          <label htmlFor='bedrooms'>Bedrooms</label>
          <input id='bedrooms' placeholder='Bedrooms' type='number'/>
        </div>
        {/* <!-- New input for Area Size --> */}
        <div className='area-size'>
          <label htmlFor='area-size'>Area Size</label>
          <input id='area-size' placeholder='Area Size' type='text'/>
        </div>
      </div>




              
      <div className='set'>
  <div className='property-type1'>
    <label htmlFor='property-type-rent'>Purpose</label>
    <div className='radio-container'>
      <div className='radio-option'>
        <input id='property-type-sale' name='purpose' type='radio' value='For Sale' checked />
        <label htmlFor='property-type-sale'>For Sale</label>
      </div>
      <div className='radio-option'>
        <input id='property-type-rent' name='purpose' type='radio' value='For Rent'/>
        <label htmlFor='property-type-rent'>For Rent</label>
      </div>
    </div>
  </div>
</div>







        {/* Add a button for prediction */}
        <div className='set'>
                <button id='predict-btn' onClick={handlePrediction}>
                  Predict Price
                </button>
              </div>
 
    </header>
    <footer>
      <div className='set'>
      {predictedPrice !== null && (
        <div  className='predictbox'>
          <h2>Predicted Price: RS {predictedPrice}</h2>
        </div>
      )}
      {predictedPrice == "invalid" && (
        <div  className='predictbox'>
          <h2>INVALID INPUT</h2>
        </div>
      )}

      </div>
    </footer>
  </div>
</div>

    
    
    
</div>

    


    </>
  )
}

export default Predict;
