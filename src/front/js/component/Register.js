import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from '../store/appContext';


import "../../styles/home.css";

const Register = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate()

  store.signup ? navigate('/login') : null



  return (
    <div className="d-flex justify-content-center register__card">

    <form className="needs-validation m-5" noValidate
      onSubmit={e => {
        e.preventDefault()
        actions.register()
        e.target.reset();
      }}
    >
      <h1 className="text-center mt-2 ">SIGN UP</h1>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input name="name" type="text" className="form-control" id="exampleInputName" required onChange={actions.handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Apellido</label>
        <input name="last_name" type="text" className="form-control" id="exampleInputLastName" required onChange={actions.handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input name="email" type="email" className="form-control" id="exampleInputEmail1" required onChange={actions.handleChange} />
        <div id="emailHelp" className="form-text text-dark">Nunca compartiremos tu correo electrónico con nadie más.</div>
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input name="password" type="password" className="form-control" id="exampleInputPassword1" required onChange={actions.handleChange} />
      </div>

      <button type="submit" className="btn btn-login border btn__register" required >Submit</button>

      <Link to="/">
        <button className="btn btn-login border btn__register mx-3">Back home</button>
      </Link>
    </form>
    </div>
  );
}

export default Register;