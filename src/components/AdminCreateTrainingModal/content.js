import React from 'react';
import {Form, message} from 'antd';
import Button from '../Button'
import Spinner from "../Spinner";
import InputNew from "../InputNew";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.params.visible !== this.props.params.visible && this.props.params.visible)
            this.setState({loading: false});
    }

    handleSaveAbonement = (e) => {
        e.preventDefault();
        const {form, params} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true});
                this.props.onSaveAbonement(params.item.timestamp, values.studentID)
            } else console.log("error", err);
        });
    };

    handleTailAbonement = () => {
        const {idTraining} = this.props.params.item;
        this.setState({loading: true});
        this.props.onTailAbonement(idTraining);
    };

    handleFreezeAbonement = () => {
        const {idSubscription} = this.props.params.item;
        this.setState({loading: true});
        this.props.onFreezeAbonement(idSubscription);
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {isAdmin, isDelete} = this.props.params;

        return ((isAdmin && !isDelete) ?
                <Form onSubmit={this.handleSaveAbonement}
                      className="AdminCreateTrainingModal">
                    <div className="fields">
                        <FormItem>
                            {getFieldDecorator('studentID', {
                                rules: [{
                                    required: true,
                                    message: 'Введите ID студента, пожалуйста'
                                }],
                            })(
                                <InputNew width="100%" bubbleplaceholder="ID студента"/>
                            )}
                        </FormItem>
                    </div>
                    {this.state.loading ? <Spinner size="large"/> :
                        <div className="submitPlate">
                            <Button className="saveBtn"
                                    btnText='Создать абонемент'
                                    size='large'
                                    type='light-pink'
                            />
                        </div>}
                </Form> :
                isDelete ?
                    <div className="AdminCreateTrainingModal">
                        {this.state.loading ? <Spinner size="large"/> :
                            <div className="submitPlate">
                                <Button className="trainBtn"
                                        btnText='Перенести тренировку в конец'
                                        size='large'
                                        type='light-pink'
                                        onClick={this.handleTailAbonement}
                                />
                                <Button className="trainBtn"
                                        btnText='Заморозить тренировку'
                                        size='large'
                                        type='light-pink'
                                        onClick={this.handleFreezeAbonement}
                                />
                            </div>}
                    </div> :
                    <div className="AdminCreateTrainingModal">
                        <p className="info">Хотите записаться к этому коучу на тренировку?</p>
                        {this.state.loading ? <Spinner size="large"/> :
                            <div className="submitPlate">
                                <Button className="saveBtn"
                                        btnText='Да'
                                        size='default'
                                        type='light-pink'
                                        onClick={this.handleSaveAbonement}
                                />
                                <Button className="saveBtn"
                                        btnText='Нет'
                                        size='default'
                                        type='light-pink'
                                        onClick={this.props.onCancel}
                                />
                            </div>}
                    </div>
        );
    }
}

const Content = Form.create()(ContentForm);

export default Content
