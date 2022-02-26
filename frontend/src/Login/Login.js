import './Login.css';

import React, { useState } from 'react';
import Web3 from 'web3';




let web3 = undefined; // Will hold the web3 instance

export const Login = ({ onLoggedIn })=> {
	const [loading, setLoading] = useState(false); // Loading button state

	const handleAuthenticate = ({
		publicAddress,
		signature,
	}) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
			body: JSON.stringify({ publicAddress, signature }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => response.json());

	const handleSignMessage = async ({
		publicAddress,
		nonce,
	})=> {
		try {
			const signature = await web3.eth.personal.sign(
				`I am signing my one-time nonce: ${nonce}`,
				publicAddress,
				'' // MetaMask will ignore the password argument here
			);

			return { publicAddress, signature };
		} catch (err) {
			throw new Error(
				'You need to sign the message to be able to log in.'
			);
		}
	};

	const handleSignup = (publicAddress) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
			body: JSON.stringify({ publicAddress }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => response.json());

	const handleClick = async () => {
		// Check if MetaMask is installed
		if (!window.ethereum) {
			window.alert('Please install MetaMask first.');
			return;
		}

		if (!web3) {
			try {
				// Request account access if needed
				await window.ethereum.enable();

				// We don't know window.web3 version, so we use our own instance of Web3
				// with the injected provider given by MetaMask
				web3 = new Web3(window.ethereum);
			} catch (error) {
				window.alert('You need to allow MetaMask.');
				return;
			}
		}

		const coinbase = await web3.eth.getCoinbase();
		if (!coinbase) {
			window.alert('Please activate MetaMask first.');
			return;
		}

		const publicAddress = coinbase.toLowerCase();
		setLoading(true);

		// Look if user with current publicAddress is already present on backend
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`
		)
			.then((response) => response.json())
			// If yes, retrieve it. If no, create it.
			.then((users) =>
				users.length ? users[0] : handleSignup(publicAddress)
			)
			// Popup MetaMask confirmation modal to sign message
			.then(handleSignMessage)
			// Send signature to backend on the /auth route
			.then(handleAuthenticate)
			// Pass accessToken back to parent component (to save it in localStorage)
			.then(onLoggedIn)
			.catch((err) => {
				console.log(err)
				// window.alert(err);
				setLoading(false);
			});
	};

	return (
		<div>
		
			{/* <button className="Login-button Login-mm" onClick={handleClick}>
				{loading ? 'Loading...' : 'Login with MetaMask'}
			</button> */}
			  <div>
   <div className=" flex justify-center content-center m-5 p-5 flex-col">
      <h1 className="text-xl font-extrabold ">Connect your Wallet</h1>
      <p className="text-muted">
        Connect with one of our available wallet providers or create a new one
      </p>
      <div className="w-6/12 m-auto  shadow-md rounded-xl flex flex-col divide-y justify-center content-center mt-5 ">
        <button className="flex justify-between p-4 hover:shadow-2xl " onClick={handleClick}>
          <div className="flex justify-center content-center gap-3">
            <div className="h-10 w-10">
              <img src="metamask.svg" alt="" />
            </div>{" "}
            <div className="m-auto justify-center"><p>MetaMaslk</p></div>
          </div>
          <div className="text-sm">Popular</div>
        </button>
      </div>
    </div>
    </div>
			{/* <button className="Login-button Login-fb" disabled>
				Login with Facebook
			</button>
			<button className="Login-button Login-email" disabled>
				Login with Email
			</button> */}
		</div>
	);
};