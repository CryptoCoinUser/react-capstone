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
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        this.props.dispatch(
            actions.deleteAddress(addressObj.address, accessToken)
        )
    }

    render() {
        console.log("address-page.js ADDRESSES", this.props.addresses);
        const confideceBaseURL = 'https:\//live.blockcypher.com/btc/tx/';
        const addresses = this.props.addresses.map((addressObj, index) =>

            <li className="addressObj" key={index}>
                <button
                    onClick={e => this.deleteAddress(e, addressObj)}
                >
                    Delete X
                </button>
                <span> </span>
                <span className="random">{addressObj.random.toString()}</span>
                <span className="address">{addressObj.address}</span> 
                <span className="note">
                    { 
                        (!(addressObj.random) || (addressObj.random == "false")) ?  addressObj.note  
                        : "Random Address Saved On " + moment(addressObj.savedOn).format("YYYY-MM-DD, HH:mm") 
                    }
                </span> 

                <span className="lastUpdated">{moment(addressObj.lastUpdated).format("YYYY-MM-DD, HH:mm")}</span>  

                 
                <span className="balance">{addressObj.balance / 100000000}</span> 
                <span className="unconfirmed_balance">{addressObj.unconfirmed_balance / 100000000}</span>

                <span className="txn">{addressObj.recentTxn}</span>
                {   
                    addressObj.confirmed ? <span className="confirmations">{addressObj.confirmations}</span> 
                    : <div className ="unconfirmed">
                          <span className="preference">{addressObj.preference}</span>
                          <span className="confidence">
                            <a href={confideceBaseURL + addressObj.recentTxn} target='_blank'>View Confidence on BlockCypher Page &gt;&gt;</a>
                          </span>
                      </div>
                }


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
   addresses: state.addresses 
})

export default connect(mapStateToProps)(AddressesPage)



















