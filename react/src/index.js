import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import './static/css/main.css';
/* react-router-dom start */
import { BrowserRouter,HashRouter,Router,Switch,Route,IndexRoute,Link } from 'react-router-dom'
// console.log("initial state: ", store.getState());
import registerServiceWorker from './registerServiceWorker';

/* react-router-dom end */
//redux 和react-redux（关联react和redux）
import { Provider } from 'react-redux';
//reducers 状态树state和逻辑操作
import store from './redux/store'
import App from './App.js';
// import IndexComponent from './components/IndexComponent'
import IndexComponentReactRedux from './redux/reactRedux/index.js'
import ContentComponentReactRedux from './redux/reactRedux/content.js'

ReactDom.render(
	<Provider store={store}>
		<HashRouter>
		  <App> 
		     <Route exact path="/" component={IndexComponentReactRedux}></Route>
             <Route path="/index/:catepory" component={IndexComponentReactRedux}></Route>
             <Route path="/view/:id" component={ContentComponentReactRedux}></Route>
		  </App>
        </HashRouter>  
	</Provider>
	, document.getElementById('root'));
registerServiceWorker();
