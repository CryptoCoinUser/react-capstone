import React from 'react';
import * as Cookies from 'js-cookie';
import axios from 'axios';


export default class AddressesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: []
        };
    }

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        fetch('/api/addresses', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(addresses =>
            this.setState({
                addresses
            })
        );
    }

    render() {
        const addresses = this.state.addresses.map((question, index) =>
            <li key={index}>{question}</li>
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























