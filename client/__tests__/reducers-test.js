import { blockReducer } from '../src/reducers/index'
import { deleteAddressSuccess } from '../src/actions/index';


describe('blockReducer', () => {
	const address = 'fakeAddress';

	it('Should add new cards', () => {
        let state = {
            addresses: [{address}]
        }

        state = blockReducer(state, deleteAddressSuccess(address));

        expect(state).toEqual({
        	addresses: []
        })

     })
})
