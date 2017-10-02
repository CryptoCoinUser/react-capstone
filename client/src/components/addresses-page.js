import React from 'react';
import * as Cookies from 'js-cookie';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import moment from 'moment';


export class AddressesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {  }

    deleteAddress(e, addressObj){
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
            alert('Please first setup your email for notifications. The email setup form is at the bottom of the Address Watch List');
            return
        }
        if(accessToken) {
            this.props.dispatch(
                actions.emailMeAboutThisAddress(accessToken, addressObj.address, this.props.email)
            )
        }
    }

    refreshThisAddress(e, addressObj){
        e.preventDefault();
        // action with address
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.refreshThisAddress(accessToken, addressObj.address, addressObj.recentTxn)
            )
        }
    }

    render() {
        const confideceBaseURL = 'https:\//live.blockcypher.com/btc/tx/';
        const txBaseURL = 'https:\//api.blockcypher.com/v1/btc/main/txs/';
        const addrBaseUrl = 'http:\//api.blockcypher.com/v1/btc/main/addrs/';
        const addrLiveBaseURL = 'https:\//live.blockcypher.com/btc/address/';
        const webhookIdBaseURL = 'https:\//api.blockcypher.com/v1/btc/main/hooks/';
        const token = '?token=03016274b5814976af645d94b4cdd1d0';

      
        const addresses = this.props.addresses.reverse().map((addressObj, index) =>

            <section className="addressObj" key={index}>
                <header>
                    <span className="address"><a href={addrLiveBaseURL + addressObj.address}>{addressObj.address}</a>
                       <button className="delete btn btn-danger"
                        onClick={e => this.deleteAddress(e, addressObj)}
                        >
                        Delete from List <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    </span> 
                    <span className="note">
                        { 
                            (!(addressObj.random) || (addressObj.random == "false")) ?  <i className="fa fa-sticky-note-o" aria-hidden="true"></i> 
                            : <i className="fa fa-random" aria-hidden="true"></i> 
                        }
                        <span></span>
                        { 
                            (!(addressObj.random) || (addressObj.random == "false")) ?  addressObj.note  
                            : "Random Address Saved On " + moment(addressObj.savedOn).format("YYYY-MM-DD, HH:mm") 
                        }
                    </span>
                </header>
                <div className="balancesInfo"> 
                    <span className="balance">{addressObj.balance / 100000000} <i className="fa fa-btc" aria-hidden="true"></i></span> 
                    <span className="unconfirmed_balance">{addressObj.unconfirmed_balance / 100000000} <i className="fa fa-btc" aria-hidden="true"></i></span>
                    <span className="lastUpdated">
                        {moment(addressObj.lastUpdated).format("YYYY-MM-DD, HH:mm:ss")} 
                        <button className="refresh btn btn-default" onClick={e => this.refreshThisAddress(e, addressObj)}><i className="fa fa-refresh" aria-hidden="true"></i> Refresh</button>
                    </span>
                </div>
                 <div className="emailMe">
                    {
                        addressObj.webhookId ? <span className="webhookId"><a href={webhookIdBaseURL + addressObj.webhookId + token}>{addressObj.webhookId}</a></span>
                        : <button className="emailMe btn btn-default" onClick={e => this.emailMeAboutThisAddress(e, addressObj)}>
                        <i className="fa fa-envelope-o" aria-hidden="true"></i> Email Me Updates about this Address
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
                                <a href={confideceBaseURL + addressObj.recentTxn} target='_blank' title="View BlockCypher's confidence that this transaction will confirm; opens in new tab">
                                View BlockCypher confidence in this transaction
                                </a>
                              </span>
                          </div>
                    }
                </div>
                <div className="clr"></div>

            </section>
        );
        

        return (
           
                <div className="address-list">
                    {addresses}
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



















