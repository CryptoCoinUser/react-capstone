import * as actions from '../actions/index';

const initialState = {
	currentUser: null,
	latestBlock: null,
	randomAddress: null,
	randomAddressError: null,
	deleteAddressError: null,
	addresses: [],
	email: 'Your email - if you want to set up notifications'
};

export const blockReducer = (state=initialState, action) => {
	if(action.type === actions.FETCH_LATEST_BLOCK_SUCCESS){
		return {
			...state,
			latestBlock: action.response
		}
	}else if(action.type === actions.IS_USER_LOGGED_IN_SUCCESS){
		console.log('action.user', action.user)
		return {
			...state,
			currentUser: action.user.googleId,
			email: action.user.email || 'Your email - if you want to set up notifications'
		}
	}else if(action.type === actions.LOGOUT_CURRENT_USER_SUCCESS){
		return {
			...state,
			currentUser:null
		}
	} else if(action.type === actions.GET_UNCONFIRMED_ADDRESS_SUCCESS){
		return {
			...state,
			randomAddress: action.data[0].outputs[0].addresses[0]
		}
	} else if(action.type === actions.GET_UNCONFIRMED_ADDRESS_ERROR) {
		return {
			...state,
			randomAddressError: 'Error, probably too many requests: BlockCypher API allows only 3 per second or 200 per hour. Quota freshes at the top of the hour'
		}
	} else if(action.type === actions.SEND_ADDRESSES_TO_REDUCER) {
		return {
			...state,
			addresses: action.addresses.addressesInfo
		}
	} else if(action.type === actions.SEND_ADDRESS_TO_REDUCER) {
		return {
			...state,
			addresses: [...state.addresses, action.address],
			randomAddress: ''
		}
	} else if(action.type === actions.DELETE_ADDRESS_ERROR){
		return {
			...state,
			deleteAddressError: 'error deleting address'
		}
	} else if(action.type === actions.DELETE_ADDRESS_SUCCESS){
		return {
			...state,
			addresses: state.addresses.filter(addressObj => {
				return addressObj.address != action.address;
			})
		}

	} else if (action.type === actions.SAVE_OR_UPDATE_EMAIL_SUCCESS){
		console.log('action', action)
		return {
			...state,
			email: action.email
		}
	}


	return state;

}