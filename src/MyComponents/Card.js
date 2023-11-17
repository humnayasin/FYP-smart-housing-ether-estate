import React, { useState } from 'react';
import { ethers } from "ethers";
import { Link } from 'react-router-dom';
import Toggle from './ToggleComponent'
import Escrow from "../abis/Escrow.json";
//config file
import config from "../config.json";

function Card({ title, image, info, button, link, uniqueKey, home }) {


  return (
    <div  className="card" style={{ width: "18rem", margin: "1rem", height: "22rem" }}>
      <img src={image} className="card-img-top" alt="..." style={{ height: "15rem" }} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{info}</p>
        <button className="btn btn-warning">
          <Link to={link}>
            {button}
          </Link>
        </button>
      </div>

    </div>
  );
}

export default Card;
