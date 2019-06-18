import React from 'react';
import ReactDom from 'react-dom';
import $axios from '../utils'
import qs from 'qs'
export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.login){
    	this.props.Login(this.props.login);
    }
  }
  componentWillMount() {
  	
  }
  render() {
    let _this = this;     
    return (
        <div>
          { 
            React.Children.map(this.props.children, (children) => {
              return React.cloneElement(children, {
                  userInfo:'userInfo'
              })
            }) 
          }
        </div>
    );
  }
}

