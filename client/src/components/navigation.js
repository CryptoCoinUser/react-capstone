import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';
import * as actions from '../actions/index';




class Navigation extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // if(accessToken) {
        //     this.props.dispatch(
        //         actions.getWatchedAddresses(accessToken)
        //     )
        // }
    }

    logout(e) {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.logoutCurrentUser(accessToken)
            )
        }
    }

    render() {

        return (
         
                <nav>
                    <ul>
                        <li><a>Demo</a></li>
                        <li><a>App</a></li>
                        <li className='button'>{this.props.currentUser ? 
                            <button onClick={(e => this.logout(e))}>Logout</button>    
                            : <form action="/api/auth/google">
                                    <button className="btn btn-success" type="submit">Login with Google</button>
                                </form> 
                            }
                        </li>
                    </ul>
                    <div className="clr"></div>
                </nav>
            
        );
    }
}

// connect this component to the store
const mapStateToProps = state => ({
   currentUser: state.currentUser 
})

export default connect(mapStateToProps)(Navigation)



















