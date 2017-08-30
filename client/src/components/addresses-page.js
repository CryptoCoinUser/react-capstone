import React from 'react';
import * as Cookies from 'js-cookie';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../actions/index';


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
        console.log("ADDRESSES", this.props.addresses)
        const addresses = this.props.addresses.map((addressObj, index) =>
            <li className="addressObj" key={index}>
                <button
                    onClick={e => this.deleteAddress(e, addressObj)}
                >
                    Delete X
                </button>
                <span> </span>
                <span className="address">{addressObj.address}</span> 
                <span className="balance">{addressObj.balance / 100000000}</span>  
                <span className="unconfirmed_balance">{addressObj.unconfirmed_balance / 100000000}</span>  
                <span className="random">{addressObj.random}</span>  
                <span className="note">{addressObj.note}</span> 

            </li>
        );
        

        return (
            <div className="addresses">
                <h3>client / src / components / question-page.js</h3>
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



















