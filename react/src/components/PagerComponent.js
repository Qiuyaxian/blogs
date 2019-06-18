import React from 'react';
import ReactDom from 'react-dom';
import $axios from '../utils'
import qs from 'qs'
export default class PagerComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

    componentDidMount(){
         
    }
    
	render() {
		return (
			<div className="pager">
	            <ul className="clear">
	                <li className="previous">
	                    <span onClick={ () => this.props.prevHandle() }>上一页</span>
	                </li>
	                <li>
	                    <strong>{ this.props.nowPage }</strong>
	                </li>
	                /
	                <li>
	                    <strong>{ this.props.pageCount }</strong>
	                </li>
	                <li className="next">
	                    <span onClick={ ()=> this.props.nextHandle() }>下一页</span>
	                </li>
	            </ul>
	        </div> 
		)
	}
}
