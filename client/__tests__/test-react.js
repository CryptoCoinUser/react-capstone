import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';


import chai from 'chai';

const should = chai.should();

import {blockReducer} from '../src/reducers/index';

import {BasicExample} from '../src/components/basic-example';
import {Navigation} from '../src/components/navigation';
import {LoginPage} from '../src/components/login-page';
import {App} from '../src/components/app';
import {AddressesPage} from '../src/components/addresses-page';




/*
https://facebook.github.io/react/docs/shallow-renderer.html
*/
import ShallowRenderer from 'react-test-renderer/shallow';

const renderer = new ShallowRenderer();
renderer.render(<BasicExample />);
const result = renderer.getRenderOutput();
expect(result.type).toBe('div');
//expect(result.props.children).length.toEqual(4);


/*
const initialState = {key: 'value'};
const store = createStore(initialState);

component = TestUtils.renderIntoDocument(
  <Provider store={store(initialState)}>
    {() => <SideMenu />}
  </Provider>
);
*/
const initialState = {key: 'value'};
const store = createStore(blockReducer);


it('renders without crashing', () => {
  const props = {
  	dispatch: ()=> {},
  	addresses: []
  }

  const renderer = new ShallowRenderer();
  renderer.render(
	  <Provider store={store}>
	  	<BasicExample {...props} />
	  </Provider>
  );


  const result = renderer.getRenderOutput();
  console.log(result)

});



/* https://courses.thinkful.com/react-001v2/project/1.1.9 
import ShallowRenderer from 'react-test-renderer/shallow';

*/


describe('BasicExample component', function() {
    it('Renders the BasicExample',  function() {
       
        const renderer = new ShallowRenderer();
        renderer.render(<BasicExample />);
        const result = renderer.getRenderOutput();
        result.props.className.should.equal('nav-and-content-wrapper');
		//console.log(result);
        //const routerWrapper = result.props.children[0];
        //routerWrapper.type.should.equal('div');
        // img.props.src.should.equal(url);
        // img.props.alt.should.equal(description);

        // const p = result.props.children[1];
        // p.type.should.equal('p');
        // p.props.children.should.equal(description);
    });
});
/**/
describe('Navigation component', function() {
    it('Renders the Navigation',  function() {
    	const location = {
    		pathname: '/demo'
    	}
     
        const renderer = new ShallowRenderer();
        renderer.render(<Navigation location={location} />);
        const result = renderer.getRenderOutput();
        console.log('Navigation', result);

        result.type.should.equal('nav');

        const nav = result.props.children[0];
        nav.type.should.equal('span');
        result.props.children[0].props.className.should.equal('logo');

    });
});




describe('LoginPage component', function() {
    it('Renders the LoginPage',  function() {
     
        const renderer = new ShallowRenderer();
        renderer.render(<LoginPage />);
        const result = renderer.getRenderOutput();
        // console.log('LoginPage:', result);
        

    });
});




describe('App component', function() {
    it('Renders the App',  function() {

        const renderer = new ShallowRenderer();
        renderer.render(<App />);
        const result = renderer.getRenderOutput();
        console.log('App', result);

        // result.type.should.equal('nav');

        // const nav = result.props.children[0];
        // nav.type.should.equal('span');
        // result.props.children[0].props.className.should.equal('logo');

    });
});



describe('AddressesPage component', function() {
    it('Renders the AddressPage',  function() {

    	const addresses = ['hello'];

        const renderer = new ShallowRenderer();
        renderer.render(<AddressesPage addresses={addresses} />);
        const result = renderer.getRenderOutput();
        console.log('AddressesPage', result);

         result.type.should.equal('div');
         result.props.className.should.equal('address-list');

         const childrenAddresses = result.props.children[0];
         console.log('childrenAddresses', childrenAddresses)	
         //childrenAddresses.type.should.equal('Object');
        // result.props.children[0].props.className.should.equal('logo');

    });
});







