import React from 'react';
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import inviteFriendsPic from "../../img/inviteFriendsPic.png";
import moment from "moment";
import Spinner from "../Spinner";

class BonusPageCoach extends React.Component {

    state = {
        loadingPromo: true,
        openedPromos: []
    };

    componentDidMount() {
        this.props.onGetPromoList()
            .then(res => this.setState({loadingPromo: false}))
            .catch(err => console.log(err));
    }

    copyLink = (e) => {
        const textField = document.createElement('textarea');
        if (this.state.refLink) {
            textField.innerText = this.state.refLink;
            document.body.appendChild(textField);
            textField.select();
            document.execCommand('copy');
            textField.remove();
        }
    };

    addOpenedPromo = (id) => {
        const {openedPromos} = this.state;
        this.setState({
            openedPromos: [...openedPromos, id]
        })
    };

    renderPromoItem = (promoItem) => {
        const {news_date, header, news_short, news_long, id} = promoItem;
        const {openedPromos} = this.state;
        const isOpened = openedPromos.indexOf(id) !== -1;

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
                    {isOpened ? news_long : news_short}
                </div>
                {!isOpened ? <div className="link" onClick={() => this.addOpenedPromo(id)}>Подробнее</div> : null}
            </div>
        </div>);
    };

    render() {
        const {promoList} = this.props;
        const {loadingPromo} = this.state;

        return (
            <div className="bonus-coach">
                <Card className="offers" title="Акции">
                    {loadingPromo ? <Spinner/> :
                        promoList && promoList.length ? <PerfectScrollbar>
                            {promoList.map((promoItem) => this.renderPromoItem(promoItem))}
                        </PerfectScrollbar> : <div className='entry-list no-trainings'>Акций нет</div>}
                </Card>
                <Card className="second-subscription" title="Заголовок карточки">
                    <div className="second-subscription-container">
                        <p className="title">Купи абонемент на вторую дисциплину</p>
                        <p className="info">
                            Тот получит 1 бесплатное занятие если оплатят, а препод получит денежное вознаграждение
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                            eligendi harum hic neque porro recusandae.
                        </p>
                    </div>
                </Card>

                <Card className="referLink" title="Реферальная ссылка">
                    <div className="referLink-column">
                        <p className="title">Скиньте ссылку потенциальному новому клиенту</p>
                        <p className="info">
                            Приводите новых клиентов и получайте 100% оплаты за первый месяц обучения!
                            А бонусом для клиента будет +1 бесплатная тренировка! Правда приятно?! 😉
                        </p>
                        <InputNew className="input" bubbleplaceholder="Ссылка" onChange={(e) => this.setState({refLink: e.target.value})} onPressEnter={this.copyLink}/>
                        <Button className="copyBtn"
                                btnText='Скопировать'
                                onClick={this.copyLink}
                                size='default'
                                type='light-pink'
                        />
                    </div>
                </Card>

                <Card className="invite" title="Пригласи друзей">
                    <img src={inviteFriendsPic}/>
                    <p className="title">Пригласи друга и получи бонус</p>
                    <p className="info">Приглашайте друзей и знакомых на работу к нам,
                        и получайте 20% от оплаты его первого клиента,
                        а мы получаем нового коуча!
                        Правда хорошая командная работа?! 💪
                    </p>
                </Card>
            </div>
        )
    }
}

BonusPageCoach.propTypes = {
    paymentData: PropTypes.object,
    onSubmit: PropTypes.func
};

BonusPageCoach.defaultProps = {
    paymentData: {},
    onSubmit: () => {}
};

export default BonusPageCoach
