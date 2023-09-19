import React, { useEffect, useContext } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { Context } from '../store/appContext';

import "../../styles/home.css";

const Login = () => {
  
  const navigate = useNavigate()
	const { store, actions } = useContext(Context);
//	store.isloged ? navigate('/private'):null
	store.signup ? actions.changeSignUpStatus(false):null
	!store.hiddenLogout ? actions.changeLogoutButton(true): null 

  const handleLogin = () => {
//    e.preventDefault()
    let response = actions.logInUser()
    if (response){
      navigate('/private')
    }
  }


  return (

    <form className="needs-validation text-center login__background" noValidate>
      <div>
        <h1> LOGIN </h1>
        <label htmlFor="exampleInputEmail1" className="form-label p-2">Email address</label>
        <input name="email" type="email" className="form-control inputs" id="exampleInputEmail1" aria-describedby="emailHelp" required onChange={actions.handleChange} />
        <div id="emailHelp" className="form-text text-dark little_letters">We'll never share your email with anyone else.</div>
      </div>
      <div className="mb-3 mt-3">
        <label  htmlFor="exampleInputPassword1" className="form-label p-2">Password</label>
        <input  name="password" type="password" className="form-control inputs" id="exampleInputPassword1" required onChange={actions.handleChange} />
      </div>
      
      <span className="btn btn-dark mx-5" type="button" onClick={()=>handleLogin()}>Log in</span>

      <div className="text-center mt-2 mb-4">
				<label className="">I don't have an account</label>
				<Link to="/register">
					<button className="btn text-secondary" onClick={() => actions.changeLoginButton(false)}>Sign Up</button>
				</Link>
			</div>

      <Link to="/">
        <button className="btn btn-dark mx-5">Back home</button>
      </Link>
    </form>
  )
};

export default Login;