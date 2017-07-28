import React from 'react';
import * as Cookies from 'js-cookie';
import axios from 'axios';


export default class AddressesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: []
        };
    }

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        fetch('/api/questions', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(questions =>
            this.setState({
                questions
            })
        );
    }

    render() {
        const questions = this.state.questions.map((question, index) =>
            <li key={index}>{question}</li>
        );

        return (
            <div className="question">
                <h3>client / src / components / question-page.js</h3>
                <ul className="question-list">
                    {questions}
                </ul>
            </div>
        );
    }
}























