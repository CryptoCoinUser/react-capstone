import React from 'react';

export default function Demo() {
    return (
	    	<div id="demo">
		    	<div id="intro">
		    		<h1>Intro</h1>
		    		<section>
			    		<h2>1</h2>
				    	<p>To see how the app works, hit "Get Random Address" to get a Bitcoin address from someone's recent transaction, then hit "Watch This Address"
				    		<img src="/screenshots/getRandomAddress.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h2>2</h2>
				    	<p>Or you can paste a Bitcoin address you actually care about, say, an address from your wallet or a deposit address you just sent Bitcoin to, and then hit "Watch My Address"
				    		<img src="/screenshots/pasteYourAddress.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h2>3</h2>
				    	<p>Both random and specific addresses you watch show up in the Watched Address List, along with the latest details
				    		<img src="/screenshots/2savedAddresses.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h2>4</h2>
				    	<p>You can also subscribe for email updates about an address - you'll receive an email when the address is used in a  trasaction, namely when that trasaction is confirmed
				    		<img src="/screenshots/emailMeWithForm.gif" />
				    	</p>
			    	</section>
		    	</div>
		    	{/*
			    	<h4>30-second demo video:</h4>
			    	<video controls autoPlay preload="auto" width='640' height='821' poster='/videoPoster.png'>
						<source src='/demo30sec.mp4' type='video/mp4' />
						Your browser does not support the HTML5 'video' tag
					</video>
				*/}
    		</div>
    	)
}
