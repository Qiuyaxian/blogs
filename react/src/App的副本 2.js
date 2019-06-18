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
import ListBoxComponent from './components/ListBoxComponent.js'
import IndexComponent from './components/IndexComponent.js'
import LoginComponentReactRedux from './redux/reactRedux/login.js' 
import RegisterComponent from './components/RegisterComponent'
import CommunityComponent from './components/CommunityComponent'
import UserComponent from './components/UserComponent'
import ContentComponentReactRedux from './redux/reactRedux/content.js'
import MainComponentReactRedux from './redux/reactRedux/main.js'
/* 页面组件 start */


/* axios end */
const { Header, Footer, Sider, Content } = Layout;
//初始化页面
class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      userInfo:null,
      catepories:[],
      navIndex:'/'
    };
  }
   
  componentDidMount(){
      let _this = this;

      $axios.post('/isLogin').then((response)=>{
          if(response.data && response.data.userInfo){
            console.log(_this.props,"index.js")
            _this.setState({
                userInfo: response.data.userInfo
            });
          }
      });
      //加载分类
      $axios.get('/classfily').then((response)=>{
          
          if(response.data && response.data.catepories){
            _this.setState({
                catepories:response.data.catepories
            });
          }
      });

      PubSub.subscribe("loginOut",function(userInfo){
          console.log(userInfo,'退出登陆')
          this.setState({userInfo:null});
      }.bind(this)); 

      PubSub.subscribe("login",function(userInfo){
          console.log(userInfo,'登陆成功')
          this.setState({userInfo:userInfo});
      }.bind(this)); 
  };
   
  render() {
    let login = this.state.userInfo,loginState,_this = this;
    if(login){
       loginState = <UserComponent></UserComponent>;
    }else{
      
       loginState = <LoginComponentReactRedux userInfo='userInfo'></LoginComponentReactRedux>;
    }
     
    return (
        <HashRouter>   
          <Layout>
              <NavComponent nav={this.state.catepories}></NavComponent>
              <Content className='main clear'>
                  <div className="mainLeft">
                       {/* 相当于 vue里面的<view-router> */}
                       <MainComponentReactRedux userInfo='userInfo' login={login}>
                         <Route exact path="/index" component={IndexComponent}></Route>
                         <Route path="/index/:catepory" component={IndexComponent}>
                          </Route>
                         <Route path="/view/:id" component={ContentComponentReactRedux}></Route>
                       </MainComponentReactRedux>
                       {/* 相当于 vue里面的<view-router> */}
                  </div>
                  <div className="mainRight">
                      { loginState }
                      <CommunityComponent></CommunityComponent>
                  </div>
              </Content>
              <FooterComponent></FooterComponent>  
          </Layout>
        </HashRouter>  
    );
  }
}
//头部导航
class NavComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      navIndex:'/'
    };

  }
  componentWillMount() {
    //获取分类
     
  }
  componentDidMount() {
    
  }
   
  render() {
    let _this = this,
        nav = this.props.nav,
        navList = [];
    if(nav && nav.length !== 0){
        nav.forEach((item,index)=>{
            navList.push( <NavLink to={'/index/'+item._id} key={index} activeClassName="focus" replace>{ item.name }</NavLink> )
        });
    }
    
    return (
      <Header className='headers'>
         <div className='headerDiv'>
             <div className="backimg"><img src="./static/images/IMG_0293.jpg" alt=""/></div>
             <div className="logo"><img src="./static/images/00002637.png" alt="" /></div>
         </div>
         <nav>
            <div className="menu clear"> 
                <NavLink to='/index' activeClassName="focus" key='' replace>首页</NavLink>
                { navList }
            </div>
         </nav>
      </Header>
    )
  }
}
//底部脚步
class FooterComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Footer className='footers'>
          <div className="copyright textCenter">Copyright 版权所有，翻版必究</div>
      </Footer>
    )
  }
}
//主体区域

export default App;
