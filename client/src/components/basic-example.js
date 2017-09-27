import React from 'react'
import {connect} from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


import LoginPage from './login-page';
import App from './app';


const BasicExample = () => (
  <Router>
    <div className="nav-and-content-wrapper">
      <nav>
        <ul>
          <li className="login-demo"><Link to="/login-demo">Login / Demo</Link></li>
          <li className="app"><Link to="/app">App</Link></li>
          <li className="login-logout">
               <button onClick={(e => this.logout(e))}>Logout</button>    
               <form action="/api/auth/google">
                      <button className="btn btn-success" type="submit">Login with Google</button>
               </form> 
                              
          </li>
        </ul>
      </nav>

      <Route exact path="/login-demo" component={LoginPage}/>
      <Route path="/app" component={App}/>
    </div>
  </Router>
)


const mapStateToProps = state => ({
   currentUser: state.currentUser 
})

export default connect(mapStateToProps)(BasicExample) 