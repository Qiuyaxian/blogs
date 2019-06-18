import React from 'react';
import ReactDom from 'react-dom';
import logo from './logo.svg';
import './App.css';
import $axios from './utils'
/* antd start */
import { Layout, Row, Col } from 'antd';
import 'antd/dist/antd.css';
/* antd end */
// 首先我们需要导入一些组件...
/* react-router-dom start */
import { BrowserRouter,HashRouter,Router,Switch,Route,IndexRoute,Link,NavLink } from 'react-router-dom'
/* react-router-dom end */
/* 页面组件 start */
import store from './redux/store'
import { login } from './redux/action'
/* axios end */
const { Header, Footer, Sider, Content } = Layout;
//初始化页面
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
    let _this = this; 
    $axios.post('/isLogin').then((response)=>{
        if(response.data && response.data.userInfo){
          store.dispatch(login(response.data.userInfo));
        }
    });
  } 
  componentWillReceiveProps() {
     
  }
  render() {
    return (
        <div>
          { this.props.children }
        </div>
    );
  }
}

export default App;
