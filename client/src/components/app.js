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
        this.logout = this.logout.bind(this);
        this.saveMyAddress = this.saveMyAddress.bind(this);
    }

    componentDidMount() {

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

    saveRandomAddress(e){
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(this.props.randomAddress, true, accessToken)
            )
        }
        // error handling if no access token
    }

    saveMyAddress(e) {
        e.preventDefault();

        console.log('saveMyAddress')

        const myAddress = this.myAddressInput.value;

        const accessToken = Cookies.get('accessToken');

        if (myAddress) {
            console.log('myAddress', myAddress);
        }else{
            console.log('no myAddress')
        }

        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(myAddress, false, accessToken)
            )
        }
    }


    render() {

        if(!this.props.currentUser){
            return <LoginPage />;
        }
        return (
            <div className="app">
                <p><a href="#" onClick={(e => this.logout(e))}>logout</a></p>


                <h2>Add Address</h2>



                <h4>Add a random address from a not-yet-confirmed txn to watch list</h4>
                <p>
                    
                    <button
                        onClick={(e => this.getUnconfirmedAddress(e))}
                    >
                        Get a Random Address from an Unconfirmed Txn
                    </button>
                    <br /><br />

                    {this.props.randomAddress} 
                    {this.props.randomAddress ?
                        <button
                            onClick = {(e => this.saveRandomAddress(e))} 
                            > Watch Random Address
                        </button>
                        : ""

                    }
                    <br />
                    {this.props.randomAddressError}
                </p>


                <form id="myAddressForm">
                <h4>Add specific address to watch list</h4>
                    <input type="text" placeholder="paste your receiving address" id="myAddress" size="35" 
                    ref={ref => this.myAddressInput = ref} />
                    <button id="watchMyAddress" 
                        onClick={this.saveMyAddress}
                    >Watch My Address</button>
                </form>

                <h2>Addresses you are watching</h2>
                <AddressesPage />


                <h4>Bitcoin network status:</h4>
                <p><strong>{this.props.latestBlock ? this.props.latestBlock.height : ''}:</strong> Block height from http://api.blockcypher.com/v1/btc/main</p>
                <p> 
                    <a href={this.props.latestBlock ? this.props.latestBlock.latest_url : ''} target="_blank">
                        Latest block url from http://api.blockcypher.com/v1/btc/main
                    </a>
                </p>
             

          
                

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
