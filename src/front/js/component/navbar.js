import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const Navbar = () => {
	const { store, actions } = useContext(Context);
return (
		<nav className="navbar navbar-light">
			<div className="container">
					<span className="navbar-brand mb-0 h1 text-white" onClick={()=>actions.changeLoginButton(false)}>Authentication System</span>
				<div className="ml-auto">
					<Link to="/">
						<button className="btn btn-danger" hidden={store.hiddenLogout} onClick={()=>actions.logout()}><i className="fa-solid fa-right-from-bracket"></i></button>
					</Link>
				</div>
			</div>
		</nav>
	)
};
