import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Hoc from '../Hoc'
import Checkbox from '../Checkbox'
import Button from '../Button'
import Hr from "../Hr";
import Spinner from "../Spinner";
import {Form} from "antd";
import SelectWithTT from "../SelectWithTT";
import InputWithTT from "../InputWithTT";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";

const FormItem = Form.Item;

class Step4Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // if (!err) {
            //
            //     let fields = {
            //         ...values,
            //         avatarThumb: this.state.avatarThumb ? this.state.avatarThumb : this.props.data.avatarThumb
            //     };
            //     if(!values.avatar.url && !values.avatar.name) {
            //         fields.avatar = {name: this.state.avatarName, url: this.state.avatarUrl};
            //     }
            console.log({...this.props.data, ...values});
            //this.props.onSubmit(values);
            this.props.onNext();
            // }
        })
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-4">
                <div className="step-title">Удобное время занятий</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        <div className='radio-label'>Количество дней в неделю:
                            {getFieldDecorator('daysCount', {
                                rules: [{ required: true,
                                    message: 'Выберите количество дней, пожалуйста' }],
                            })(
                                <RadioGroup>
                                    <Radio value='1'>1</Radio>
                                    <Radio value='2'>2</Radio>
                                    <Radio value='3'>3</Radio>
                                    <Radio value='4'>4</Radio>
                                    <Radio value='5'>5</Radio>
                                    <Radio value='5+'>5 и более</Radio>
                                </RadioGroup>
                            )}
                        </div>
                    </FormItem>
                    <FormItem>
                        <div className='radio-label'>Время:
                            {getFieldDecorator('timeSchedule', {
                                rules: [{ required: true,
                                    message: 'Выберите время, пожалуйста' }],
                            })(
                                <RadioGroup>
                                    <Radio value='Mon'>Пн</Radio>
                                    <Radio value='Tue'>Вт</Radio>
                                    <Radio value='Wed'>Ср</Radio>
                                    <Radio value='Thu'>Чт</Radio>
                                    <Radio value='Fri'>Пт</Radio>
                                    <Radio value='Sat'>Сб</Radio>
                                    <Radio value='Sun'>Вс</Radio>
                                </RadioGroup>
                            )}
                        </div>
                    </FormItem>
                </div>

                <div className="steps-action">
                    <Button htmlType="submit"
                            btnText='Продолжить'
                            size='large'
                            type='pink'/>
                </div>
            </Form>
        )
    }
}

const Step4 = Form.create({
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
})(Step4Form);

Step4.propTypes = {
    data: PropTypes.object,
    onFinish: PropTypes.func,
};

Step4.defaultProps = {
    data: {},
    onFinish: () => {}
};

export default Step4
