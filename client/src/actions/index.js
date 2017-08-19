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

export const fetchLatestBlock = () => dispatch => {
    const url = `https:\//api.blockcypher.com/v1/btc/main`;
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
    console.log('getUnconfirmedAddress action');
    const url = 'https://api.blockcypher.com/v1/btc/main/txs';
    axios(url)
    .then(res => {
        return dispatch(getUnconfirmedAddressSuccess(res.data))
    })
    .catch(error => {
        return dispatch(getUnconfirmedAddressError())
    })
};



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
