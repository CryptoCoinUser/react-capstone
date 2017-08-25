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
        this.props.dispatch(
            actions.deleteAddress(address)
        )
    }

    render() {
        const addresses = this.props.addresses.map((address, index) =>
            <li key={index}>{address} 
                <button
                    onClick={e => this.deleteAddress(e, address)}
                >
                    Delete X
                </button>
            </li>
        );
        

        return (
            <div className="addresses">
                <h3>client / src / components / question-page.js</h3>
                <ul className="address-list">
                    {addresses}
                </ul>
                <table>
                    <thead>
                        <tr>
                            <th>
                                Receiving Address
                            </th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1HANDCODEDMJ37CY8hcCsUVafa8XjDsdCn</td>
                            <td>"pending, 80% confidence"</td>
                        </tr>
                        <tr>
                            <td>1HANDCODEDFdQGW3q6ceBkb2HrZgKiH7tm</td>
                            <td>"complete, 2 confirmations"</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        );
    }
}

// connect this component to the store
const mapStateToProps = state => ({
   addresses: state.addresses 
})

export default connect(mapStateToProps)(AddressesPage)



















