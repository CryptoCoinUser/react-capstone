import React from 'react';

import QuestionPage from './question-page';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        
    }

    render() {
        

        return <QuestionPage />;
    }
}

export default App;
