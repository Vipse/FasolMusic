import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import {message} from "antd";

class FrozenTrainingChanger extends React.Component {
    state = {
        inputEnabled: false,
        loading: false,
        input: ''
    };

    onChangeInput = (input) => {
        if (input.target.value && !/[^[0-9]/.test(input.target.value))
            this.setState({input: input.target.value});
    };

    sendNewBalance = () => {
        if (this.state.input) {
            this.setState({loading: true, inputEnabled: false});
            this.props.onSaveFrozenBalance(this.state.input)
                .then(
                    res => {
                        if (res && res.data && res.data.code === 200) message.success("Изменения сохранены");
                        else message.error("Произошла ошибка, попробуйте ещё раз");
                        this.setState({loading: false, input: ''});
                    }
                )
                .catch(err => console.log(err));
        }
        else message.error("Введите число");
    };

    handleOpenInput = () => {
        this.setState({inputEnabled: true});
    };

    render() {
        const {inputEnabled, loading} = this.state;
        const {frozenCount} = this.props;

        return (
            <Card title="Изменение баланса">
                    <div className="profile-card-frozen">
                        <div className='profile-student-balance'>
                            <p>Баланс: <span className="count">{frozenCount}</span></p>
                            {inputEnabled && <InputNew
                                className="profile-student-balance-input"
                                value={this.state.input}
                                width="100%" bubbleplaceholder="Новый баланс"
                                onChange={this.onChangeInput}/>}
                        </div>
                        <div className="profile-student-balance-btn-row">
                            {loading ? <Spinner/> :
                                !inputEnabled ? <Button onClick={this.handleOpenInput}
                                    btnText='Изменить баланс'
                                    size='default'
                                    type='light-blue'
                                    /> :
                                <Button onClick={this.sendNewBalance}
                                    btnText='Сохранить'
                                    size='default'
                                    type='light-blue'
                                />}
                        </div>
                    </div>
            </Card>
        )
    }
}

FrozenTrainingChanger.propTypes = {
    frozenCount: PropTypes.number,
    onSaveFrozenBalance: PropTypes.func
};

FrozenTrainingChanger.defaultProps = {
    frozenCount: 0,
    onSaveFrozenBalance: () => {}
};

export default FrozenTrainingChanger
