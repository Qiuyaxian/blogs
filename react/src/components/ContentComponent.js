import React from 'react';
import ReactDom from 'react-dom';
import $axios from '../utils'
import qs from 'qs'
/* antd start */
import { Layout, Row, Col } from 'antd';

import NavComponent from './NavComponent.js'
import LogoutComponentReactRedux from '../redux/reactRedux/logout.js'
import LoginComponentReactRedux from '../redux/reactRedux/login.js' 
import CommunityComponent from './CommunityComponent'
import UserComponent from './UserComponent'
import PagerComponent from './PagerComponent'
import FooterComponent from './FooterComponent'
/* axios end */
const { Header, Footer, Sider, Content } = Layout;
export default class ContentComponent extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
      contentList:[],
      content:{},
      nav:[],
      nowPage:1,
      pageCount:1,
    };
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

    if(this.props.match.params.id){
       $axios.get(`/view?contentId=${this.props.match.params.id}`).then((response)=>{
          _this.setState({
             content:response.data.content,
          });
       });
       this.pageHandle(this.state.nowPage);
    }
    

  }
  componentWillReceiveProps(nextProps){
     
  }
  componentWillMount(){
     
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
    if(this.props.match.params.id && this.props.match.params.id !== ''){
       getUrl = `/comment?catepory=${this.props.match.params.id}&page=${nowPage}`;
    }else{
       getUrl = `/comment?page=${nowPage}`;
    }
    $axios.get(getUrl).then((response)=>{
        if(response.data){
           _this.setState({
               contentList:response.data.comments,
               nowPage:response.data.page,
               pageCount:response.data.pages,
           });
        }
    });
  }
	render() {
    let loginState,mainState,comments;
    if(this.props.userInfo && this.props.userInfo._id){
      if(this.state.contentList && this.state.contentList.length !== 0){
        let commentList = [];
        this.state.contentList.forEach((item,index)=>{
           commentList.push((<div className="messageBox" key={ index }>
                <p className="name clear">
                  <span className="fl">{ item.username }</span>
                  <span className="fr">{ item.postTime }</span>
                </p>
                <p>{ item.content }</p>
                </div>));
        });
        comments = (<div>
          <div className="messageList">
            { commentList }
          </div>
          <PagerComponent 
            url={ this.state.url } 
            nowPage={ this.state.nowPage } 
            pageCount={ this.state.pageCount }
            prevHandle={ () => this.prevHandle() }
            nextHandle={ () => this.nextHandle() }
            ></PagerComponent>
        </div>);
      }else {
        comments = '';
      }
      mainState = (<div>
        <h3 className="textLeft">
            <strong>评论</strong> 
            <span className="em">一共有 <em id="messageCount">0</em> 条评论</span>
        </h3>
        <p className="textLeft clear">
          <textarea id="messageContent"></textarea>
          <input type="hidden" id="contentId" value="" />
          <button id="messageBtn" className="submit">提交</button>
        </p>
        { comments }
      </div>);
      loginState = (<LogoutComponentReactRedux></LogoutComponentReactRedux>);
    }else{
      mainState = (<p className="bgDanger" style={{'lineHeight': '30px'}}>你还没有登录，请先登录！</p>);
      loginState = (<LoginComponentReactRedux></LoginComponentReactRedux>);           
    }
		return (
      <Layout>
        <NavComponent nav={ this.state.nav }></NavComponent>
        <Content className='main clear'>
            <div className="mainLeft">
                <div>
                    <div className="listBox">
                        <h1>{ this.state.content.title }</h1>
                        <p className="colDefault">
                            作者：<span className="colInfo">{ this.state.content.user }</span> -
                            时间：<span className="colInfo">{ this.state.content.addTime }</span> -
                            阅读：<span className="colInfo">{ this.state.content.views }</span> -
                            评论：<span className="colInfo">{ 0 }</span>
                        </p>
                        <dfn>{ this.state.content.content }</dfn>
                    </div>
                    <div className="listBox message">
                          { mainState }
                    </div>
                </div>
            </div>
            <div className="mainRight">
                { loginState }
                <CommunityComponent></CommunityComponent>
            </div>
        </Content>
           
        <FooterComponent></FooterComponent>  
      </Layout>
            
		)
	}
}

