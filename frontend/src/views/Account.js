/* eslint-disable */
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import LoginInfo from '../App/LoginInfo';
import Popup from '@enact/sandstone/Popup'
import { globalCanvasContext } from '../App/Context';

const Account = () => {

	const [state, setState] = useState({
		login_info: null,
		name: '',
		passwd: ''
	});

	const [namePopup, namePopupOpen] = useState(false);
	const [existPopup, existPopupOpen] = useState(false);
	const [notExistPopup, notExistPopupOpen] = useState(false);
	const [passPopup, passPopupOpen] = useState(false);
	const {canvas, setCanvas} = useContext(globalCanvasContext);

	// Add User.
	const handleAddUser = () => {
		if (state.name == '' || state.passwd == '') {
			namePopupOpen(true);
			return;
		}
		axios
			.post('/api/users', {name: state.name, passwd: state.passwd})
			.then(response => {
				setState(prevState => ({
					...prevState,
					name: '',
					passwd: ''
				}));
			})
			.catch(error => {
				console.error(error)
				let message = error.response.data.message;
					if (message.includes('duplicate key error')) {
						existPopupOpen(true);
					}
			});
	};

	// Check if logged in and save user name to state.
	const checkLogin = () => {
		if (LoginInfo.id == null) {
			setState(prevState=>({
				...prevState,
				login_info: null,
				name: '',
				passwd: '',
			}));
		} else {
			setState(prevState=>({
				...prevState,
				login_info: LoginInfo.name,
				name: '',
				passwd: '',
			}));
		}
	}

	// Logout by changing LoginInfo.id to null
	const logout = () => {
		LoginInfo.id = null;
		LoginInfo.name = '';
		LoginInfo.passwd = '';
		checkLogin();
	}

	// Login
	const handleLogin = () => {
		axios
			.post('/api/users/login', {name: state.name, passwd:state.passwd})
			.then(response=>{
				// save LoginInfo if success.
				console.log(response);
				LoginInfo.id = response.data._id;
				LoginInfo.name = response.data.name;
				LoginInfo.passwd = response.data.passwd;
				checkLogin();
			})
			.catch( error=>{
				console.error(error)
				try{
					let message = error.response.data.message;
					if (message == 'User not found') {
						notExistPopupOpen(true);
					} else if (message == 'Password incorrect')  {
						passPopupOpen(true);
					}
				} catch (e) {
					console.error(e);
				}
			});
	}

	const handleDelete = async id => {
		try {
			await axios.delete(`/api/users/${id}`);
			setState(prevState => ({
				users: prevState.users.filter(user => user._id !== id)
			}));
		} catch (error) {
			console.error(error);
		}
	};

	// Delete account which is logged-in.
	const handleDeleteCurrentAccount = () => {
		if (LoginInfo.id==null) return;
		let id = LoginInfo.id;
		try {
			axios
				.delete('/api/users/'+id)
				.then(()=>{
					setState(prevState => ({
						...prevState,
						name: '',
						passwd: '',
					}));
				})
				.then(()=>{
					logout();
				})
				.catch(error=>console.error(error));
		} catch (err) {
			console.error(err);
		}
	};

	const handleLogout = async () => {
		logout();
	}

	useEffect(() => {
		checkLogin();
		if (canvas && canvas.lowerCanvasEl) canvas.dispose();
	}, []);

	return (
		<>
			<h2>{$L('Login info.')}</h2>
			{(state.login_info) ? (
				<>
				Hello, {state.login_info}!
				<Button onClick={handleLogout}>
					{$L('Logout')}
				</Button>
				<Button onClick={handleDeleteCurrentAccount}>
					{$L('Delete')}
				</Button>
				</>
			) : (
				'Please login :)'
			)}
			<h2>{$L('Add User')}</h2>
			<div>
				<InputField
					type="text"
					value={state.name}
					onChange={e => setState(prev => ({...prev, name: e.value}))}
					placeholder="Name"
				/>
				<InputField
					type="password"
					value={state.passwd}
					onChange={e => setState(prev => ({...prev, passwd: e.value}))}
					placeholder="Password"
				/>
			</div>
			<div>
				<Button onClick={handleAddUser} type="submit">
					{$L('Add User')}
				</Button>
				<Button onClick={handleLogin} type="submit">
					{$L('Login')}
				</Button>
			</div>
			<Popup type="overlay" open={notExistPopup} onClose={()=>notExistPopupOpen(false)}>
				<span>{$L('User not found.')}</span>
			</Popup>
			<Popup type="overlay" open={passPopup} onClose={()=>passPopupOpen(false)}>
				<span>{$L('Password incorrect.')}</span>
			</Popup>
			<Popup type="overlay" open={namePopup} onClose={()=>namePopupOpen(false)}>
				<span>{$L('Invaild user name or password.')}</span>
			</Popup>
			<Popup type="overlay" open={existPopup} onClose={()=>existPopupOpen(false)}>
				<span>{$L('User already exists.')}</span>
			</Popup>
		</>
	);
};

export default Account;