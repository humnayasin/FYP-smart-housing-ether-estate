import React from 'react';
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import '../StyleSheets/signin.css';

import authenticationContract from '../abis/authentication.json'

const SignIN = () => {
  const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  const chainid = '3  '
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [Provider, setProvider] = useState(true);
  const [Signer, setSigner] = useState(true);






const handleSignUpSubmit = async(event)=>{
  event.preventDefault();
  const username= event.target.Username.value;
  const password= event.target.Password.value;
  const code =  event.target.digitCode.value;
  if (contract) {
    try {
      // Generate the user's login hash using the provided information
      const signature = await window.ethereum.request({ method: 'personal_sign', params: [username + account, account] });
      const signatureHash = ethers.utils.keccak256(signature);

      const passwordCodeHash = ethers.utils.keccak256(password + code);
      const finalHash = ethers.utils.keccak256(signatureHash + passwordCodeHash);

      // Register the user by calling the "register" function of the Smart Contract
      await contract.register(finalHash);
      console.log('User registered successfully!');
    } catch (error) {
      console.error('Error occurred during registration:', error);
    }
  }




  

}

const handleLoginSubmit = async(event)=>{
      event.preventDefault();
      const username= event.target.Username.value;
      const password= event.target.Password.value;
      const code =  event.target.digitCode.value;


      try{







      }catch(e){

        console.e("Error occur during authentication ");
      }
      }


  

      



























 

  const handleSignupClick = () => {
    setIsLogin(false);
  };

  const handleLoginClick = () => {
    setIsLogin(true);
  };
  
  const getMessageTransform = () => {
    if (isLogin) {
      return "translateX(0)";
    }
    return "translateX(100%)";
  };
  const getMessageClass = () => {
    if (isLogin) {
      return "message login";
    }
    return "message signup";
  };


  return (
    <div className="sign-in-container">
      <div className='Scontainer'>

    <div className={getMessageClass()} style={{ transform: getMessageTransform() }}>
      <div className="btn-wrapper">
        <button className="Sbutton" id="signup" onClick={handleSignupClick}>
          Sign Up
        </button>
        <button className="Sbutton" id="login" onClick={handleLoginClick}>
          Login
        </button>
      </div>
    </div>
    <div className="Sform form--signup">
      <div className="Sform--heading">Welcome! Sign Up</div>
      <form autoComplete="off"  onSubmit={handleSignUpSubmit}>
        <input name='Username' type="text" placeholder="User Name" />
        <input name='Password' type="password" placeholder="Password" />
        <input name='digitCode' type="email" placeholder="6-Digit-Code" />
        <button className="Sbutton">Sign Up</button>
      </form>
    </div>
    <div className="Sform form--login">
      <div className="Sform--heading">Welcome back!</div>
      <form autoComplete="off" onSubmit={handleLoginSubmit}>
        <input name='Username' type="text" placeholder="Username" />
        <input name='Password' type="password" placeholder="Password" />
        <input name='digitCode' type="password" placeholder="6 digit code" />
        <button className="Sbutton">Login</button>
      </form>
    </div>
  </div>
      </div>
    )
  

  }
export default SignIN