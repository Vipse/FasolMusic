import React from 'react';
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Card from '../Card'
import Button from '../Button'
import PerfectScrollbar from "react-perfect-scrollbar";

import './style.css'
import '../../icon/style.css'
import HistoryReceptionsItems from "../HistoryReceptionsItems";
import Spinner from "../Spinner";
import ReviewsModal from "../ReviewsModal";
import HomeworkList from "../HomeworkList";

class HistoryReceptions extends React.Component{
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

    historyRender = (dataArr) => {
        let historyArr = [];
        if (!dataArr.length && !this.state.loading) {
            return <div className="table-footer"
                        key="btn">
                <Button btnText={'Нет приёмов. Нажмите чтобы обновить.' }
                        size='link'
                        type='link'
                        icon={'circle_close'}
                        onClick={() => this.getApps()}
                />
            </div>
        } else {
            historyArr = dataArr.map((item, i) => {
                 return(<HistoryReceptionsItems {...item}
                                                personalPage={this.props.personalPage}
                                                onGotoChat={this.props.onGotoChat}
                                                isUser={this.props.isUser}
                                                key={i}
                                                showReviewModal={this.showReviewModal}
                                                onAddFiles={this.props.onAddFiles}
                                                refresh={this.refresh}
                                                addConclusion = {this.props.addConclusion}
                                                makeArchiveOfFiles = {this.props.makeArchiveOfFiles}

                 />)
            });
        }
        if(this.props.appsBetweenCount > dataArr.length && !this.state.loading) {
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

    showReviewModal = (obj) => {
        this.setState({dataForReview: obj, showReviewModal: true})
    };

    loadMore = () => {
        this.setState({old: this.state.old+this.state.max}, ()=> {
            this.getApps()
        })
    };

    componentDidMount() {
        this.getApps();
    }


    refresh = () => {
        this.setState({refresh:true});
        let obj = {...this.state};
        obj.max = this.state.data.length;
        obj.old = 0;
        this.props.id_doc ? obj.id_doc = this.props.id_doc : this.props.id_user ? obj.id_user = this.props.id_user : null;
        this.props.getApps(obj)
    };

    componentWillReceiveProps(newProps) {

        if (newProps.data.length && this.state.refresh) {
            this.setState({data: newProps.data, refresh: false})
        } else if (newProps.data.length && newProps.data !== this.props.data) {
            this.setState({data: [...this.state.data, ...newProps.data]})
        }
    }

    getApps = () => {
        this.setState({loading: true});
        let obj ={
            ...this.state,
        };
        this.props.id_doc ? obj.id_doc=this.props.id_doc: this.props.id_user ? obj.id_user=this.props.id_user : null;
        this.props.getApps(obj).then(()=> {
            this.setState({loading: false});
        })
    };

    render(){
        return (
            <div className='receptions-personal-page'>
                <Card title="История приёмов">
                    <PerfectScrollbar
                    horizontal = {true}>
                        <div className="tableheader">
                            <div className="flex-col"><div className="receptions-status new">Новые</div></div>
                            <div className="flex-col"><div className="receptions-status topical">Актуальные</div></div>
                            <div className="flex-col"><div className="receptions-status completed">Завершенные</div></div>
                            <div className="flex-col"><div className="receptions-status extra">Экстренные</div></div>
                        </div>
                        <div className="tableheader menu-header">
                            <div className="flex-col"><div className="tableheader-name">Дата приема</div></div>
                            <div className="flex-col"><div className="tableheader-name">Предварительное заключение</div></div>
                            <div className="flex-col"><div className="tableheader-name">Комментарий к приему</div></div>
                            <div className="flex-col"><div className="tableheader-name">Стоимость</div></div>
                            <div className="flex-col"><div className="tableheader-name">Заключение</div></div>
                            <div className="flex-col"><div className="tableheader-name">Отзыв</div></div>
                            <div className="flex-col"><div className="tableheader-name">Файлы</div></div>
                        </div>
                    {this.historyRender(this.state.data)}
                    </PerfectScrollbar>
                  </Card>
                <ReviewsModal
                    visible={this.state.showReviewModal}
                    onSubmit ={this.props.onSubmit}
                    info = {this.state.dataForReview}
                    onCancel={()=>this.setState({showReviewModal:false})}
                    refresh={this.refresh}
                />
            </div>
        )
    }
}

HistoryReceptions.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    limit: PropTypes.number,
    onGotoChat: PropTypes.func,
};

HistoryReceptions.defaultProps = {
    data: [],
    limit: 7,
    onGotoChat: () => {},
};

export default HistoryReceptions
