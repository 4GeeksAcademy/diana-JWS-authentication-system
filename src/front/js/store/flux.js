
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			hiddenLogout: true,
			tokenUser: null,
			signup: false,
			isLoged: false,
			userLoged: {},

			name: null,
			last_name: null,
			email: null,
			password: null,
		},
		actions: {

			isPropertyEmpty: (obj) => {
				for (const key in obj) {
					if (obj[key] === "" || obj[key] == null || obj[key] === undefined) {
						return true;
					}
				}
				return false;
			},

			handleChange: e => {
				setStore({ [e.target.name]: e.target.value })
			},


			register: async () => {
				const store = getStore()
				const actions = getActions()
				try {
					let user = {}
					if (store.name != null && store.last_name != null && store.email != null && store.password != null) {
						user = {
							name: store.name,
							last_name: store.last_name,
							email: store.email,
							password: store.password,
						}
					}

					const response = await fetch(process.env.BACKEND_URL + "/register", {
						method: 'POST',
						body: JSON.stringify(user),
						headers: {
							'Content-Type': 'application/json'
						}
					})

					const result = await response.json()
					if (response.status == 400) {
						setStore({signup:false})
						alert(result.message)
						
					}

					if (response.status == 404) {
						setStore({ signup: false })
						alert("All fields are required")
						store.name = null,
						store.last_name = null
						store.email = null
						store.password = null
					}

					if (result.msg == "ok") {
						setStore({ signup: true })
						setStore({ hiddenLogin: true })
						alert("User added")
					}


				} catch (error) {
					console.error(error); // Registra el error para la depuración
					console.error("Error from backend: ", error.message);
					setStore({ signup: false });

				}
			},

			changeSignUpStatus: (value) => {
				setStore({ signup: value })
			},


			logInUser: async () => {
				const store = getStore()
				
				if (!store.email || !store.password) {
					alert("Por favor, complete todos los campos.");
					return false; 
				}

				try {
					const user = {
						email: store.email,
						password: store.password
					}
					

					const response = await fetch(process.env.BACKEND_URL + "/login", {
						method: 'POST',
						body: JSON.stringify(user),
						headers: {
							'Content-Type': 'application/json'
						}
					})
					const result = await response.json()
					

					if (response.ok) {
						localStorage.setItem("jwt-token", result.access_token);
						setStore({ isLoged: true })
						setStore({ hiddenLogout: true })
						return true
					} else {
						if (response.status === 401) {
							alert("Email o contraseña incorrectos. Por favor, inténtelo de nuevo.");
							setStore({ isLoged: false })
						} else if (response.status === 404) {
								alert(result.message);
								setStore({ isLoged: false })
							} else {
								alert("Hubo un error, intente de nuevo");
								setStore({ isLoged: false });
							}
						
					}

				} catch (error) {
					console.log(error + " Error from backend")
					setStore({ isLoged: false })
				}

			},

			changeLogInStatus: (value) => {
				setStore({ isLoged: value })
			},

			private: async () => {
				const myToken = localStorage.getItem("jwt-token");
				const store = getStore()
				setStore({ tokenUser: myToken })
				try {
					const response = await fetch(process.env.BACKEND_URL + "/private", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							'Authorization': 'Bearer ' + myToken
						}
					})
					const result = await response.json()
					console.log(result)
					setStore({ userLoged: result.user })
					setStore({ isLoged: true })

				} catch (error) {
					console.log(error + " Error from backend");
					setStore({ isLoged: false })
				}
			},

			changeLogoutButton: (value) => {
				setStore({ hiddenLogout: value })
			},

			logout: () => {
				setStore({ isLoged: false })
				setStore({ hiddenLogout: true })
				localStorage.clear();
			},
		}
	}
};


export default getState;
