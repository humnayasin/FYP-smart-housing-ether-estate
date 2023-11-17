import React from 'react';
import logo from "../assets/logo3.gif";
import '../StyleSheets/navbar.css';
import { NavLink } from 'react-router-dom';
import { useState } from "react";

export default function Navbar({ account, setAccount, openModal }) {

  const handleConnectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
  
        if (accounts.length > 0) {
          setAccount(accounts[0]);
       
        } else {
          // Handle the case where the user canceled the connection
          console.log("User canceled wallet connection");
        }
      } catch (error) {
        // Handle any errors that occur during wallet connection
        console.error("Error connecting wallet:", error);
       
      }
    } 
  };

 

  return (
    <>
      <nav className="navbar bg-purple">
        <div className="container navbar-dark bg-dark navbar-expand-lg">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav">
               {/* <a className="nav-link active mr" aria-current="page" href="#">
                Home
              </a>  */}
              <NavLink to="/" activeclassname="active" className="nav-link mr" >
                   Home
              </NavLink> 
              <NavLink to="/BrowseHomes"  className="nav-link mr" >
              BUY
              </NavLink>
              <NavLink to="/SellHomes"  className="nav-link mr" >
             SELL
              </NavLink>
              <NavLink to="/"  className="nav-link mr" >
              ABOUT
              </NavLink>
    
            </div>
          </div>
          <a className="navbar-brand d-flex  mx-auto" href="#">
            <img src={logo} alt="Bootstrap" className="logo" />
          </a>
          <div className="ml-auto">
            {account ? (
              account === "not provided" ? (
                <button
                  className="btn btn-outline-purple my-2 my-sm-0"
                  type="submit"
                
                >
                   Not Connected To Wallet 
                </button>
              ) : (
                <button className="btn btn-outline-purple my-2 my-sm-0" type="submit">
                  {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
              )
            ) : (
              <button
                className="btn btn-outline-purple my-2 my-sm-0"
                type="submit"
                onClick={handleConnectWallet}
              >
                CONNECT TO WALLET
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
