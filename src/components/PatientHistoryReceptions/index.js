import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import ScrollArea from 'react-scrollbar'
import PatientHistoryReceptionsItem from '../PatientHistoryReceptionsItem'
import Card from '../Card'
import Button from '../Button'
import DatePicker from '../DatePicker'
import Icon from '../Icon'

import './style.css'
import '../../icon/style.css'

class PatientHistoryReceptions extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            range: [],
            limit: this.props.limit,
            limitedShow: true,
            periodReceptions: [],
            topicalReceptions: [],
            completedReceptions: [],
            upcomingReceptions: [],
            currentTab: 'all'
        };
    }

    // отзывы должны быть размещены в соответствии с: чем меньше id, тем раньше он был опубликован

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.length !== this.props.data.length) {
            this.setState(prev => ({
                range: [],
                periodReceptions: [],
                limitedShow: true,
            }));
            this.sortHistoryReceptions();
        }
    }
    renderShowMoreBtn = (revArr) => {
        if (this.state.limit < revArr.length && this.state.limitedShow) {
            return (
                <div className="table-footer"
                     key="btn">
                    <Button btnText='Показать еще'
                            size='link'
                            type='link'
                            title='Показать ещё'
                            icon='circle_arrow_down'
                            onClick={() => this.setState(prev => ({limitedShow: false}))}/>
                </div>)
        }
    };

    historyRender = (dataArr) => {
        let historyArr = [];
        const arr = (this.state.periodReceptions.length || this.state.range.length)
            ? this.state.periodReceptions : dataArr;
        arr.map((item, i) => {
            if (this.state.limit > i || !this.state.limitedShow) {
                historyArr.push(<PatientHistoryReceptionsItem {...item} key={'histRecept' + i}/>)
            }
        });
        historyArr.push(this.renderShowMoreBtn(arr));
        return historyArr;
    };

    render(){
        const rootClass = cn('patient-receptions-all');

        return (
            <div className={rootClass}>
                <Card title="История приемов">
                    <ScrollArea
                            speed={1}
                            className="scroll"
                            contentClassName="content"
                    >
                        <div className="tableheader">
                            <div className="flex-col"><div className="patient-receptions-status new">Новые</div></div>
                            <div className="flex-col"><div className="patient-receptions-status topical">Актуальные</div></div>
                            <div className="flex-col"><div className="patient-receptions-status completed">Завершенные</div></div>
                            <div className="flex-col"><div className="patient-receptions-status extra">Экстренные</div></div>
                        </div>
                        <div className="tableheader menu-header">
                            <div className="flex-col"><div className="tableheader-name">Дата приема</div></div>
                            <div className="flex-col"><div className="tableheader-name">диагноз</div></div>
                            <div className="flex-col"><div className="tableheader-name">Комментарий</div></div>
                            <div className="flex-col"><div className="tableheader-name">стоимость</div></div>
                            <div className="flex-col"><div className="tableheader-name">заключение</div></div>
                            <div className="flex-col"><div className="tableheader-name">отзыв</div></div>
                            <div className="flex-col"><div className="tableheader-name"></div></div>
                        </div>
                        {this.historyRender(this.props.data)}
                    </ScrollArea>
                  </Card>
            </div>
        )
    }
}

PatientHistoryReceptions.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    limit: PropTypes.number,
};

PatientHistoryReceptions.defaultProps = {
    data: [],
    limit: 7,
};

export default PatientHistoryReceptions