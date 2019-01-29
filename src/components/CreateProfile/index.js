import React from 'react';
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Steps from '../Step'
import './style.css'
import '../../icon/style.css'
import {getSelectorValues} from "../../helpers/getSelectorsCustomData";

class CreateProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current: 0,
            selectorsValues: {}
        };
        this.steps = [
            {
                content: (state) => <Step1 data={state}
                                           onNext={this.next}
                                           onSubmit={(data) => this.setState({...data})}
                                           interestsList={getSelectorValues(state.selectorsValues.interestsList)}
                                           professionsList={getSelectorValues(state.selectorsValues.professionsList)}
                                           uploadFile={this.props.uploadFile}
                                            //checkEmailAvailability={this.props.onCheckEmailAvailability}
                                            //uploadFile={this.props.uploadFile}
                    />,
            },
            {
                content: (state) => <Step2 data={state}
                                           onNext={this.next}
                                           onPrev={this.prev}
                                           onSubmit={(data) => this.setState({...data})}
                                           disciplineObj={state.selectorsValues.disciplineList}
                                           goalList={getSelectorValues(state.selectorsValues.goalList)}
                                           stylesList={getSelectorValues(state.selectorsValues.stylesList)}
                />,
            },
            {
                content: (state) => <Step3 data = {state}
                                           onNext = {this.next}
                                           onPrev={this.prev}
                                           onSubmit={(data) => this.setState({...data})}
                                           qualitiesList={getSelectorValues(state.selectorsValues.qualitiesList)}
                />,
            },
            {
                content: (state) => <Step4 data={state}
                                           onNext={this.next}
                                           onPrev={this.prev}
                                           onSubmit={(data) => this.setState({...data})}
                                           onFinish={this.props.onSubmit}
                />,
            },
            {
                content: () => <Step5 onNext={this.next}
                                      urlLogin={this.props.urlLogin}
                />,
            }];
    }

    componentDidMount() {
        const {getSelectors} = this.props;
        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities', 'styles', 'professions', 'day'];

        selectorsNames.forEach((name) => {
            getSelectors(name)
                .then(res => this.setState({
                    selectorsValues: {
                        ...this.state.selectorsValues,
                        [name + "List"]: res.data
                    }}))
                .catch(err => console.log(err))
        });
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({ current });
    };

    prev = () => {
        const current = this.state.current - 1;
        this.setState({ current });
    };

    render(){
        return (
            <div className="create-profile-form">
                <Steps steps={this.steps}
                       curState={this.state}
                       current={this.state.current}
                       onNext = {this.next}
                       onPrev={this.prev}
                />
            </div>
        )
    }
}


CreateProfile.propTypes = {
};

CreateProfile.defaultProps = {
};

export default CreateProfile
