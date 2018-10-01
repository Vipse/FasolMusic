import React from 'react';
import PropTypes from 'prop-types'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Steps from '../Step'
import './style.css'
import '../../icon/style.css'
// import RegistrationComplete from "../RegistrationComplete";



class CreateProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current: 0,
        };
        this.steps = [
            {
                content: (state) => <Step1 data={state}
                                      onSubmit={(data) => this.setState({...data})}
                                      onNext={this.next}
                                      // checkEmailAvailability={this.props.onCheckEmailAvailability}
                                      // uploadFile={this.props.uploadFile}
                    />,
            },
            {
                content: (state) => <Step2 data={state}
                                           onSubmit={(data) => this.setState({...data})}
                                           onPrev = {this.prev}
                                           onNext={this.next}
                                           //uploadFile={this.props.uploadFile}
                />,
            },
            {
                content: (state) => <Step3 data = {state}
                                           onPrev = {this.prev}
                                           onNext = {this.next}
                                           onSubmit={(data) => this.setState({...data})}
                />,
            },
            {
                content: (state) => <Step4 data={state}
                                           onSubmit={(data) => this.setState({...data})}
                                           onPrev = {this.prev}
                                           onNext={this.next}
                    //uploadFile={this.props.uploadFile}
                />,
            },
            {
                content: (state) => <Step5 onPrev = {this.prev}
                                           onNext = {this.next}
                                            //finalText={this.props.finalText}
                                           onFinish={this.props.onFinish}
                                           regInProgress = {this.props.regInProgress}
                />,
            }];
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

        // if(this.props.isRegFinished) {
        //     return (
        //         <RegistrationComplete onOk={this.props.onOk} urlLogin={this.props.urlLogin} phone={"+375777777777"} isPatientReg={false}/>
        //     )
        // }
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
    // urlForget: PropTypes.string,
    // urlRegistration: PropTypes.string,
    // onFinish: PropTypes.func,
    // onCheckEmailAvailability: PropTypes.func
};

CreateProfile.defaultProps = {
    // urlForget: '',
    // urlRegistration: '',
    // onFinish: () => {},
};

export default CreateProfile
