import React from 'react';

export default function AboutBitcoin() {
    return ( 

    	<div id="main" className="demo">
	        <section className="crashCourse"><h2>A crash couse on Bitcoin</h2>
	        	<p>Watching a Bitcoin <em>address</em> lets you see a tiny fraction of the activity on the Bitcoin network. There are millions of wallets out there on the Bitcoin network. 
Each wallet uses Bitcoin addresses to send and receive bitcoin, the token. The number of possible Bitcoin addresses is virtually unlimited, so many wallets use an address only once, and generate new addresses for each transaction.
Bitcoin addresses are about 30 (seemingly) random characters each, starting with a 1 or a 3, for example 18UwNReswU2YsMFtDhiZmv7o4totXCnU38</p>
<p>
A previously-used Bitcoin address can be traced to a Bitcoin <em>transaction</em>. 
A Bitcoin transaction transfers Bitcoin from one or more address to one or more addresses.
Bitcoin transction IDs are about 60 (seemingly) random characters, such as 63374f9cc7592e293939c3e969bade22b49f5840cc0d1ea3fc3fb1ded6665c4c</p><p>
Bitcoin transactions are broadcast to the network in seconds, but usually take minutes to be <em>confirmed</em> or included into the latest block of the Bitcoin blockchain. The transaction confirmation process requires Bitcoin miners to verify that the sending addresses are not trying to double-spend their bitcoin, and then the transaction has to wait until it’s included in a block. Storage space in a Bitcoin block is limited, so transactions that offer higher fees (relative to how much data they carry) are usually prioritized.
Because of the decentralized nature of Bitcoin, it does happen that the latest block (or two) is abandoned by the network in favor of another block from a competing miner. That’s why many merchants and businesses that accept Bitcoin have a policy of waiting for not one but several <em>confirmations</em> before they treat a transaction as irreversible.
</p>
<p><a href="/">What this app can do</a></p>
	        	<p><a href="/demo">See a screenshot how-to demo</a></p>

	        </section>
    	</div>
    )
}
