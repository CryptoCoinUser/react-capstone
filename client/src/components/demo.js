import React from 'react';

export default function Demo() {
    return ( 

    	<div id="main" className="demo">
	    	<div id="screenshots">
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
				    	<p>Both random and specific addresses you watch show up in the Watched Address List, along with balances and recent transaction info.
				    		<img src="/screenshots/2savedAddresses.gif" />
				    	</p>
			    	</section>
			    	<section>
				    	<h2>4</h2>
				    	<p>You can also subscribe to email updates about an address - you'll receive an email when the address is used in a transaction and when that transaction is confirmed.
				    		<img src="/screenshots/emailMeWithForm.gif" />
				    	</p>
			    	</section>
		    	</div>
		
    	</div>
    	)
}
