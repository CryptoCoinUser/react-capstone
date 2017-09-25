import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getUnconfirmedAddress } from '../src/actions/index';

const middlewares = [thunk] 
const mockStore = configureStore(middlewares)

it('should test syncronous actions', () => {
  const store = mockStore({})

  return store.dispatch(getUnconfirmedAddress())
    .then(() => {
      const actions = store.getActions()
      expect(actions[0].type).toEqual('GET_UNCONFIRMED_ADDRESS_SUCCESS')
    })
})