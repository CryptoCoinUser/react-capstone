import React from 'react';
import * as Cookies from 'js-cookie';
import LoginPage from './login-page';
import AddressesPage from './addresses-page';
import axios from 'axios';

import {connect} from 'react-redux';
import * as actions from '../actions/index';



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            latestBlockHeight: 0
        };
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        // hit /api/isuserloggedin

        console.log('componentDidMount!');

        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.isUserLoggedIn(accessToken)
            )
        }
        this.props.dispatch(
            actions.fetchLatestBlock()
        )
        
    }

    logout(e) {
        e.preventDefault();
        console.log('logout')
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.logoutCurrentUser(accessToken)
            )
        }
    }

    getUnconfirmedAddress(e){
        e.preventDefault();
        this.props.dispatch(
            actions.getUnconfirmedAddress()
        )
    }

 



    render() {
        console.log("just inside render()");
        if(!this.props.currentUser){
            return <LoginPage />;
        }
        return (
            <div className="app">
                <p><a href="#" onClick={(e => this.logout(e))}>logout</a></p>


                <h2>Add txn</h2>



                <h4>Add a random Uncofirmed txn to watch list</h4>
                <p>
                    
                    <button
                        onClick={(e => this.getUnconfirmedAddress(e))}
                    >
                        Add a Random Uncofirmed Txn
                    </button>
                    <br />

                    https:\//api.blockcypher.com/v1/btc/main/txs
                    <br />

                    {this.props.randomAddress} <br />
                    {this.props.randomAddressError}
                </p>


                <form id="itemToWatch">
                <h4>Add specific txn to watch list</h4>
                    <input type="text" placeholder="paste txn id or receiving address" size="60" />
                    <button id="submitItemToWatch">Watch this Txn or Address   </button>
                </form>




                <h2>Welcome</h2>
                <h4>Bitcoin network status:</h4>
                <p><strong>{this.props.latestBlock ? this.props.latestBlock.height : ''}:</strong> Block height from http://api.blockcypher.com/v1/btc/main</p>
                <p> 
                    <a href={this.props.latestBlock ? this.props.latestBlock.latest_url : ''} target="_blank">
                        Latest block url from http://api.blockcypher.com/v1/btc/main
                    </a>
                </p>
             
                <h2>Txns you are watching</h2>
                <AddressesPage />
          
                

            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    latestBlock: state.latestBlock,
    latestBlockHeight: state.latestBlockHeight,
    randomAddress: state.randomAddress,
    randomAddressError: state.randomAddressError
    
})

export default connect(mapStateToProps)(App);
