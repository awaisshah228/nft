import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Login } from './Login/Login';
import { Profile } from './Profile/Profile';
const LS_KEY = 'login-with-metamask:auth';
function App() {

  const [state, setState] = useState({});

	useEffect(() => {
		// Access token is stored in localstorage
		const ls = window.localStorage.getItem(LS_KEY);
		const auth = ls && JSON.parse(ls);
		setState({ auth });
	}, []);

	const handleLoggedIn = (auth) => {
		localStorage.setItem(LS_KEY, JSON.stringify(auth));
		setState({ auth });
	};

	const handleLoggedOut = () => {
		localStorage.removeItem(LS_KEY);
		setState({ auth: undefined });
	};

	const { auth } = state;
  return (
    <div className="">
  
    <div className="App-intro">
      {auth ? (
        <Profile auth={auth} onLoggedOut={handleLoggedOut} />
      ) : (
        <Login onLoggedIn={handleLoggedIn} />
      )}
    </div>
  </div>
  );
}

export default App;
