import React from 'react'
import {connect} from 'react-redux';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'


import LoginPage from './login-page';
import AboutBitcoin from './about-bitcoin';
import App from './app';
import Demo from './demo';
import Navigation from './navigation';


import * as Cookies from 'js-cookie';
import * as actions from '../actions/index';

export class BasicExample extends React.Component {

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        
        if(accessToken) {
            this.props.dispatch(
                actions.isUserLoggedIn(accessToken)
            )
            this.props.dispatch(
                actions.getWatchedAddresses(accessToken)
            )
        }
        this.props.dispatch(
            actions.fetchLatestBlock()
        )
        this.props.dispatch(
            actions.updateApiRemaining()
        )
    }



  render() {
      

      return (
          <div className="nav-and-content-wrapper">
            <Router>
                <div className="router-wrapper">
                    <Route path="/" component={Navigation}/>            
                    <Route exact path="/" component={LoginPage}/>
                    <Route path="/app" component={App}/>
                    <Route path="/demo" component={Demo}/>
                    <Route path="/about-bitcoin" component={AboutBitcoin}/>
                </div>
            </Router>
            <div id="github">
                <p><i className="fa fa-github" aria-hidden="true"></i>
                    <span> </span>
                    <a href="https://github.com/CryptoCoinUser/react-capstone">Fork Me on GitHub</a>
                </p>
            </div>
          </div>
    ) // return
  } // render
} // class


const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    latestBlock: state.latestBlock,
    latestBlockHeight: state.latestBlockHeight,
    randomAddress: state.randomAddress,
    randomAddressError: state.randomAddressError,
    email: state.email,
    apiRemaining: state.apiRemaining,
    addresses: state.addresses
})

export default connect(mapStateToProps)(BasicExample) 