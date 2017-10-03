import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';

import moment from 'moment';

import { Redirect } from 'react-router-dom'

import * as actions from '../actions/index';
import AddressesPage from './addresses-page';
import {validate} from 'bitcoin-address';
 
export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saveMyAddressButtonDisabled : true,
            validAddress: ''
        }
        this.saveMyAddress = this.saveMyAddress.bind(this);
        this.saveOrUpdateEmail = this.saveOrUpdateEmail.bind(this);
        this.myAddressChanged = this.myAddressChanged.bind(this);
    }

    updateApiRemaining(e) {
        e.preventDefault();
        this.props.dispatch(
            actions.updateApiRemaining()
        )
    }



    getUnconfirmedAddress(e){
        e.preventDefault();
        this.props.dispatch(
            actions.getUnconfirmedAddress()
        )
    }

    saveRandomAddress(e){
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(accessToken, this.props.randomAddress, true)
            )
        }
        // error handling if no access token
    }

    myAddressChanged(){
        this.setState({
           saveMyAddressButtonDisabled : !this.myAddressInput.value,
           validAddress: ''
        })
    }

    saveMyAddress(e) {
        e.preventDefault();



        const myAddress     = this.myAddressInput.value;

        if(!validate(myAddress)){
            this.setState({
               validAddress: `Error: ${myAddress} is not a valid address` 
            })
            return
        }

        let myAddressNote = this.myAddressNoteInput.value;

        if(myAddress === ''){
            alert('Please first paste a bitcoin address');
            return
        }


        if(!myAddressNote){
            myAddressNote = "My address saved on " + moment(Date.now()).format("YYYY-MM-DD, HH:mm")
        }

        const accessToken = Cookies.get('accessToken');


        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(accessToken, myAddress, false, myAddressNote)
            )
        }
         this.setState({
            saveMyAddressButtonDisabled : true
         });
         this.myAddressInput.value = "";
         this.myAddressNoteInput.value = "";
    }

    saveOrUpdateEmail(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const accessToken = Cookies.get('accessToken');
         if(accessToken) {
            this.props.dispatch(
                actions.saveOrUpdateEmail(accessToken, email)
            )
        }
        this.emailInput.value = "";
    }


    render() {

        if(!this.props.currentUser){
            return <Redirect to="/" />
        }
    
        return (
            
            <div id="main">
                            
                <h2>Add Bitcoin Address</h2>
                <div id="addAddressesWrapper">
                    <div id="randomAddressWrapper">
                        <h4>Add a random address to watch list</h4>
                        
                        <button id="getRandomAddress"  className="btn btn-info" 
                            onClick={(e => this.getUnconfirmedAddress(e))}
                         >
                           <i className="fa fa-random" aria-hidden="true"></i> Get Random Address
                        </button>
                        <div id="randomAddressAndButton">
                            <span id="randomAddress"> {this.props.randomAddress} </span>
                            {this.props.randomAddress ?
                                <button id="watchRandomAddress" className="btn btn-success" 
                                    onClick={(e => this.saveRandomAddress(e))} 
                                    > <i className="fa fa-binoculars" aria-hidden="true"></i> Watch Random Address
                                </button>
                                : ""

                            }
                        </div>
                        {this.props.randomAddressError}
                    </div>


                    <form id="myAddressForm">
                        <h4>Add your address to watch list</h4>
                        <input type="text" placeholder="Paste address" id="myAddress" 
                        onChange={this.myAddressChanged}
                        ref={ref => this.myAddressInput = ref} />
                        <input type="text" placeholder="Note" id="myAddressNote"  
                        ref={ref => this.myAddressNoteInput = ref} />
                        <button id="watchMyAddress" className="btn btn-success"
                            disabled={this.state.saveMyAddressButtonDisabled}  
                            onClick={this.saveMyAddress}
                        ><i className="fa fa-binoculars" aria-hidden="true"></i> Watch My Address</button>
                        <p id="addressInvalid">{this.state.validAddress}</p>
                    </form>
                </div>
                {(this.props.addresses.length) > 0 ? 
                    <div className="wrapper">
                        <h2>Address Watch List</h2>
                        <div id="addressesWrapper">
                            <AddressesPage />
                            <div id="notificationEmail">
                                <h4>Email for Notifications about an Address</h4>
                                <form>
                                    <input type="email" id="email" placeholder={this.props.email} ref={ref => this.emailInput = ref} />
                                    <button id="saveOrUpdateEmail" className="btn btn-success"  onClick={(e => this.saveOrUpdateEmail(e))}>
                                        <i className="fa fa-floppy-o" aria-hidden="true"></i> Save / Update Email
                                    </button>
                                </form>
                            
                           </div>
                       </div>
                   </div>
                : ""}
               {(this.props.apiRemaining.hits) < 170 ?  
                   <div className="wrapper">
                        <h2>API Limits</h2>
                        <div id="apiLimits">
                            <p><strong>{this.props.apiRemaining.hits}</strong> of 200 requests remaining this hour</p>
                            <p><strong>{this.props.apiRemaining.hooks}</strong> of 200 webhooks (for email notications) remaining this hour</p>
                            <button id="refreshRemaining" className="btn btn-info"  onClick={(e => this.updateApiRemaining(e))}><i className="fa fa-refresh" aria-hidden="true"></i>  Refresh Count</button>
                            <p>BlockCypher's hourly limits renew at the top of each hour.<br /> Activity of other users of this app also counts towards the limit.<br />If limit is reached, app will stop responding until next hour.</p>
                        </div>
                    </div>
                : ""}
            </div>
        )

    }
}

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

export default connect(mapStateToProps)(App);
