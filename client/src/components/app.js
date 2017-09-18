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
        this.saveOrUpdateEmail = this.saveOrUpdateEmail.bind(this);
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
        this.props.dispatch(
            actions.updateApiLeft()
        )

    }

    refreshApiLeft(e) {
        e.preventDefault();
        this.props.dispatch(
            actions.updateApiLeft()
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
            myAddressNote = "Address saved on " + moment(Date.now()).format("YYYY-MM-DD, HH:mm")
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

    saveOrUpdateEmail(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const accessToken = Cookies.get('accessToken');
         if(accessToken) {
            this.props.dispatch(
                actions.saveOrUpdateEmail(accessToken, email)
            )
        }
        this.emailInput.value = "";
        console.log('this.props', this.props);

    }


    render() {

        if(!this.props.currentUser){
            return <LoginPage />;
        }
        const addrBaseUrl = 'http:\//api.blockcypher.com/v1/btc/main/addrs/';
        const addrLiveBaseURL = 'https:\//live.blockcypher.com/btc/address/'
        return (
            
            <div id="main">            
                <h2>Add Bitcoin Address</h2>
                <div id="addAddressesWrapper">
                    <div id="randomAddressWrapper">
                        <h4>Add a random address (from some recent transaction) to watch list</h4>
                        
                        <button id="getRandomAddress"
                            onClick={(e => this.getUnconfirmedAddress(e))}
                         >
                            Get Random Address
                        </button>
                        <div id="randomAddressAndButton">
                            <span id="randomAddress"><a href={addrLiveBaseURL + this.props.randomAddress}>{this.props.randomAddress}</a></span>
                            {this.props.randomAddress ?
                                <button id="watchRandomAddress"
                                    onClick = {(e => this.saveRandomAddress(e))} 
                                    > Watch This Address
                                </button>
                                : ""

                            }
                        </div>
                        {this.props.randomAddressError}
                    </div>


                    <form id="myAddressForm">
                        <h4>Add a specific address to watch list</h4>
                        <input type="text" placeholder="Paste address" id="myAddress" size="40" 
                        ref={ref => this.myAddressInput = ref} />
                        <input type="text" placeholder="Note" id="myAddressNote" size="20" 
                        ref={ref => this.myAddressNoteInput = ref} />
                        <button id="watchMyAddress" 
                            onClick={this.saveMyAddress}
                        >Watch My Address</button>
                    </form>
                </div>

                <h2>Address Watch List</h2>
                <AddressesPage />


                <div id="notificationEmail">
                    <form>
                        <input type ="email" size="50" placeholder={this.props.email} ref={ref => this.emailInput = ref} />
                        <button id="saveOrUpdateEmail" onClick = {(e => this.saveOrUpdateEmail(e))}>Save / Update Email</button>
                    </form>
                
               </div>

                {/*
                <h4>Bitcoin network status:</h4>
                <p><strong>{this.props.latestBlock ? this.props.latestBlock.height : ''}:</strong> Block height from http://api.blockcypher.com/v1/btc/main</p>
                <p> 
                    <a href={this.props.latestBlock ? this.props.latestBlock.latest_url : ''} target="_blank">
                        Latest block url from http://api.blockcypher.com/v1/btc/main
                    </a>
                </p>
                */}

          
                <div id="apiCounter">
                    <p>API Limitation: 200 requests per hour. {this.props.apiLeft.hits} of 200 left</p>
                    <p>API Limitation: 200 hooks per hour. {this.props.apiLeft.hooks} of 200 left</p>
                    <button id="refreshRemaining" onClick={(e => this.refreshApiLeft(e))}>Refresh Remaning API Calls</button>

                </div>
                <p id="logout"><a href="#" onClick={(e => this.logout(e))}>logout</a></p>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    latestBlock: state.latestBlock,
    latestBlockHeight: state.latestBlockHeight,
    randomAddress: state.randomAddress,
    randomAddressError: state.randomAddressError,
    email: state.email,
    apiLeft: state.apiLeft 
})

export default connect(mapStateToProps)(App);
