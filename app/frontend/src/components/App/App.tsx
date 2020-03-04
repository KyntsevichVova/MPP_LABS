import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

function App() {
  	return (
    	<HashRouter>
			<Switch>
				<Route exact path='/'>
					
				</Route>
				<Route exact path='/add'>

				</Route>
				<Route exact path='/edit/:task_id'>
					
				</Route>
			</Switch>
    	</HashRouter>
  	);
}

export default App;
