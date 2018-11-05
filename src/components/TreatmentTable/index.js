import React from 'react';
import PropTypes from 'prop-types'

import TreatmentTableItem from '../TreatmentTableItem'
import Card from '../Card'
import Icon from '../Icon'
import './style.css'
import '../../icon/style.css'
import Spinner from "../Spinner";
import PerfectScrollbar from "react-perfect-scrollbar";
import Button from "../Button";
import ReviewsModal from "../ReviewsModal";
import HomeworkList from "../HomeworkList";

class TreatmentTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            max: 7,
            old: 0,
            data: [],
            loading: false,
            showReviewModal: false
        };
    }
    treatmentRender = (dataArr) => {
        let historyArr = [];
        if(!dataArr || !dataArr.length && !this.state.loading) {
            return <div className='entry-list'>{this.props.isUser ? "Приёмов нет" : "Обращений нет"}</div>
        } else {
            historyArr = dataArr.map((item, index) => {
                return (<TreatmentTableItem {...item}
                                    onGotoChat = {this.props.onGotoChat}
                                    onGoto={this.props.onGoto}
                                    data={this.props.data}
                                    key={index}
                                    isUser = {this.props.isUser}
                                    showReviewModal={this.showReviewModal}
                                    addConclusion = {this.props.addConclusion}
                                    refresh = {this.refresh}
                                    makeArchiveOfFiles = {this.props.makeArchiveOfFiles}



                />)
            });
        }
        if(this.props.dataCount > dataArr.length && !this.state.loading) {
            historyArr.push(
                <div className="table-footer"
                     key="btn">
                    <Button btnText='Показать еще'
                            size='link'
                            type='link'
                            title='Показать ещё'
                            icon='circle_arrow_down'
                            onClick={this.loadMore}/>
                </div>
            );
        } else if(this.state.loading){
            historyArr.push(
                <div className="table-footer"
                     key="btn">
                    <Spinner size="small" />
                </div>)
        }
        return historyArr;
    };

    componentDidMount() {
        this.getApps();
    }

    refresh = () => {
        this.setState({refresh:true});
        let obj = {...this.state};
        obj.max = this.state.data.length;
        obj.old = 0;
        this.props.getCompletedApps(obj)
    };
    loadMore = () => {
        this.setState({old: this.state.old+this.state.max}, ()=> {
            this.getApps()
        })
    };

    getApps = () => {
        this.setState({loading: true});
        let obj ={
            ...this.state,
        };
        this.props.getCompletedApps(obj).then(()=> {
            this.setState({loading: false});
        })
    };
    showReviewModal = (obj) => {
        this.setState({dataForReview: obj, showReviewModal: true})
    };
    componentWillReceiveProps(newProps) {
        if (newProps.data.length && this.state.refresh) {
            this.setState({data: newProps.data, refresh: false})
        } else if (newProps.data.length && newProps.data !== this.props.data) {
            this.setState({data: [...this.state.data, ...newProps.data]})
        }
    }

    render(){
        return (
            <div className='treatment-all'>
                <Card title={this.props.isUser ? "Прошедшие приемы" : "Актуальные обращения" }

                        extra={<div className='go-to' onClick={this.props.redirect}>
                            <Icon svg size={16} type="order-form" /> <span>Все обращения</span>
                        </div>}>
                    <PerfectScrollbar
                        speed={1}
                        contentClassName="content"
                        horizontal={true}
                    >
                                <div className="tableheader">
                                    <div className="flex-col"><div className="tableheader-name">{this.props.isUser ? "Врач" : "Имя пациента"}</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Дата приема</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Предварительное заключение</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Комментарий к приему</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Стоимость</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Заключение</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Отзыв</div></div>
                                    <div className="flex-col"><div className="tableheader-name">Файлы</div></div>
                                </div>

                        {this.treatmentRender(this.state.data)}

                        </PerfectScrollbar>

                  </Card>
                <ReviewsModal
                    visible={this.state.showReviewModal}
                    onSubmit ={this.props.onSubmitReview}
                    info = {this.state.dataForReview}
                    onCancel={()=>this.setState({showReviewModal:false})}
                    refresh={this.refresh}
                />
            </div>
        )
    }
}

TreatmentTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    onGoto: PropTypes.func,
    onGotoChat: PropTypes.func,
};

TreatmentTable.defaultProps = {
    data: [],
    onGoto: () => {},
    onGotoChat: () => {},
};

export default TreatmentTable
