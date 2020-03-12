import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { HOME_ENDPOINT, LOGIN_ENDPOINT, REGISTER_ENDPOINT, TASKS_ENDPOINT } from '../../lib/constants';
import Navbar from '../Navbar/Navbar';
import AddPage from '../pages/Add/Add';
import EditPage from '../pages/Edit/Edit';
import HomePage from '../pages/Home/Home';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import './App.css';

function App() {
  	return (
    	<HashRouter>
			<Navbar />
			<Switch>
				<Route exact path={`${HOME_ENDPOINT}`}>
					<HomePage />
				</Route>
				<Route exact path={`${TASKS_ENDPOINT}`}>
					<AddPage />
				</Route>
				<Route exact path={`${TASKS_ENDPOINT}/:task_id`}>
					<EditPage />
				</Route>
				<Route path={`${LOGIN_ENDPOINT}`}>
					<LoginPage />
				</Route>
				<Route path={`${REGISTER_ENDPOINT}`}>
					<RegisterPage />
				</Route>
			</Switch>
    	</HashRouter>
  	);
}

export default App;
