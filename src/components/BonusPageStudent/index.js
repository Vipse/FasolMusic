import React from 'react';
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import inviteFriendsPic from "../../img/inviteFriendsPic.png";
import moment from "moment";
import Spinner from "../Spinner";

class BonusPageStudent extends React.Component {

    state = {
        loadingPromo: true
    };

    componentDidMount() {
        this.props.onGetPromoList()
            .then(res => this.setState({loadingPromo: false}))
            .catch(err => console.log(err));
    }

    renderPromoItem = (promoItem) => {
        const {news_date, header, news_short, news_long, id} = promoItem;
        return (<div className="offers-item" key={id}>
            <div className='offers-item-header'>
                <div className="date">
                    <div className="day">{moment(+news_date * 1000).format('DD MMM')}</div>
                    <div className="year">{moment(+news_date * 1000).format('YYYY')}</div>
                </div>
                <div className="title">
                    {header}
                </div>
            </div>
            <div className="offers-item-body">
                <div className="info">
                    {news_short}
                </div>
                <div className="link" onClick={() => {console.log('open promo ' + id)}}>Подробнее</div>
            </div>
        </div>);
    };

    render() {
        const {promoList} = this.props;
        const {loadingPromo} = this.state;
        console.log(promoList);

        return (
            <div className="bonus-student">
                <Card className="offers" title="Акции">
                    {loadingPromo ? <Spinner/> :
                        promoList && promoList.length ? <PerfectScrollbar>
                            {promoList.map((promoItem) => this.renderPromoItem(promoItem))}
                        </PerfectScrollbar> : <div className='entry-list no-trainings'>Акций нет</div>}
                </Card>
                <Card className="second-subscription" title="1+1">
                    <div className="second-subscription-container">
                        <p className="title">Купите абонемент на вторую дисциплину</p>
                        <p className="info">
                            Купите абонемент на вторую дисциплину и получите +1 тренировку на баланс!
                        </p>
                    </div>
                </Card>

                <Card className="referLink" title="Быстрая реакция">
                <div className="referLink-column">
                    <p className="title">Купите абонемент после пробной тренировки</p>
                    <p className="info">
                        Покупайте абонемент сразу после пробной тренировки и получайте +1 тренировку на баланс!
                    </p>
                </div>
            </Card>

                <Card className="invite" title="Совместная прокачка">
                    <img src={inviteFriendsPic}/>
                    <p className="title">Пригласите друга и получите бонус</p>
                    <p className="info">Не упустите возможность: пригласите друга и получите +1 тренировку себе
                        и +1 тренировку своему другу!
                    </p>
                </Card>
            </div>
        )
    }
}

BonusPageStudent.propTypes = {
    paymentData: PropTypes.object,
    onSubmit: PropTypes.func
};

BonusPageStudent.defaultProps = {
    paymentData: {},
    onSubmit: () => {}
};

export default BonusPageStudent
