import * as actions from '../actions/index';

const initialState = {
	currentUser: null,
	latestBlock: null
};

export const blockReducer = (state=initialState, action) => {
	if(action.type === actions.FETCH_LATEST_BLOCK_SUCCESS){
		console.log('reducer FETCH_LATEST_BLOCK_SUCCESS');
		console.log(action.response);
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
	}

	return state;

}