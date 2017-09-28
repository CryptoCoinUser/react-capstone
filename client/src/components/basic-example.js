import React from 'react'
import {connect} from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


import LoginPage from './login-page';
import App from './app';
import Demo from './demo';
import Navigation from './navigation';


import * as Cookies from 'js-cookie';
import * as actions from '../actions/index';

export class BasicExample extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        console.log('this.props.addresses', this.props.addresses);
        const accessToken = Cookies.get('accessToken');
        
        if(accessToken) {
           console.log('accessToken');
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
                </div>
            </Router>
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