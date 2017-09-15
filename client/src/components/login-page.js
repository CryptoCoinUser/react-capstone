import React from 'react';

export default function LoginPage() {
    return (
    	<div id="loginWrapper">

	    	<h2>Watch My Bitcoin Address App</h2>
	    	<h4>Info about a Bitcoin address and the transaction(s) it was used in</h4>
	    	<a href={'/api/auth/google'} id="loginLink">Login with Google</a>
	    	<div id="intro">
	    		<h2>Intro</h2>
		    	<p>To see how the app works, hit "Get Random Address" to get a Bitcoin address from someone's recent transaction.
		    		<img src="/screenshots/getRandomAddress.gif" />
		    	</p>
		    	<p>Or you can paste a Bitcoin address you actually care about, say, an address from your wallet or a deposit address you just sent Bitcoin to.
		    		<img src="/screenshots/pasteYourAddress.gif" />
		    	</p>
		    	<p>Both random and specific addresses you decided to watch show up in the Watched Address List, along with the latest details
		    		<img src="/screenshots/2savedAddresses.gif" />
		    	</p>
		    	<p>You can also subscribe for email alerts about an address - you'll receive an email when the address is used in a new trasaction and when that transaction is confirmed
		    		<img src="/screenshots/emailMeWithForm.gif" />
		    	</p>
	    	</div>
	    	
	    	<h4>30-second demo video:</h4>
	    	<video controls autoPlay preload="auto" width='640' height='821' poster='/videoPoster.png'>
				<source src='/demo30sec.mp4' type='video/mp4' />
				Your browser does not support the HTML5 'video' tag
			</video>
    	</div>
    	)
}
