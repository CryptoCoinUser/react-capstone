import React from 'react';

export default function Demo() {
    return ( 

    	<div id="main" className="demo">
	        <section className="crashCourse"><h2>A crash couse on Bitcoin</h2>
	        	<h4>and where this app comes in</h4>
	        	<p>Watching a Bitcoin <em>address</em> lets you see a tiny fraction of the activity on the Bitcoin network. There are millions of wallets out there on the Bitcoin network. 
Each wallet uses Bitcoin addresses to send and receive bitcoin, the token. The number of possible Bitcoin addresses is virtually unlimited, so many wallets use an address only once, and generate new addresses for each transaction.
Bitcoin addresses are about 30 (seemingly) random characters each, starting with a 1 or a 3, for example 18UwNReswU2YsMFtDhiZmv7o4totXCnU38</p>
<p>
A previously-used Bitcoin address can be traced to a Bitcoin <em>transaction</em>. 
A Bitcoin transaction transfers Bitcoin from one or more address to one or more addresses.
Bitcoin transction IDs are about 60 (seemingly) random characters, such as 63374f9cc7592e293939c3e969bade22b49f5840cc0d1ea3fc3fb1ded6665c4c</p><p>
Bitcoin transactions are broadcast to the network in seconds, but usually take minutes to be <em>confirmed</em> or included into the latest block of the Bitcoin blockchain. The transaction confirmation process requires Bitcoin miners to verify that the sending addresses are not trying to double-spend their bitcoin, and then the transaction has to wait until it’s included in a block. Storage space in a Bitcoin block is limited, so transactions that offer higher fees (relative to how much data they carry) are usually prioritized.
Because of the decentralized nature of Bitcoin, it does happen that the latest block (or two) is abandoned by the network in favor of another block from a competing miner. That’s why many merchants and businesses that accept Bitcoin have a policy of waiting for not one but several <em>confirmations</em> before they treat a transaction as irreversible.
</p><p>This app lets you</p>
<ul>
	<li>Track a Bitcoin address and its confirmed and pending balance of bitcoin</li>
	<li>See the latest transaction the address was used it in (“latest” at the time you started tracking the address), along with the miner preference to confirm that transaction, or how many confirmations it already received.
</li>
	<li>If you give your email, you can subscribe to email notifications about an address. You will be emailed every time that address is used in a new transaction and/or that transaction gets confirmed up, to 3 confirmations per  transaction.</li>
	<li>This app uses an API from BlockCypher to query the data. For more info, each address and trasaction you track is linked to its corresponding page on BlockCypher.com</li>
</ul> 

	        </section>
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
