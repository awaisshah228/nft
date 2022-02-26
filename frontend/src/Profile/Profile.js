import "./Profile.css";

import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import Blockies from "react-blockies";

export const Profile = ({ auth, onLoggedOut }) => {
  const [state, setState] = useState({
    loading: false,
    user: undefined,
    username: "",
  });

  useEffect(() => {
    const { accessToken } = auth;
    // console.log(accessToken)
    const decoded = jwtDecode(accessToken);
    // console.log(decoded)
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${decoded.payload.id}`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((user) => setState({ ...state, user }))
      .catch(window.alert);
  }, []);

  const handleChange = ({ target: { value } }) => {
    setState({ ...state, username: value });
  };

  const handleSubmit = () => {
    const { accessToken } = auth;
    const { user, username } = state;
    // console.log(accessToken)
    const decoded = jwtDecode(accessToken);
    // console.log(decoded)

    setState({ ...state, loading: true });

    if (!user) {
      window.alert(
        "The user id has not been fetched yet. Please try again in 5 seconds."
      );
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${decoded.payload.id}`, {
      body: JSON.stringify({ username }),
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((user) => {
        setState({ ...state, loading: false, user });
        console.log(user);
      })
      .catch((err) => {
        window.alert(err);
        setState({ ...state, loading: false });
      });
  };

  const { accessToken } = auth;

  const {
    payload: { publicAddress },
  } = jwtDecode(accessToken);

  const { loading, user } = state;

  const username = user && user.name;

  return (
    <div className="">
      <div className="w-full hover:bg-slate-400 cover bg-slate-200   flex justify-center content-center">
        <div className="m-auto ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 stroke-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
      </div>
	  <div className="flex justify-center -mt-10 ">
	  <img className="inline object-cover w-28 h-28 mr-2 rounded-full bg-teal-700" src="https://images.pexels.com/photos/2589653/pexels-photo-2589653.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Profile image"/>
	  
	   

	  </div>
	  <div className="flex justify-center mt-5 gap-32"> <h1>
         <p className="font-bold text-center mb-5  mx-auto mt-3">{username ? username : "Unnamed"}</p>
         <p className=" w-32 justify-self-center text-center px-6 py-2 border-2 mt-3 border-gray-200 text-gray-400 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out m-auto"> {user ? `${user.publicAddress.slice(0,6)}...${user.publicAddress.slice(-4)}` : "Hi"}</p>
         <p className="font-bold text-center mt-3">Joined on {user ? user.joined : "Hi"}</p>
      </h1></div>
      {/* <p>
        Logged in as <Blockies seed={publicAddress} />
      </p> */}
      {/* <div>
        My username is {username ? <pre>{username}</pre> : "not set."} My
        publicAddress is <pre>{publicAddress}</pre>
      </div> */}
	  <div class="my-4 p-auto flex content-center justify-center items-center  ">
      <label class=" mr-4 text-gray-700 text-sm font-bold  " htmlFor="username">
        Change Username
      </label>
      <input class="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" name='username' onChange={handleChange}/>
	  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-8" disabled={loading} onClick={handleSubmit}>
  Submit
</button>
    </div>

	<div className="flex">
	<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full m-auto" disabled={loading} onClick={onLoggedOut}>
  Logout
</button>
	</div>
	
	{/* <button disabled={loading} onClick={handleSubmit} className='flex justify-center'>
          Submit
        </button>

      <div>
        <label htmlFor="username">Change username: </label>
        <input name="username" onChange={handleChange} />
       
      </div>
      <p>
        <button onClick={onLoggedOut}>Logout</button>
      </p> */}
    </div>
  );
};
