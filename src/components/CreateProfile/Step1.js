import React from 'react';
import PropTypes from 'prop-types'
import { Form } from 'antd';
import Dropzone from "react-dropzone";
import Button from '../Button'
import InputWithTT from "../InputWithTT";
import InputDateWithToolTip from "../InputDateWithTT";
import SelectWithTT from "../SelectWithTT";
import {message} from 'antd';

import UploadPhotoImage from "../../img/uploadPhoto.png"
import SocialAuth from "../SocialAuth";

const FormItem = Form.Item;

class Step1Form extends React.Component{
    state = {
        avatar: "",
        facebookLink: "",
        googleLink: ""
    };

    componentDidMount() {
        if (this.props.data.avatar)
            this.setState({avatar: this.props.data.avatar});
        if (this.props.data.facebookLink)
            this.setState({facebookLink: this.props.data.facebookLink});
        if (this.props.data.googleLink)
            this.setState({googleLink: this.props.data.googleLink});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {avatar, facebookLink, googleLink} = this.state;
                const fields = {
                    ...values,
                    avatar: avatar,
                    facebookLink: facebookLink,
                    googleLink: googleLink,
                };

                this.props.onSubmit(fields);
                this.props.onNext();
            }
            else
                console.log(err);
        });
    };

    handleChangeAvatar = (files) => {
        this.props.uploadFile(files[0])
            .then((res) => {
                this.setState({avatar: res.data.file[0].url});
                message.success("Фото загружено");
            })
            .catch((err) => console.log(err));
    };

    handleChangeSocial = (name, valuesObj) => {
        const {getFieldValue, setFieldsValue} = this.props.form;
        const {avatar} = this.state;

        if (valuesObj.link) {
            return this.props.onSocialNetworkCheck(valuesObj.link, name)
                .then((res) => {
                    if (res && res.data && !res.data.error) {
                        this.setState({[name + 'Link']: valuesObj.link});

                        const checkableFields = ['name', 'email'];
                        checkableFields.forEach(item => {
                            if (!getFieldValue(item) && valuesObj[item])
                                setFieldsValue({[item]: valuesObj[item]});
                        });

                        if (!avatar && valuesObj.avatar)
                            this.setState({avatar: valuesObj.avatar});
                    }

                    return res;
                })
                .catch(err => console.log(err));
        }
        else {
            this.setState({[name + 'Link']: valuesObj.link});
            return new Promise(resolve => resolve({data: {}}));
        }
    };

    render(){
        const { interestsList, professionsList, countriesList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { avatar, facebookLink, googleLink } = this.state;

        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-1">
                <div className="step-title">Личные данные</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: 'Введите ФИО, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                key="name"
                                bubbleplaceholder="*ФИО"
                                className="step-form-item"
                                tooltip="ФИО Tooltip"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('datebirth', {
                            rules: [{
                                required: true,
                                message: 'Выберите дату рождения, пожалуйста'
                            }],
                        })(
                            <InputDateWithToolTip
                                key="datebirth"
                                bubbleplaceholder="*Дата рождения"
                                className="step-form-item"
                                tooltip="Дата рождения Tooltip"
                            />
                        )}
                    </FormItem>
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('email', {
                            rules: [{
                                message: 'Введите E-mail, пожалуйста'
                            },
                                {
                                    type: "email",
                                    message: 'Неправильный формат'
                                }],
                        })(
                            <InputWithTT
                                key="name"
                                bubbleplaceholder="*E-mail"
                                className="step-form-item"
                                tooltip="E-mail Tooltip"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('phones', {
                            rules: [{
                                required: true,
                                message: 'Введите телефоны, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                key="name"
                                bubbleplaceholder="*Телефоны"
                                className="step-form-item"
                                tooltip="Телефоны Tooltip"
                            />
                        )}
                    </FormItem>
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('sex', {
                            rules: [{
                                required: false,
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                key="sex"
                                bubbleplaceholder="Пол"
                                className="step-form-item"
                                tooltip="Пол Tooltip"
                                values={["Мужской", "Женский", "Не важно"]}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('country', {
                            rules: [{
                                required: true,
                                message: 'Выберите страну пребывания, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                key="country"
                                bubbleplaceholder="*Страна пребывания"
                                className="step-form-item"
                                tooltip="Страна пребывания Tooltip"
                                values={countriesList}
                            />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    {getFieldDecorator('work', {
                        rules: [{
                            required: false,
                            message: 'Выберите сферу деятельности, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="work"
                            bubbleplaceholder="Сфера деятельности"
                            className="step-form-item"
                            tooltip="Сфера деятельности Tooltip"
                            values={professionsList}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('interests', {
                        rules: [{
                            required: false,
                            message: 'Выберите интересы, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="interests"
                            bubbleplaceholder="Интересы"
                            className="step-form-item"
                            tooltip="Интересы Tooltip"
                            mode="multiple"
                            values={interestsList}
                        />
                    )}
                </FormItem>
                <div className="step-form-row">
                    <div className="create-profile-avatar">
                        <span className="upload-avatar-title">Загрузи сюда свою крутую аву: </span>
                        <Dropzone multiple={false} onDrop={this.handleChangeAvatar} className="react-dropzone-avatar">
                            {avatar ?
                                <img src={avatar} alt="avatar" className="avatar-image"/> :
                                <img src={UploadPhotoImage} alt="avatar" className="avatar-image"/>}
                        </Dropzone>
                        <span className="upload-avatar-photo-click">Нажми на фотоаппарат, чтобы загрузить фото</span>
                    </div>
                    <div className="create-profile-avatar">
                        <span className="upload-avatar-title">Привяжи свои социалки: </span>
                        <div className="profile-social">
                            <SocialAuth
                                facebookLink={facebookLink}
                                googleLink={googleLink}
                                onChange={this.handleChangeSocial}
                            />
                        </div>
                    </div>
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

const Step1 = Form.create({
    mapPropsToFields(props) {
        let fields = {};
        for (let key in props.data){
            if (key !== 'current'){
                fields[key] = Form.createFormField({
                    value: props.data[key],
                })
            }
        }
        return fields;
    },
})(Step1Form);


Step1.propTypes = {
    urlForget: PropTypes.string,
    urlRegistration: PropTypes.string,
    onSubmit: PropTypes.func,
    onSocialNetworkCheck: PropTypes.func,
    checkEmailAvailability: PropTypes.func
};

Step1.defaultProps = {
    urlForget: '',
    urlRegistration: '',
    onSubmit: () => {},
    onSocialNetworkCheck: () => {},
    checkEmailAvailability: () => {}
};

export default Step1
