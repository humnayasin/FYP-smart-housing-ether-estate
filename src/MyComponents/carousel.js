import React from 'react'
import Searchbar from "./Searchbar"
import Img1 from "../assets/img3.png"
import Img2 from "../assets/img2.jpg"
import Img3 from "../assets/img4.jpg"
export default function carousel() {
  return (
    <>
    <div id="carouselExampleCaptions" className="carousel slide">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner" style={{height:"400px"}}>
    <div className="carousel-item active">
      <img src={Img1} className="d-block w-100"style={{height:"400px", objectFit: 'cover'}}  alt="..."/>
      
    </div>
    <div className="carousel-item">
      <img src={Img2} className="d-block w-100" style={{height:"400px", objectFit: 'cover'}} alt="..."/>
      {/* <div className="carousel-caption d-none d-md-block">
        <h5>Second slide label</h5>
        <p>Some representative placeholder content for the second slide.</p>
      </div> */}
    </div>
    <div className="carousel-item">
      <img src={Img3} className="d-block w-100 " style={{height:"400px", objectFit: 'cover'}}  alt="..."/>
      
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>


</>
 )
 } 

