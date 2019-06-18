import React from 'react';
import { Link } from 'react-router-dom';
import $axios from '../utils'
import qs from 'qs'
/* antd start */
import { Layout, Row, Col } from 'antd';

import NavComponent from './NavComponent.js'
import ListBoxComponent from './ListBoxComponent.js'
import LogoutComponentReactRedux from '../redux/reactRedux/logout.js'
import LoginComponentReactRedux from '../redux/reactRedux/login.js' 
import RegisterComponent from './RegisterComponent'
import CommunityComponent from './CommunityComponent'

import PagerComponent from './PagerComponent'
import FooterComponent from './FooterComponent'
/* axios end */
const { Header, Footer, Sider, Content } = Layout;

//首页
export default class IndexComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowPage:1,
      pageCount:1,
      id:'',
      url:'/',
      nav:[]
    };
  }
  componentWillMount(){
    
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps,"this.props.state")
    let _this = this,id = nextProps.match.params.catepory;
    _this.loading(id,_this);
  }
  loading(id,context) {
     let _this = context,url = '';
     if(id){
        url = `/index?catepory=${id}`;
     }else{
        url = `/index`;
     }
     _this.setState({
         contentList:[],
         url:url,
         id:id
     });

     $axios.get(url).then((response)=>{
        _this.setState({
           contentList:response.data.contents,
           nowPage:response.data.page,
           pageCount:response.data.pages,
        });
     });
  }
  componentDidMount(){
      let _this = this;
      //加载分类
      $axios.get('/classfily').then((response)=>{
          if(response.data && response.data.catepories){
            _this.setState({
                nav:response.data.catepories
            });
          }
      });
      let id = this.props.match.params.catepory || null;
      this.loading(id,this);
  }
  prevHandle() {
    if((this.state.nowPage-1) >= 1){
        this.pageHandle((this.state.nowPage-1));
    }else{
      this.setState({
          nowPage:1
      });
       
    }
  }
  nextHandle() {
    if((this.state.nowPage+1) <= this.state.pageCount){
        this.pageHandle((this.state.nowPage+1));
    }else{
        this.setState({
         nowPage: this.state.pageCount
      });
        
    }
  }

  pageHandle(nowPage) {
    let _this = this,getUrl = '';
    if(this.state.id && this.state.id !== ''){
       getUrl = `/index?catepory=${this.state.id}&page=${nowPage}`;
    }else{
       getUrl = `/index?page=${nowPage}`;
    }
    $axios.get(getUrl).then((response)=>{
        if(response.data){
          _this.setState({
             contentList:response.data.contents,
             nowPage:response.data.page,
             pageCount:response.data.pages,
          });
        }
    });
  }
  render() {

    let contentList = this.state.contentList;
    let ListBox = [];

    if(contentList && contentList.length !== 0){
      contentList.forEach((item,index)=>{
          ListBox.push(<ListBoxComponent item={item} key={index} />); 
      });
    }
    let loginState;
    if(this.props.userInfo && this.props.userInfo._id){
       loginState = <LogoutComponentReactRedux></LogoutComponentReactRedux>
    }else{
       loginState = <LoginComponentReactRedux></LoginComponentReactRedux>
    } 
    return (
        <Layout>
          <NavComponent nav={ this.state.nav }></NavComponent>
          <Content className='main clear'>
              <div className="mainLeft">
                    { ListBox }
                    <PagerComponent 
                      url={ this.state.url } 
                      nowPage={ this.state.nowPage } 
                      pageCount={ this.state.pageCount }
                      prevHandle={ () => this.prevHandle() }
                      nextHandle={ () => this.nextHandle() }
                      ></PagerComponent>
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
