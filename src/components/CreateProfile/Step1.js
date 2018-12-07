import React from 'react';
import PropTypes from 'prop-types'
import { Form, Upload, Icon, message } from 'antd';
import Dropzone from "react-dropzone";
import Button from '../Button'
import InputWithTT from "../InputWithTT";
import InputDateWithToolTip from "../InputDateWithTT";
import SelectWithTT from "../SelectWithTT";


import UploadPhotoImage from "../../img/uploadPhoto.png"
import facebookIcon from "../../img/facebookIcon.png"
import gplusIcon from "../../img/gplusIcon.png"
import FacebookLogin from "react-facebook-login";

const FormItem = Form.Item;

const mappedIconsToLinks = {
    facebook: facebookIcon,
    gplus: gplusIcon
};


class Step1Form extends React.Component{
    state = {
        fileList: [],
        avatarUrl: "",
        avatarThumb: "",
        facebookAuthorized: {show: false, link: ''},
        gplusAuthorized: {show: false, link: ''}
    };

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
                this.props.onSubmit({...values, ...this.state});
                this.props.onNext();
            // }
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

    responseFacebook = response => {
        console.log(response);

        this.setState({
            facebookAuthorized: {show: false, link: response.email}
        });
    };

    facebookAuthorization = () => {
        return (<FacebookLogin
            appId="2093206104069628"
            autoLoad={true}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
            size="small"
        />);
    };

    gplusAuthorization = () => {
        return null;
    };

    renderSocial = (name) => {
        return (<div key={name}>
            <div className={"social-row " + name}>
                <img src={mappedIconsToLinks[name]} className="social-row-icon"/>
                <span className="social-row-link">{this.state[name + "Authorized"].link}</span>
                {this.state[name + "Authorized"].link ?
                    <Button className="social-row-btn-link"
                            btnText='Отвязать'
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({[name + "Authorized"]: {show: false, link: ""}})
                            }}
                            size='small'
                            type='float'
                    />
                    : this.state[name + "Authorized"].show ?
                        <div className="authSocialPopup">
                            {this[name + "Authorization"]()}
                        </div>
                        : <Button className="social-row-btn-link"
                                  btnText='Связать'
                                  onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({[name + "Authorized"]: {show: true, link: ""}})
                                  }}
                                  size='small'
                                  type='float'
                        />
                }
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
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: 'Введите ФИО, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                key="name"
                                bubbleplaceholder="* ФИО"
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
                                bubbleplaceholder="Дата рождения"
                                className="step-form-item"
                                tooltip="Дата рождения Tooltip"
                            />
                        )}
                    </FormItem>
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('sex', {
                            rules: [{
                                required: true,
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                key="sex"
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
                                required: true,
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
                    {getFieldDecorator('work', {
                        rules: [{
                            required: true,
                            message: 'Выберите сферу деятельности, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="work"
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
                            required: true,
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
                        <div className="social">
                            {this.renderSocial("facebook")}
                            {this.renderSocial("gplus")}
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
    checkEmailAvailability: PropTypes.func
};

Step1.defaultProps = {
    urlForget: '',
    urlRegistration: '',
    onSubmit: () => {},
    checkEmailAvailability: () => {}
};

export default Step1
