import React from 'react';
import * as Cookies from 'js-cookie';
import LoginPage from './login-page';
import AddressesPage from './addresses-page';
import axios from 'axios';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        // hit /api/isuserloggedin
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            axios.get('/api/isuserloggedin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(res => {
                this.setState({
                    currentUser: res.data.googleId
                })
            })
        }
    }


    // check if authorized
        // not login
        // if yes Question

    render() {
        if(!this.state.currentUser){
            return <LoginPage />;
        }
        return (
            <div className="app">
                <h2>client / src / components / app.js </h2>
                <AddressesPage />
                <p><a href="/api/auth/logout">logout</a></p>
            </div>
        )
    }
}

export default App;
