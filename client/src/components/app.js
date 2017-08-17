import React from 'react';
import * as Cookies from 'js-cookie';
import LoginPage from './login-page';
import AddressesPage from './addresses-page';
import axios from 'axios';

import {connect} from 'react-redux';
import * as actions from '../actions/index';



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            latestBlockHeight: 0
        };
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        // hit /api/isuserloggedin
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.isUserLoggedIn(accessToken)
            )
        }
        this.props.dispatch(
            actions.fetchLatestBlock()
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

 

    render() {
        if(!this.props.currentUser){
            return <LoginPage />;
        }
        return (
            <div className="app">
                <p><a href="#" onClick={(e => this.logout(e))}>logout</a></p>
                <h2>client / src / components / app.js </h2>
                <AddressesPage />
                <p><strong>{this.props.latestBlock ? this.props.latestBlock.height : ''}:</strong> Block height from http://api.blockcypher.com/v1/btc/main</p>
                
                <p> 
                    <a href={this.props.latestBlock ? this.props.latestBlock.latest_url : ''} target="_blank">
                        Latest block url from http://api.blockcypher.com/v1/btc/main
                    </a>
                </p>
                <p>
                    
                    <button id="getLatestBlockHeight">Get Latest Block Height</button>
                    {this.props.latestBlock.height}

                </p>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    latestBlock: state.latestBlock,
    latestBlockHeight: state.latestBlockHeight
    
})

export default connect(mapStateToProps)(App);
