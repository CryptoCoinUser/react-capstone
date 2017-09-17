import axios from 'axios';


export const FETCH_LATEST_BLOCK_SUCCESS = 'FETCH_LATEST_BLOCK_SUCCESS';
export const fetchLatestBlockSuccess = response => ({
    type: FETCH_LATEST_BLOCK_SUCCESS,
    response
});

export const FETCH_LATEST_BLOCK_ERROR= 'FETCH_LATEST_BLOCK_ERROR';
export const fetchLatestBlockError = error => ({
    type: FETCH_LATEST_BLOCK_ERROR,
    error
});

export const IS_USER_LOGGED_IN_SUCCESS = 'IS_USER_LOGGED_IN_SUCCESS';
export const isUserLoggedInSuccess = user => ({
    type: IS_USER_LOGGED_IN_SUCCESS,
    user
});

export const LOGOUT_CURRENT_USER_SUCCESS = 'LOGOUT_CURRENT_USER_SUCCESS';
export const logoutCurrentUserSuccess = user => ({
    type: LOGOUT_CURRENT_USER_SUCCESS,
    user
});

export const GET_UNCONFIRMED_ADDRESS_SUCCESS = 'GET_UNCONFIRMED_ADDRESS_SUCCESS';
export const getUnconfirmedAddressSuccess = data => ({
    type: GET_UNCONFIRMED_ADDRESS_SUCCESS,
    data
})

export const GET_UNCONFIRMED_ADDRESS_ERROR = 'GET_UNCONFIRMED_ADDRESS_ERROR';
export const getUnconfirmedAddressError = () => ({
    type: GET_UNCONFIRMED_ADDRESS_ERROR
})

export const SEND_ADDRESSES_TO_REDUCER = 'SEND_ADDRESSES_TO_REDUCER';
export const sendAddressesToReducer = addresses => ({
    type: SEND_ADDRESSES_TO_REDUCER,
    addresses
})

export const SEND_ADDRESS_TO_REDUCER = 'SEND_ADDRESS_TO_REDUCER';
export const sendAddressToReducer = address => ({
    type: SEND_ADDRESS_TO_REDUCER,
    address
})

export const DELETE_ADDRESS_SUCCESS = 'DELETE_ADDRESS_SUCCESS';
export const deleteAddressSuccess = (address) => ({
    type: DELETE_ADDRESS_SUCCESS,
    address
})

export const DELETE_ADDRESS_ERROR = 'DELETE_ADDRESS_ERROR';
export const deleteAddressError = err => ({
    type: DELETE_ADDRESS_ERROR,
    error: err
})


export const SAVE_OR_UPDATE_EMAIL_SUCCESS = 'SAVE_OR_UPDATE_EMAIL_SUCCESS';
export const saveOrUpdateEmailSuccess = email => ({
    type: SAVE_OR_UPDATE_EMAIL_SUCCESS,
    email
})

export const EMAIL_ME_ABOUT_THIS_ADDRESS_SUCCESS = 'EMAIL_ME_ABOUT_THIS_ADDRESS_SUCCESS';
export const emailMeAboutThisAddressSuccess = addresses =>({
    type: EMAIL_ME_ABOUT_THIS_ADDRESS_SUCCESS,
    addresses
})

export const REFRESH_THIS_ADDRESS_SUCCESS = 'REFRESH_THIS_ADDRESS_SUCCESS';
export const refreshThisAddressSuccess = addresses =>({
    type: REFRESH_THIS_ADDRESS_SUCCESS,
    addresses
})

export const fetchLatestBlock = () => dispatch => {
    const url = `https://api.blockcypher.com/v1/btc/main`;
    axios(url)
    .then(res => {
        return dispatch(fetchLatestBlockSuccess(res.data))
        
        }
    )
    .catch(error => {
            return dispatch(fetchLatestBlockError(error))
        }
    );
};


export const getUnconfirmedAddress = () => dispatch => {
    const url = 'https://api.blockcypher.com/v1/btc/main/txs';
    axios(url)
    .then(res => {
        return dispatch(getUnconfirmedAddressSuccess(res.data))
    })
    .catch(error => {
        return dispatch(getUnconfirmedAddressError())
    })
};


export const getWatchedAddresses = accessToken => dispatch => {
    axios('/api/addresses', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        return dispatch(sendAddressesToReducer(res.data));
    })
}

export const saveAddress = (accessToken, address, randomFlag, note = "noNote") => dispatch => {
    axios(`/api/saveaddress/${address}/${randomFlag}/${note}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        return dispatch(sendAddressToReducer(res.data));
    })
    .catch(err => console.log(err))
}

export const refreshThisAddress = (accessToken, address, recentTxn) => dispatch => {
    axios(`/api/refreshaddress/${address}/${recentTxn}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        //console.log('refreshThisAddress res.data', res.data)
        return dispatch(refreshThisAddressSuccess(res.data));
    })
    .catch(err => console.log(err))
}


export const saveOrUpdateEmail = (accessToken, email) => dispatch => {
    axios(`/api/saveorupdateemail/${email}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        console.log('saveOrUpdateEmail res.data', res.data)
        return dispatch(saveOrUpdateEmailSuccess(res.data))
    })
    .catch(err => console.log(err));
}


export const emailMeAboutThisAddress = (accessToken, address, email) => dispatch => {
    console.log('emailMeAboutThisAddress', address);
    console.log('accessToken', accessToken)
    axios.get(`/api/webhook/${address}/${email}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        //console.log('webhook ', res)
        return dispatch(emailMeAboutThisAddressSuccess(res.data));
    })
    .catch(err => console.log(err))
}

export const deleteAddress = (accessToken, address, optinalWebHookId = null) => dispatch => {
    axios(`/api/deleteaddress/${address}/${optinalWebHookId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        return dispatch(deleteAddressSuccess(res.data));
    })
    .catch(err => {
        return dispatch(deleteAddressError(err))
    })
}

export const isUserLoggedIn = accessToken => dispatch => {
    axios('/api/isuserloggedin', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        return dispatch(isUserLoggedInSuccess(res.data));
    })
}

export const logoutCurrentUser = (accessToken) => dispatch => {
   axios.get('/api/auth/logout', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
   .then(res => {
      return dispatch(logoutCurrentUserSuccess());  
   })
}

export const tryWebSockets = (address, txn) => dispatch => {
    console.log('tryWebSockets event', event);
    // Get latest unconfirmed transactions live
    const ws = new WebSocket("ws://socket.blockcypher.com/v1/btc/main");
    //const pingEvent = { "event" : "ping" };
    let count = 0;

    ws.onmessage = function (event) {
       console.log('ws.onmessage');
      count++;
      if (count > 10) ws.close();
    }


    ws.onopen = function(event) {
    console.log('ws.onopen');
      ws.send(JSON.stringify({
        //filter: "event=unconfirmed-tx", 
        event: "unconfirmed-tx",
        address,
        tx: txn,
        confidence: 0.1,
        confirmations: 0,
        token: '03016274b5814976af645d94b4cdd1d0'
      }));
    }

    ws.onerror = function(event){
        console.log('onerror', event);
    }

}
