import React from 'react';
import Demo from './demo';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';


export const LoginPage = props => {
    console.log('props', props);
    if(props.currentUser){
        return <Redirect to='/app' />
    }

    return ( 
          <Demo /> 
    	)
}

const mapStateToProps = state => ({
    currentUser: state.currentUser
}) 

export default connect(mapStateToProps)(LoginPage)
