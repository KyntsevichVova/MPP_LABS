import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import AddPage from '../pages/Add/Add';
import EditPage from '../pages/Edit/Edit';
import HomePage from '../pages/Home/Home';

function App() {
  	return (
    	<HashRouter>
			<Navbar />
			<Switch>
				<Route exact path='/'>
					<HomePage />
				</Route>
				<Route exact path='/add'>
					<AddPage />
				</Route>
				<Route exact path='/edit/:task_id'>
					<EditPage />
				</Route>
			</Switch>
    	</HashRouter>
  	);
}

export default App;
