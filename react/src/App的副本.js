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
import { BrowserRouter,HashRouter,Router,Switch,Route,IndexRoute,Link } from 'react-router-dom'
/* react-router-dom end */
/* 页面组件 start */
import ListBoxComponent from './components/ListBoxComponent.js'
import PagerComponent from './components/PagerComponent'
import LoginComponent from './components/LoginComponent' 
import RegisterComponent from './components/RegisterComponent'
import CommunityComponent from './components/CommunityComponent'
import UserComponent from './components/UserComponent'
import ContentComponent from './components/ContentComponent'
/* 页面组件 start */


/* axios end */
const { Header, Footer, Sider, Content } = Layout;
//初始化页面
class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      userInfo:null,
      catepories:[]
    };
  }
  componentDidMount(){

    PubSub.subscribe("loginOut",function(userInfo){
        console.log(userInfo,'退出登陆')
        this.setState({userInfo:null});
    }.bind(this)); 

    PubSub.subscribe("login",function(userInfo){
        console.log(userInfo,'登陆成功')
        this.setState({userInfo:userInfo});
    }.bind(this)); 
  };
  componentWillMount(){
      let _this = this;
      

      $axios.post('/isLogin').then((response)=>{
          if(response.data && response.data.userInfo){
            _this.setState({
                userInfo:response.data.userInfo
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
  };
  render() {
    let login = this.state.userInfo,loginState;
    if(login){
       loginState = <UserComponent></UserComponent>;
    }else{
       loginState = <LoginComponent></LoginComponent>;
                  /* <RegisterComponent></RegisterComponent> */
    }
    return (
      <Layout>
              
          <NavComponent nav={this.state.catepories}></NavComponent>
          <Content className='main clear'>
              <div className="mainLeft">
                   {/* 相当于 vue里面的<view-router> */}
                   <MainComponent></MainComponent> 
                   {/* 相当于 vue里面的<view-router> */}
              </div>
              <div className="mainRight">
                  { loginState }
                  <CommunityComponent></CommunityComponent>

              </div>
          </Content>
             
          <FooterComponent></FooterComponent>  
      </Layout>
    );
  }
}
//头部导航
class NavComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
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
            navList.push( <Link to={'/'+item._id} key={index} replace>{ item.name }</Link> )
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
                <Link to='/' className='focus' replace>首页</Link>
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
class MainComponent extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }
  render() {
    return (
        /*<Switch>
          <Route exact path="/:catepory" component={IndexComponent}></Route>
          <Route path="/view/:id" component={ContentComponent}></Route>
        </Switch>*/
        <HashRouter>
          <Route exact path="/" component={IndexComponent}></Route>
          <Route path="/:catepory" component={IndexComponent}></Route>
          <Route path="/view/:id" component={ContentComponent}></Route>
        </HashRouter>
    );
  }
}
//首页
class IndexComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(props,"props")
    this.state = {
      nowPage:1,
      pageCount:1,
      id:''
    };
  }
  componentWillMount(props){
  }
  componentWillReceiveProps(nextProps) {
      let _this = this,id = nextProps.match.params.catepory;
      _this.loading(id,_this);
  }
  loading(id,context) {
     let _this = context,url = '';
     if(id){
        url = `/index?catepory=${id}`
     }else{
        url = `/index`
     }
     _this.setState({
         contentList:[]
     });
     $axios.get(url).then((response)=>{
        _this.setState({
           contentList:response.data.contents
        });
     });
  }
  componentDidMount(){
      //上一页
      PubSub.subscribe("prevHandle",function(){
          //this.setState({userInfo:null});
      }.bind(this)); 
      //下一页
      PubSub.subscribe("nextHandle",function(){
          //this.setState({userInfo:userInfo});
      }.bind(this));  
  }
  render() {

    let contentList = this.state.contentList;
    let ListBox = [];

    if(contentList && contentList.length !== 0){
      contentList.forEach((item,index)=>{
          ListBox.push(<ListBoxComponent item={item} key={index} />); 
      });
      
    }
    return (
        <div>

            { ListBox }
            <PagerComponent nowPage={ this.state.nowPage } pageCount={ this.state.pageCount }></PagerComponent>
            
        </div>
    );
    
  }
}
export default App;
