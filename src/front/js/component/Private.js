import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


import "../../styles/home.css";

const Private = () => {
    const { store, actions } = useContext(Context);
	const navigate = useNavigate()

	useEffect(()=>{
		actions.private()	
	},[])

	store.hiddenLogout ? actions.changeLogoutButton(false): null 

    
    if (store.isLoged) {
		return (
			<div className="container private mt-5 text-white login__background">
				<img src="https://media.tenor.com/UVQzMvsdIHkAAAAC/hola-chicos-dulce-princesa.gif" className="d-flex align-items-center"/>
				<h1 className="fw-bold fs-1 text-dark text-dark mt-2 d-flex justify-content-center"> Hola {store.userLoged.name}</h1>
			</div>
		);
	} else if (!store.isLoged) {
		return (
			<div className="container not-private mt-5">
                <span className="text-white mt-2">Something went wrong, try again</span>
				<img src="https://www.pngwing.com/es/free-png-znanx" className="d-flex align-items-center"></img>
			</div>
		)
	}
};

export default Private;