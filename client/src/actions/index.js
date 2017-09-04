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

export const fetchLatestBlock = () => dispatch => {
    const url = `https:\//api.blockcypher.com/v1/btc/main?token=03016274b5814976af645d94b4cdd1d0`;
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
    const url = 'https://api.blockcypher.com/v1/btc/main/txs?token=03016274b5814976af645d94b4cdd1d0';
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
        console.log('getWatchedAddresses res.data: ', res.data)
        return dispatch(sendAddressesToReducer(res.data));
    })
}

export const saveAddress = (accessToken, address, randomFlag, note = "noNote") => dispatch => {
    console.log('saveAddress randomFlag', randomFlag);
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

export const deleteAddress = (address, accessToken) => dispatch => {
    console.log('deleteAddress accessToken', accessToken);
    axios(`/api/deleteaddress/${address}`, {
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
    console.log('isUserLoggedIn accessToken:', accessToken);
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
