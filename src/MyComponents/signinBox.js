import React from 'react'
import image1 from '../assets/images1.jpeg'
import image2 from '../assets/images2.jpeg'
import "../StyleSheets/signinBox.css"
import {Link} from 'react-router-dom'
export default function signinBox() {
  return (
    <div className='box1'>
   
      <div className='box2'>
        <h5 className='subheading'>
        "Unlocking a world of property possibilities on the Ethereum blockchain - where real estate meets digital innovation, creating a seamless future for ownership."           
        </h5>
      {/* <button type="button"  className="btn btn-outline-warning button"> */}
      {/* <Link to={'/SignIn'}> SIGN IN </Link> */}
      {/* </button> */}
      </div>
        
              
    <img src={image1} className="rounded float-start images" alt="..."/>
    <img src={image2} className="rounded float-end images" alt="..."/>
     

    </div>
  
   
   
  )
}
