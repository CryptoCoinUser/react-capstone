import React from 'react';

export default function LoginPage() {
    return (
    	<div id="loginWrapper">
	    	<h2>Watch My Bitcoin Address App</h2>
	    	<a href={'/api/auth/google'}>Login with Google</a>
	    	<h4>30-second looping demo:</h4>
	    	<img src="/demoLoop.gif" alt="30-second animated demo" />
    	</div>
    	)
}
