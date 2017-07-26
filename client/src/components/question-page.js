import React from 'react';
import axios from 'axios'


export default class QuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: ['hello', 'yes']
        };
        this.multiplyInput = this.multiplyInput.bind(this);
        this.getRepoInfo = this.getRepoInfo.bind(this);
    }

    componentDidMount() {

    }

   multiplyInput() {
        const numFromInput = this.numInput.value;
        const numFromInput2 = this.numInput2.value;
        // let lastProduct = Number(this.state.questions[this.state.questions.length -1]);
        // console.log(lastProduct);
       axios.post('/api/multiply', {num:numFromInput, num2:numFromInput2})
       .then(response => {
            this.setState({
                questions:[... this.state.questions, response.data.product]

            })
            console.log(this.state.questions);
       })
       .catch(error => console.log(error));


    }


    getRepoInfo() {
        const githubRepo = this.githubRepo.value;
        const githubUser = this.githubUser.value;
       axios.post('/api/github', {githubUser, githubRepo})
       .then(response => {
            console.log(response);
            this.setState({
                questions:[...this.state.questions, response.data]

            })
            console.log(this.state.questions);
       })
       .catch(error => console.log(error));


    }

    // add an input field that lets the user put in a number to multiply */}

    render() {
        const questions = this.state.questions.reverse().map((question, index) =>
            <li key={index}>{question}</li>
        );

        return (
            <form>
                <ul className="question-list">
                    {questions}
                </ul>
                <input type="number" ref={ref => this.numInput = ref} placeholder="a number" />
                <br />
                <input type="number" ref={ref => this.numInput2 = ref} placeholder="another number"  />
                <button type="button" onClick={this.multiplyInput}>Multiply</button>
                <hr />
                <input type="text" ref={ref => this.githubUser = ref} placeholder="github user" />
                /
                <input type="text" ref={ref => this.githubRepo = ref} placeholder="github repo"  />
                <button type="button" onClick={this.getRepoInfo}>Get Repo Info</button>
            </form>

        );
    }
}























