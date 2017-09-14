import React from 'react';
import * as Cookies from 'js-cookie';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import moment from 'moment';


class AddressesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.getWatchedAddresses(accessToken)
            )
        }
    }

    deleteAddress(e, addressObj){
        console.log('----addressObj', addressObj)
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        this.props.dispatch(
            //actions.deleteAddressHook(addressObj.address),
            actions.deleteAddress(accessToken, addressObj.address, addressObj.webhookId)
        )
    }
    tryWebSockets(e, addressObj){
        e.preventDefault();
        this.props.dispatch(
            actions.tryWebSockets(addressObj.address, addressObj.txn)
        )
    }

    emailMeAboutThisAddress(e, addressObj) {
        e.preventDefault();
        //const myEmailAddress = this.myEmailAddress.value;
        const accessToken = Cookies.get('accessToken');
        if(this.props.email.includes('Your email - if you want to set up notifications')){
            alert('please set up email first');
            return
        }
        if(accessToken) {
            this.props.dispatch(
                actions.emailMeAboutThisAddress(accessToken, addressObj.address, this.props.email)
            )
        }
    }

    render() {
        <div id="browser-websocket">
            {/* https://.github.io/documentation/#websockets */} 
        </div>
        const confideceBaseURL = 'https:\//live.blockcypher.com/btc/tx/';
        const txBaseURL = 'https:\//api.blockcypher.com/v1/btc/main/txs/';
        const addrBaseUrl = 'http:\//api.blockcypher.com/v1/btc/main/addrs/';
        const addrLiveBaseURL = 'https:\//live.blockcypher.com/btc/address/'
        const webhookIdBaseURL = 'https:\//api.blockcypher.com/v1/btc/main/hooks/'
        const token = '?token=03016274b5814976af645d94b4cdd1d0'

        const addresses = this.props.addresses.map((addressObj, index) =>

            <li className="addressObj" key={index}>
                <span className="address"><a href={addrLiveBaseURL + addressObj.address}>{addressObj.address}</a>
                   <button className="delete"
                    onClick={e => this.deleteAddress(e, addressObj)}
                    >
                    Delete from List <span>X</span>
                </button>
                </span> 
                {/*<span className="random">{addressObj.random.toString()}</span>*/}
                
                <span className="note">
                    { 
                        (!(addressObj.random) || (addressObj.random == "false")) ?  addressObj.note  
                        : "Random Address Saved On " + moment(addressObj.savedOn).format("YYYY-MM-DD, HH:mm") 
                    }
                </span> 
                <div className="balancesInfo"> 
                    <span className="balance">{addressObj.balance / 100000000}</span> 
                    <span className="unconfirmed_balance">{addressObj.unconfirmed_balance / 100000000}</span>
                    <span className="lastUpdated">{moment(addressObj.lastUpdated).format("YYYY-MM-DD, HH:mm")}</span>
                </div>
                <div className="emailMe">
                    {
                        addressObj.webhookId ? <span className="webhookId"><a href={webhookIdBaseURL + addressObj.webhookId + token}>{addressObj.webhookId}</a></span>
                        : <button className="emailMe" onClick={e => this.emailMeAboutThisAddress(e, addressObj)}>
                        Subscribe to Email Alerts for this Address
                        </button>
                         
                    }
                    
                </div>
                <div className="txnInfo">
                    <span className="txn"><a href={txBaseURL + addressObj.recentTxn}>{addressObj.recentTxn}</a></span>
                    {   
                        addressObj.confirmed ? <span className="confirmations">{addressObj.confirmations}</span> 
                        : <div className ="unconfirmed">

                              <span className="preference">{addressObj.preference}</span>
                              <span className="confidence">

                                <a href={confideceBaseURL + addressObj.recentTxn} target='_blank' title="View BlockCypher's confidence that this transaction will confirm; opens in new tab">BlockCypher Confidence &gt;&gt;</a>
                              </span>

                              {/*<button onClick={e => this.tryWebSockets(e,addressObj)}>tryWebSockets</button>*/}
                          </div>
                    }
                </div>
                <div className="clr"></div>

            </li>
        );
        

        return (
            <div className="addresses">
                <ul className="address-list">
                    {addresses}
                </ul>
            </div>
        );
    }
}

// connect this component to the store
const mapStateToProps = state => ({
   addresses: state.addresses,
   email: state.email 
})

export default connect(mapStateToProps)(AddressesPage)



















