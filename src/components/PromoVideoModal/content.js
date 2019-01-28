import React from 'react';
import {Form, message} from 'antd';
import Button from '../Button'
import Spinner from "../Spinner";
import InputNew from "../InputNew";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        link: '',
        loading: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.visible !== this.props.visible && this.props.visible)
            this.setState({loading: false, link: this.props.profile.promovideo});
    }

    handleSavePromoLink = (e) => {
        e.preventDefault();
        const {form} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true});
                this.props.onSubmit(values.promoLink);
                this.props.onCancel();
            } else console.log("error", err);
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return <Form onSubmit={this.handleSavePromoLink}
                     className="PromoVideoModal">
            <div className="fields">
                <FormItem>
                    {getFieldDecorator('promoLink', {
                        initialValue: this.props.profile.promovideo,
                        rules: [{
                            required: false,
                            message: 'Введите ссылку на проморолик, пожалуйста'
                        }],
                    })(
                        <InputNew width="100%" bubbleplaceholder="Ссылка на Youtube"/>
                    )}
                </FormItem>
            </div>
            {this.state.loading ? <Spinner size="large"/> :
                <div className="submitPlate">
                    <Button className="trainBtn"
                            btnText='Сохранить'
                            size='default'
                            type='light-pink'
                    />
                </div>}
        </Form>
    }
}

const Content = Form.create()(ContentForm);

export default Content
