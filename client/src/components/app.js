import React from 'react';
import * as Cookies from 'js-cookie';
import LoginPage from './login-page';
import AddressesPage from './addresses-page';
import axios from 'axios';

import {connect} from 'react-redux';
import * as actions from '../actions/index';
import moment from 'moment';


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
                actions.saveAddress(accessToken, this.props.randomAddress, true)
            )
        }
        // error handling if no access token
    }

    saveMyAddress(e) {
        e.preventDefault();

        const myAddress     = this.myAddressInput.value;
        let myAddressNote = this.myAddressNoteInput.value;
        if(!myAddressNote){
            myAddressNote = "saved on " + moment(Date.now()).format("YYYY-MM-DD, HH:mm")
        }

        const accessToken = Cookies.get('accessToken');


        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(accessToken, myAddress, false, myAddressNote)
            )
        }
         this.myAddressInput.value = "";
         this.myAddressNoteInput.value = "";
    }


    render() {

        if(!this.props.currentUser){
            return <LoginPage />;
        }
        return (
            <div className="app">
                <p id="logout"><a href="#" onClick={(e => this.logout(e))}>logout</a></p>
                <h2>Add Bitcoin Address</h2>
                <div id="randomAddressDiv">
                    <h4>Add a random address (from a not-yet-confirmed transaction) to watch list</h4>
                    
                    <button id="getRandomAddress"
                        onClick={(e => this.getUnconfirmedAddress(e))}
                     >
                        Get Random Address
                    </button>
                    <div id="randomAddressAndButton">
                        {this.props.randomAddress} <span> </span> 
                        {this.props.randomAddress ?
                            <button id="watchRandomAddress"
                                onClick = {(e => this.saveRandomAddress(e))} 
                                > Watch Random Address
                            </button>
                            : ""

                        }
                    </div>
                    {this.props.randomAddressError}
                </div>


                <form id="myAddressForm">
                <h4>Add a specific address to watch list</h4>
                    <input type="text" placeholder="Paste address" id="myAddress" size="50" 
                    ref={ref => this.myAddressInput = ref} />
                    <input type="text" placeholder="Note" id="myAddressNote" size="20" 
                    ref={ref => this.myAddressNoteInput = ref} />
                    <button id="watchMyAddress" 
                        onClick={this.saveMyAddress}
                    >Watch My Address</button>
                </form>

                <h2>Watch List</h2>
                <AddressesPage />

                {/*
                <h4>Bitcoin network status:</h4>
                <p><strong>{this.props.latestBlock ? this.props.latestBlock.height : ''}:</strong> Block height from http://api.blockcypher.com/v1/btc/main</p>
                <p> 
                    <a href={this.props.latestBlock ? this.props.latestBlock.latest_url : ''} target="_blank">
                        Latest block url from http://api.blockcypher.com/v1/btc/main
                    </a>
                </p>
                */}

          
                

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
