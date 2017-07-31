import React from 'react';
import * as Cookies from 'js-cookie';
import LoginPage from './login-page';
import AddressesPage from './addresses-page';
import axios from 'axios';

import {connect} from 'react-redux';
import * as actions from '../../../actions/index';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        // hit /api/isuserloggedin
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            axios.get('/api/isuserloggedin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({
                    currentUser: res.data
                })
            })
        }
    }

    logout(e) {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            axios.get('/api/auth/logout', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({
                    currentUser: null
                })
                return <LoginPage />;
            })
        }
    }

 

    render() {
        if(!this.state.currentUser){
            return <LoginPage />;
        }
        return (
            <div className="app">
                <h2>client / src / components / app.js </h2>
                <p>Fetch http://api.blockcypher.com/v1/btc/main </p>
                <AddressesPage />
                <p><a href="#" onClick={(e => this.logout(e))}>logout</a></p>
            </div>
        )
    }
}

export default App;
