import React from 'react';
import PropTypes from 'prop-types'
import { Form } from 'antd';
import Button from '../Button'
import Hr from '../Hr'
import Upload from '../Upload'
import DropZoneUpload from '../DropZoneUpload'
import SelectNew from "../SelectNew";
import InputNew from "../InputNew";
import InputWithTT from "../InputWithTT";
import InputDateWithToolTip from "../InputDateWithTT";
import SelectWithTT from "../SelectWithTT";
import Dropzone from "react-dropzone";
import UploadPhotoImage from "../../img/uploadPhoto.png";
import VK, {Auth} from "react-vk";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class Step2Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        /*this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let toSubmit = {
                    ...values,
                    ...this.state,
                };
                this.props.onSubmit(toSubmit);
                this.props.onNext();
            }
        })*/
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
            this.props.onSubmit(values);
            this.props.onNext();
            // }
        })
    };

    /*handleGoBack = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            let fields = {
                ...values,
                ...this.state,
            };
            console.log("FIELDS WHEN BACK TO 1", fields)
            this.props.onSubmit(fields);
            this.props.onPrev();
        })
    };*/

    increaseStateNum = (e, type) => {
        e.preventDefault();
        this.setState(prev =>
            ({[type]: prev[type] +1}))
    };


    render(){
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-2">
                <div className="step-title">Уровень подготовки</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('subject', {
                            rules: [{
                                required: true,
                                message: 'Выберите дисциплину, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Дисциплина"
                                className="step-form-item"
                                values={["Вокал", "Гитара"]}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('specialization', {
                            rules: [{
                                required: true,
                                message: 'Выберите специализацию, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Специализация"
                                className="step-form-item"
                                values={["Мужской", "Женский"]}
                            />
                        )}
                    </FormItem>
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('level', {
                            rules: [{
                                required: true,
                                message: 'Выберите ваш уровень подготовки, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Мой уровень подготовки"
                                className="step-form-item"
                                values={["Низкий", "Средний", "Высокий"]}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('exp', {
                            rules: [{
                                required: true,
                                message: 'Выберите опыт занятия музыкой, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Опыт занятия музыкой"
                                className="step-form-item"
                                values={["1 год", "2 года", "3 года", "4 года", "5 лет"]}
                            />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    {getFieldDecorator('goals', {
                        rules: [{
                            required: true,
                            message: 'Выберите цели, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="1"
                            bubbleplaceholder="Цели"
                            className="step-form-item"
                            mode="multiple"
                            values={["Играть в группе", "Подбирать на слух"]}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('style', {
                        rules: [{
                            required: true,
                            message: 'Выберите стиль музыки, который вам нравится, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            bubbleplaceholder="Стиль музыки, который мне нравится"
                            className="step-form-item"
                            values={["зарубежная поп-музыка", "отечественная поп-музыка",
                                "зарубежная рок-музыка", "отечественная рок-музыка"]}

                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('favArtist', {
                        rules: [{
                            required: true,
                            message: 'Укажите любимых исполнителей, пожалуйста'
                        }],
                    })(
                        <TextArea
                            label="Любимые исполнители"
                            placeholder=""
                            className="step-form-item"
                        />
                    )}
                </FormItem>

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

const Step2 = Form.create({
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
})(Step2Form);

Step2.propTypes = {
    urlForget: PropTypes.string,
    urlRegistration: PropTypes.string,
    academicDegree: PropTypes.array,
    academicTitle: PropTypes.array,
    langs: PropTypes.array,
    payments: PropTypes.array,
    onSubmit: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func
};

Step2.defaultProps = {
    urlForget: '',
    urlRegistration: '',
    academicDegree: [],
    academicTitle: [],
    langs: [],
    payments: [],
    onSubmit: () => {},
    onNext: () => {},
    onPrev: () => {}
};

export default Step2
