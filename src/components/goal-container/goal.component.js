import React from 'react';

class  GoalComponent extends React.Component {

    state = {
        showButton: false
    }
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.wrapperRef = React.createRef();
    }

    componentDidMount () {
        document.body.addEventListener('click', this.closeEditGoal)
    }

    componentWillUnmount () {
        document.body.removeEventListener('click', this.closeEditGoal)
    }

    closeEditGoal = (event) => {
        if (this.wrapperRef && this.wrapperRef.current && this.wrapperRef.current.contains(event.target)) {
        }else {
            this.setState((previousState) => {
                return {showButton: false}
            })
        }
    }

    handleKeyDown(event){
        if(event.key.toLowerCase() === 'enter') {
            event.preventDefault()
            return false;
        }
    }

    handleKeyUp(event){
        if(event.key.toLowerCase() === 'enter') {
            this.updateGoal(event);
        }
    }

    updateGoal(event) {
        console.log("button click");
        event.stopPropagation();
        this.props.editGoal(this.myRef.current.innerText);
        this.setState((previousState) => {
            return {showButton: false}
        })
        // document.body.click();
    }

    updateSelectedGoalId(event){
        this.setState((previousState) => {
            return {showButton: true}
        })
        this.props.selectGoal(this.props.id);
    }

    render() {
        return (
            <div >
                <div 
                    className="each-goal-container"
                >
                    <div ref={this.myRef}
                        contentEditable={true}
                        onClick={(event) => this.updateSelectedGoalId(event)}
                        onKeyDown={(event) =>this.handleKeyDown(event)}
                        onKeyUp={(event) =>this.handleKeyUp(event)}
                        suppressContentEditableWarning={true}
                        className="goal-name-edit">
                        {this.props.goal}
                    </div>
                        { this.state.showButton && 
                            <div className="ripple add-goal-button" onClick={(event) => this.updateGoal(event)} ref={this.wrapperRef}>But</div>
                        }
                </div>
            </div>
        );
    }
}

export default GoalComponent;
