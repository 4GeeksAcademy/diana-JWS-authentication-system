import React from "react";
import { Link } from "react-router-dom";

import "../../styles/home.css";

export const Home = () => {

	return (
		<>
			<div className="d-flex justify-content-center general__card">

				<div className="card transparent__card">
					<div className="card-body">
						<h5 className="card-title mt-2 fs-1">Welcome to my amazing website :D</h5>
						<p className="card-text mt-4 fs-4">Do you already have an account with us? This is your chance!</p>
							<Link to="/register">
								<button className="btn__register mx-5">REGISTER</button>
							</Link>
						<p className="card-text fs-4">If you do, login here</p>
							<Link to="/login">
								<button className="btn__login mx-5">LOGIN</button>
							</Link>
					</div>
				</div>
			</div>
		</>
	);
};
