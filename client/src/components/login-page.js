import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';


export const LoginPage = props => {
    if(props.currentUser){
        return <Redirect to='/app' />
    }

    return ( 
          <div id="main" className="demo">

	        <section className="crashCourse">

	        	<h2>Welcome to Watch My (Bitcoin) Address</h2>

	        	<img className="right" src="/screenshots/default.gif" />

	        	<p>New to Bitcoin? Here is a <a href="/about-bitcoin">crash course on Bitcoin</a>, enough to help you use this app</p>

	        	<h4>This app lets you</h4>

<ul>
	<li>Track a Bitcoin address and its balance of bitcoin; confirmed balance as well as unconfirmed / pending balance</li>
	<li>See the latest transaction the address was used it in (“latest” at the time you started tracking the address), along with the miner preference to confirm that transaction, or how many confirmations it already received.
</li>
	<li>If you give your email, you can subscribe to email notifications about an address. You will be emailed every time that address is used in a new transaction and/or that transaction gets confirmed up, to 3 confirmations per  transaction.</li>
	<li>This app uses an API from BlockCypher to query the data. For more info, each address and trasaction you track is linked to its corresponding ("block explorer") page on BlockCypher.com</li>
</ul> 
	        </section>
    	</div>
    	)
}

const mapStateToProps = state => ({
    currentUser: state.currentUser
}) 

export default connect(mapStateToProps)(LoginPage)
