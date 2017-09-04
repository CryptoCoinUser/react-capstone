import * as actions from '../actions/index';

const initialState = {
	currentUser: null,
	latestBlock: null,
	randomAddress: null,
	randomAddressError: null,
	deleteAddressError: null,
	addresses: []
};

export const blockReducer = (state=initialState, action) => {
	if(action.type === actions.FETCH_LATEST_BLOCK_SUCCESS){
		return {
			...state,
			latestBlock: action.response
		}
	}else if(action.type === actions.IS_USER_LOGGED_IN_SUCCESS){
		return {
			...state,
			currentUser: action.user
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
			randomAddressError: 'error getting random address, probably 429, too many requests'
		}
	} else if(action.type === actions.SEND_ADDRESSES_TO_REDUCER) {
		console.log('SEND_ADDRESSES_TO_REDUCER action.addresses.addressesInfo: ', action.addresses.addressesInfo);
		return {
			...state,
			addresses: action.addresses.addressesInfo
		}
	} else if(action.type === actions.SEND_ADDRESS_TO_REDUCER) {
		console.log('SEND_ADDRESS_TO_REDUCER action.address.random', action.address.random);
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

	}


	return state;

}