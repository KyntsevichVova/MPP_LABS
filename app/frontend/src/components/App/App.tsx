import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { ADD_ENDPOINT, EDIT_ENDPOINT, HOME_ENDPOINT } from '../../lib/contants';
import Navbar from '../Navbar/Navbar';
import AddPage from '../pages/Add/Add';
import EditPage from '../pages/Edit/Edit';
import HomePage from '../pages/Home/Home';
import './App.css';

function App() {
  	return (
    	<HashRouter>
			<Navbar />
			<Switch>
				<Route exact path={`${HOME_ENDPOINT}`}>
					<HomePage />
				</Route>
				<Route exact path={`${ADD_ENDPOINT}`}>
					<AddPage />
				</Route>
				<Route exact path={`${EDIT_ENDPOINT}/:task_id`}>
					<EditPage />
				</Route>
			</Switch>
    	</HashRouter>
  	);
}

export default App;
