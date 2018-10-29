import React from 'react';
import PropTypes from 'prop-types'
import { Form, message } from 'antd';
import Dropzone from "react-dropzone";
import Button from '../Button'
import InputWithTT from "../InputWithTT";
import InputDateWithToolTip from "../InputDateWithTT";
import SelectWithTT from "../SelectWithTT";


import UploadPhotoImage from "../../img/uploadPhoto.png"
import vkIcon from "../../img/vkIcon.png"
import facebookIcon from "../../img/facebookIcon.png"
import twitterIcon from "../../img/twitterIcon.png"
import gplusIcon from "../../img/gplusIcon.png"

const FormItem = Form.Item;

const mappedIconsToLinks = {
    vk: vkIcon,
    facebook: facebookIcon,
    twitter: twitterIcon,
    gplus: gplusIcon
};


class Step1Form extends React.Component{
    state = {
        fileList: [],
        avatarUrl: "",
        avatarThumb: "",
        vkAuthorized: {show: false, link: ''},
        facebookAuthorized: {show: false, link: ''},
        twitterAuthorized: {show: false, link: ''},
        gplusAuthorized: {show: false, link: ''}
    };

    handleSubmit = (e) => {
        
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("handleSubmit", values);
            if (!err) {
            
                // let fields = {
                //     ...values,
                //     avatarThumb: this.state.avatarThumb ? this.state.avatarThumb : this.props.data.avatarThumb
                // };
                // if(!values.avatar.url && !values.avatar.name) {
                //     fields.avatar = {name: this.state.avatarName, url: this.state.avatarUrl};
                // }
                this.props.onSubmit({...values, ...this.state});
                this.props.onNext();
            }
        })
    };

    handleChange = (info) => {
        const reader = new FileReader();
        this.setState({ loading: true });
        this.props.uploadFile(info.file)
            .then((res) => {
                this.setState({avatarUrl: res.data.file[0].url, avatarName: res.data.file[0].name});
                message.success("Фото загружено")
            });
        reader.addEventListener('load', () => this.setState({
            avatarThumb: reader.result,
            loading: false
        }));
        reader.readAsDataURL(info.file);
    };

    onPrev = (e) => {
        e.preventDefault();
        this.props.onPrev();
    }

    onDrop = (file) => {
        console.log(file);
        const reader = new FileReader();
        // this.props.uploadFile(info.file)
        //     .then((res) => {
        //         this.setState({avatarUrl: res.data.file[0].url, avatarName: res.data.file[0].name});
        //         message.success("Фото загружено")
        //     });
        reader.addEventListener('load', () => this.setState({
            avatarThumb: reader.result,
            loading: false
        }));
        reader.readAsDataURL(file[0]);
    };

    facebookAuthorization = () => {
        return null;
    };

    gplusAuthorization = () => {
        return null;
    };

    renderSocial = (name) => {
        return (<div key={name}>
            <div className={"social-row " + name}>
                <img src={mappedIconsToLinks[name]} className="social-row-icon"/>
                <span className="social-row-link">{this.state[name + "Authorized"].link}</span>
                {this.state[name + "Authorized"].link || this.state[name + "Authorized"].show ?
                    <Button className="social-row-btn-close"
                            icon='close'
                            size='small'
                            type='link'
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({[name + "Authorized"]: {show: false, link: ""}})
                            }}
                    />
                    : <Button className="social-row-btn-link"
                              btnText='Связать'
                              size='small'
                              type='bright-blue'
                              onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({[name + "Authorized"]: {show: true, link: ""}})
                              }}
                    />
                }
            </div>
            <div className="authPopup">
                {this.state[name + "Authorized"].show && this[name + "Authorization"]()}
            </div>
        </div>);
    };

    render(){
        const { getFieldDecorator } = this.props.form;

        const avatarUrl = this.state.avatarThumb ? this.state.avatarThumb : this.props.data.avatarThumb ? this.props.data.avatarThumb : "";
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
                        {getFieldDecorator('fio1', {
                            rules: [{
                                required: true,
                                message: 'Введите ФИО, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                key="fio"
                                bubbleplaceholder="* ФИО"
                                className="step-form-item"
                                tooltip="ФИО Tooltip"

                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('birthDate', {
                            rules: [{
                                message: 'Выберите дату рождения, пожалуйста'
                            }],
                        })(
                            <InputDateWithToolTip
                                key="birthday"
                                bubbleplaceholder="Дата рождения"
                                className="step-form-item"
                                tooltip="Дата рождения Tooltip"


                            />
                        )}
                    </FormItem>
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('gender', {
                            rules: [{
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                key="gender"
                                bubbleplaceholder="Пол"
                                className="step-form-item"
                                tooltip="Пол Tooltip"
                                values={["Мужской", "Женский"]}

                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('country', {
                            rules: [{
                                message: 'Выберите страну пребывания, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                key="country"
                                bubbleplaceholder="Страна пребывания"
                                className="step-form-item"
                                tooltip="Страна пребывания Tooltip"
                                values={["Беларусь", "Россия"]}

                            />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    {getFieldDecorator('activityField', {
                        rules: [{
                            message: 'Выберите сферу деятельности, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="activityField"
                            bubbleplaceholder="Сфера деятельности"
                            className="step-form-item"
                            tooltip="Сфера деятельности Tooltip"
                            values={["Сфера деятельности 1", "Сфера деятельности 2", "Сфера деятельности 3"]}

                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('interests', {
                        rules: [{
                            message: 'Выберите интересы, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="interests"
                            bubbleplaceholder="Интересы"
                            className="step-form-item"
                            tooltip="Интересы Tooltip"
                            mode="multiple"
                            values={["Спорт", "Кино и сериалы"]}

                        />
                    )}
                </FormItem>
                <div className="step-form-row">
                    <div className="create-profile-avatar">
                        <span className="upload-avatar-title">Загрузи сюда свою крутую аву: </span>
                        <Dropzone multiple = {false} onDrop = {this.onDrop} className="react-dropzone-avatar">
                            {avatarUrl ?
                                <img src={avatarUrl} alt="avatar" className="avatar-image"/> :
                                <img src={UploadPhotoImage} alt="avatar" className="avatar-image"/>}
                        </Dropzone>
                        <span className="upload-avatar-photo-click">Нажми на фотоаппарат, чтобы загрузить фото</span>
                    </div>
                    <div className="create-profile-avatar">
                        <span className="upload-avatar-title">Привяжи свои социалки: </span>
                        {this.renderSocial("facebook")}
                        {this.renderSocial("gplus")}
                    </div>

                    {/*<div className="create-profile-social">
                        <div id="vk_auth"></div>

                    </div>
                    <script type="text/javascript" src="https://vk.com/js/api/openapi.js?159"></script>
                    <script type="text/javascript">
                        {VK.init({apiId: 6695055})}
                    </script>
                    <script type="text/javascript">
                        {VK.Widgets.Auth("vk_auth", {"onAuth" : "function(data) {alert('user '+data['uid']+' authorized');}"})}
                    </script>*/}
                </div>

                <div className="steps-action">
                    <Button onClick={this.onPrev}
                                btnText='Назад'
                                size='large'
                                type='pink'
                                />     
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
})(Step1Form);


Step1.propTypes = {
    urlForget: PropTypes.string,
    urlRegistration: PropTypes.string,
    onSubmit: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    checkEmailAvailability: PropTypes.func
};

Step1.defaultProps = {
    urlForget: '',
    urlRegistration: '',
    onSubmit: () => {},
    onNext: () => {},
    onPrev: () => {},
    checkEmailAvailability: () => {}
};

export default Step1
