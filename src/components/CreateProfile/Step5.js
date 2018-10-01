import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Hoc from '../Hoc'
import Checkbox from '../Checkbox'
import Button from '../Button'
import Hr from "../Hr";
import Spinner from "../Spinner";
import {Form} from "antd";

class Step5Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    finishHandler = () => {
        let data = this.props.data;
        for (let key in data) {
            if (!data[key]) {
                delete data[key]
            }

        }
        this.props.onFinish(data);
    };

    render(){
        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-5">
                <div className="step-title">Спасибо!</div>
                <div className="step-note">
                    <p>Ваша заявка отправлена.</p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="steps-action">
                    <Button htmlType="submit"
                            btnText='Завершить'
                            size='large'
                            type='pink'/>

                </div>
            </Form>
        )
    }
}

const Step5 = Form.create({
    mapPropsToFields(props) {
        let fields ={};
        for (let key in props.data){
            if (key !== 'current'){
                fields[key] = Form.createFormField({
                    value: props.data[key],
                })
            }
        }
        return fields;
    },
})(Step5Form);

Step5.propTypes = {
    data: PropTypes.object,
    onFinish: PropTypes.func,
};

Step5.defaultProps = {
    data: {},
    onFinish: () => {}
};

export default Step5
