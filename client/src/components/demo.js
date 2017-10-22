import React from 'react';

export default function Demo() {
    return ( 
    	
    	<div id="main" className="demo">
    	<h2>How to use this App</h2>	
	    	<div id="screenshots">
	    			<section>
	    				<h3>0</h3>
		    	   		<p>Login with a Google account. You will be redirected to the App / Try It page.</p>
		    	   		<img src="/screenshots/login.gif" />
	    			</section>
		    	   <section>
			    		<h3>1</h3>
				    	<p>To see how the app works, hit "Get Random Address" to get a Bitcoin address from someone's recent transaction, then hit "Watch Random Address"
				    		<img src="/screenshots/getRandomAddress.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h3>2</h3>
				    	<p>Or you can paste a Bitcoin address you actually care about, say, an address from your wallet or a deposit address you just sent Bitcoin to, and then hit "Watch My Address"
				    		<img src="/screenshots/pasteYourAddress.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h3>3</h3>
				    	<p>Both random and specific addresses you watch show up in the Watched Address List, along with balances and recent transaction info.
				    		<img src="/screenshots/2savedAddresses.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h3>4</h3>
				    	<p>You can also subscribe to email updates about an address - you'll receive an email when the address is used in a transaction and when that transaction is confirmed.
				    		<img src="/screenshots/emailMeWithForm.gif" />
				    	</p>
			    	</section>
		    	</div>
		
    	</div>
    	)
}
