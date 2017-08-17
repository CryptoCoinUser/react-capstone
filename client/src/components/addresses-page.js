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
                <table>
                    <thead>
                        <th>
                            Txn
                        </th>
                        <th>
                            Receiving Address
                        </th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                9HANDCODEDf5beefecbc9fdcf00b5cb012a2705dddadfad64ac73722b36e0e83 
                            </td>
                            <td>1HANDCODEDMJ37CY8hcCsUVafa8XjDsdCn</td>
                            <td>"pending, 80% confidence"</td>
                        </tr>
                        <tr>
                            <td>
                                cHANDCODED1294ca484bb1de8bc36c7736cfef4ec50b453f067e214647d38096 
                            </td>
                            <td>1HANDCODEDFdQGW3q6ceBkb2HrZgKiH7tm</td>
                            <td>"complete, 2 confirmations"</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        );
    }
}























