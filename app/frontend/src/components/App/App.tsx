import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, TASKS_ROUTE } from '../../lib/constants';
import AddPage from '../pages/Add/Add';
import EditPage from '../pages/Edit/Edit';
import HomePage from '../pages/Home/Home';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import './App.css';

function App() {
  	return (
    	<HashRouter>
			<Switch>
				<Route exact path={`${HOME_ROUTE}`}>
					<HomePage />
				</Route>
				<Route exact path={`${TASKS_ROUTE}`}>
					<AddPage />
				</Route>
				<Route exact path={`${TASKS_ROUTE}/:task_id`}>
					<EditPage />
				</Route>
				<Route path={`${LOGIN_ROUTE}`}>
					<LoginPage />
				</Route>
				<Route path={`${REGISTER_ROUTE}`}>
					<RegisterPage />
				</Route>
			</Switch>
    	</HashRouter>
  	);
}

export default App;
