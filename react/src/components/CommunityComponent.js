import React from 'react';
import { Link } from 'react-router-dom'
export default class LonginComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

    componentDidMount(){
         
    }

	render() {
		return (
			<div className="rightBox">
	            <div className="title"><span>社区</span></div>
	            <p><Link to='http://bbs.miaov.com'>妙味茶馆</Link></p>
	            <p><Link to='http://bbs.miaov.com'>妙味茶馆</Link></p>
	        </div>
		)
	}
}
