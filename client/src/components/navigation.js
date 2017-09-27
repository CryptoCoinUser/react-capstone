import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as Cookies from 'js-cookie';
import * as actions from '../actions/index';

const Navigation = props => {

    const logout = e => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            props.dispatch(
                actions.logoutCurrentUser(accessToken)
            )
        }
    }

    console.log("props", props)
    
    const buildLinks = [{route: '/demo', text: "Demo"}, {route: '/app', text: 'App'}].map((link, i) => {
        const selected = link.route == props.location.pathname
            ? 'selected'
            : ""
        return <li key={i} className={selected}><Link to={link.route}>{link.text}</Link></li> 
    })



    let buttons
       props.currentUser
        ? buttons = <button onClick={(e => logout(e))}>Logout</button>
        : buttons = <form action="/api/auth/google">
                            <button className="btn btn-success" type="submit">Login with Google</button>
                    </form>
    let links;
       props.currentUser
        ? links = <ul>{buildLinks}</ul>
        : links = ""

    return (
        <nav>
            <span className="logo">Watch My Address</span>
            {links}
            <span className="login-logout">{buttons}</span>
            <div className="clr"></div>
        </nav>
    )
}

const mapStateToProps = state => ({
    currentUser: state.currentUser
}) 

export default connect(mapStateToProps)(Navigation)



















