import React from 'react'
import PropTypes from 'prop-types'

import Button from "../Button";
import './styles.css'

class AbonementCard extends React.Component{

    render() {
        const {amount, amountTitle, lessonCost, price, currency} = this.props;

        return (
            <div className="plan">
                <div className="plan-title">
                    <div className="plan-title-number">{amount}</div>
                    <div className="plan-title-text">{amountTitle}</div>
                </div>
                <div className="plan-lessonCost">
                    <p className="plan-lessonCost-number">{lessonCost + ' ' + currency}</p>
                    <p className="plan-lessonCost-text">экономия</p>
                </div>
                <div className="plan-select">
                    <div className="plan-select-totalPrice">{price + ' ' + currency}</div>
                    <Button className="plan-select-selectBtn"
                            btnText='Выбрать'
                            onClick={this.props.showTrialModal}
                            size='small'
                            type='black'
                    />
                </div>
            </div>
        )
    }
}

AbonementCard.propTypes = {
    id: PropTypes.number,
    amount: PropTypes.number,
    amountTitle: PropTypes.string,
    lessonCost: PropTypes.number,
    price: PropTypes.number,
    currency: PropTypes.string,
    showTrialModal: PropTypes.func
};

AbonementCard.defaultProps = {
    id: 0,
    amount: 0,
    amountTitle: '',
    lessonCost: 0,
    price: 0,
    currency: 'RUB',
    showTrialModal: () => {}
};

export default AbonementCard;
