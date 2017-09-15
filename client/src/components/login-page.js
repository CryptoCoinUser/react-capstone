import React from 'react';

export default function LoginPage() {
    return (
    	<div id="loginWrapper">

	    	<h2>Watch My Bitcoin Address App</h2>
	    	<p>See info about a Bitcoin address and the transaction(s) it was used in</p>
	    	<p>To see how the app works, get a random Bitcoin address from someone's recent transaction. The address shows up in the Watched Address List, along with the latest details.</p>
	    	<p>Then you can paste a Bitcoin address you actually care about, say, to see what the pending balance is, and if the pending transaction has been confirmed by the Bitcoin network.</p>
	    	<p>You can also subscribe for email alerts about an address - you'll receive an email when the address was used in a new trasaction and that transaction gets confirmed</p>
	    
	    	<a href={'/api/auth/google'} id="loginLink">Login with Google</a>
	    	<h4>30-second demo video:</h4>
	    	<video controls autoPlay preload="auto" width='640' height='821' poster='/videoPoster.png'>
				<source src='/demo30sec.mp4' type='video/mp4' />
				Your browser does not support the HTML5 'video' tag
			</video>
    	</div>
    	)
}
