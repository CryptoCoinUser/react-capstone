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

    deleteAddress(e, address){
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        this.props.dispatch(
            actions.deleteAddress(address, accessToken)
        )
    }

    render() {
        const addresses = this.props.addresses.map((address, index) =>
            <li key={index}>
                <button
                    onClick={e => this.deleteAddress(e, address)}
                >
                    Delete X
                </button>
                <span> </span>
                {address} 
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



















