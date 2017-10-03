# Watch My (Bitcoin) Address

Please see https://watch-my-address.herokuapp.com/


## This app lets you

<ul>
	<li>Track a Bitcoin address and its balance of bitcoin; confirmed balance as well as unconfirmed / pending balance</li>
	<li>See the latest transaction the address was used it in (“latest” at the time you started tracking the address), along with the miner preference to confirm that transaction, or how many confirmations it already received.</li>
	<li>If you give your email, you can subscribe to email notifications about an address. You will be emailed every time that address is used in a new transaction and/or that transaction gets confirmed up, to 3 confirmations per  transaction.</li>
	<li>This app uses an API from BlockCypher to query the data. For more info, each address and trasaction you track is linked to its corresponding ("block explorer") page on BlockCypher.com</li>
</ul> 

## Getting started
### Installing
```
>   git clone https://github.com/CryptoCoinUser/react-capstone.git
>   cd react-capstone
>   npm install
```
### Launching
```
>   npm run dev
```
Open [`localhost:8080`]
### Testing (both server and React)
```
>   npm test
```

## Technology Used

<ul>
	<li>Bitcoin API courtesy of <a href="https://www.blockcypher.com/dev/bitcoin/">BlockCypher</a></li>
	<li>Node and React, including the following packages:
		<ul>
			<li><a href="https://www.npmjs.com/package/bitcoin-address">bitcoin-address</a></li>
			<li><a href="https://www.npmjs.com/package/blockcypher">blockcypher</a></li>
			<li><a href="https://www.npmjs.com/package/moment">moment</a></li>
			<li><a href="https://www.npmjs.com/package/react-router-dom">react-router-dom</a></li>
		</ul>
	</li>
	<li>Email notifications via Gmail and Google's SMTP</li>
	<li>MongoDB, hosted on mLab</li>
</ul>


## Screenshot

<img src="/client/public/screenshots/default.gif" alt="Screenshot of Watch my Bitcoin Address App" />