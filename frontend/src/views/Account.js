/* eslint-disable */
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import axios from 'axios';
import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import LoginInfo from '../App/LoginInfo';

const Account = () => {

	const [state, setState] = useState({
		login_info: null,
		name: '',
		passwd: ''
	});

	// Add User.
	const handleAddUser = () => {
		axios
			.post('/api/users', {name: state.name, passwd: state.passwd})
			.then(response => {
				setState(prevState => ({
					...prevState,
					users: [...prevState.users, response.data],
					name: '',
					passwd: ''
				}));
			})
			.catch(error => console.error(error));
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
			.catch(
				error=>console.error(error)
			);
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
						users: prevState.users.filter(user => user._id !== id),
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
	}, []);

	return (
		<>
			<h2> Login info</h2>
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
			<h2>Add User</h2>
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
				placeholder="password"
			/>
			<Button onClick={handleAddUser} type="submit">
				{$L('Add User')}
			</Button>
			<Button onClick={handleLogin} type="submit">
				{$L('login')}
			</Button>
		</>
	);
};

export default Account;