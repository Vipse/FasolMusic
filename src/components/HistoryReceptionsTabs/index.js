import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import HistoryReceptionsItem from '../HistoryReceptionsItem'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'
import Tabs from '../Tabs'
import DatePicker from '../DatePicker'
import Hoc from '../Hoc'

import './style.css'
import '../../icon/style.css'
import Spinner from "../Spinner";
import ReviewsModal from "../ReviewsModal";
import PerfectScrollbar from "react-perfect-scrollbar";
const TabPane = Tabs.TabPane;

class HistoryReceptionsTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'all',
            date: {},
            filt_name: '',
            max: 7,
            old: 0,
            data: [],
            loading: false,
            rangeSet: [],
            dataForReview: {},
            showReviewModal: false,
            refresh: false
        };
        this.timer = null;
    }

    tabChangeHadler = (currentTab) => {
        let status;
        switch (currentTab) {
            case 'all': {
                status="";
                break;
            }
            case 'completed': {
                status="completed";
                break;
            }
            case 'topical': {
                status="topical";
                break;
            }
            case 'upcoming': {
                status="new";
                break;
            }
            default : {
                status = "";
            }

        }
      this.setState({
          data:[],
          old: 0,
          status: status
      }, () => {this.getTreatments()})
    };


    componentDidMount() {
        this.getTreatments();
    }


    componentWillReceiveProps(newProps) {
        if (newProps.data.length && this.state.refresh) {
            this.setState({data: newProps.data, refresh: false})
        } else if (newProps.data.length && newProps.data !== this.props.data) {
            this.setState({data: [...this.state.data, ...newProps.data]})
        }
    }

    getTreatments = () => {
        this.setState({loading: true});
        let obj = {...this.state};
        if (this.state.date.datestart && this.state.date.dateend) {
            obj.datestart = this.state.date.datestart;
            obj.dateend = this.state.date.dateend;
        }
        this.props.getTreatments(obj).then(res => {
            this.setState({loading: false});
        })
    };

    dpHandler = (range) => {
        let _range = range.length ? {
            datestart: moment(range[0]).hour(0).minute(0).second(0).millisecond(0).format("X"),
            dateend: moment(range[1]).hour(23).minute(59).second(59).millisecond(999).format("X")
    } : {};
        this.setState({
          date: _range,
          old:0,
          data: [],
          rangeSet:[
            moment(range[0]).hour(0).minute(0).second(0).millisecond(0),
            moment(range[1]).hour(0).minute(0).second(0).millisecond(0)
          ]
        }, () => {
          this.getTreatments()
        })

    };
    loadMore = () => {
      this.setState({old: this.state.old + this.state.max}, ()=> {
        this.getTreatments()
      })
    };


    historyRender = (dataArr) => {
        let history = [];
        if (!dataArr.length && !this.state.loading) {
            return <div className="table-footer"
                        key="btn">
                <Button btnText={'Нет обращений. Нажмите чтобы обновить.'}
                        size='link'
                        type='link'
                        icon={'circle_close'}
                        onClick={() => this.getTreatments()}
                />
            </div>
        } else {
            history = dataArr.map((item, i) => {
                return (<HistoryReceptionsItem {...item}
                                               onGotoChat={this.props.onGotoChat}
                                               onGoto={this.props.onGoto}
                                               key={'histRecept' + i}
                                               isUser={this.props.isUser}
                                               onAddFiles={this.props.onAddFiles}
                                               refresh={this.refresh}
                                               showReviewModal={this.showReviewModal}
                                               addConclusion={this.props.addConclusion}
                                               makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
                />)

            });
        }
        if (this.props.treatmentsCount > dataArr.length && !this.state.loading) {
            history.push(
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
        } else if (this.state.loading) {
            history.push(
                <div className="table-footer"
                     key="btn">
                    <Spinner size="small"/>
                </div>)
        }
        return history

    };


    tabHeaderRender = () => {
        return (
            <Hoc>
                <div className="tableheader">
                    <div className="flex-col">
                        <div className="receptions-status new">Новые</div>
                    </div>
                    <div className="flex-col">
                        <div className="receptions-status topical">Актуальные</div>
                    </div>
                    <div className="flex-col">
                        <div className="receptions-status completed">Завершенные</div>
                    </div>
                    <div className="flex-col">
                        <div className="receptions-status extra">Экстренные</div>
                    </div>
                </div>
                <div className="tableheader menu-header">
                    <div className="flex-col">
                        <div className="tableheader-name">{this.props.isUser? "Врач" : "Имя пациента"}</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Дата приема</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Предварительное заключение</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Комментарий</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Стоимость</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Заключение</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Отзыв</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Файлы</div>
                    </div>
                </div>
            </Hoc>
        )
    };


    changeHandleSearch = (e) => {
        this.setState({filt_name: e.target.value});
        clearTimeout(this.timer);
        this.timer = setTimeout(this.triggerChange, 800);
    };

    triggerChange = () => {
        this.setState({
            old:0,
            count: 0,
            loadedCount: 0,
            data: [],
            loading: true,
        }, () => {
            this.getTreatments()
        })
    };

    handleKeyDown = (e) => {
        if(e.keyCode===13) {
                clearTimeout(this.timer);
                this.triggerChange();
        }
    };

    showReviewModal = (obj) => {
        this.setState({dataForReview: obj, showReviewModal: true})
    };



    refresh = () => {
        this.setState({refresh:true});
        let obj = {...this.state};
        if (this.state.date.datestart && this.state.date.dateend) {
            obj.datestart = this.state.date.datestart;
            obj.dateend = this.state.date.dateend;
        }
        obj.max = this.state.data.length;
        obj.old = 0;
        this.props.getTreatments(obj)
    };
    render() {
        return (
            <div className='receptions-all'>
                <Card title="История обращений">
                    <Tabs onChange={this.tabChangeHadler}
                          defaultActiveKey='all'
                          tabBarExtraContent={
                              <div className='extra-panel'>
                                  <DatePicker small
                                              onChange={this.dpHandler}
                                              defaultValue={this.state.rangeSet}
                                  />
                                  <Input.Search
                                      placeholder="Поиск..."
                                      onChange = {this.changeHandleSearch}
                                      onKeyDown = {this.handleKeyDown}

                                  />
                              </div>}>
                        <TabPane tab="Все" key="all">
                            <PerfectScrollbar
                                speed={1}
                                className=""
                                contentClassName="content"
                                horizontal={true}
                            >
                                {this.tabHeaderRender()}
                                {this.historyRender(this.state.data)}
                            </PerfectScrollbar>
                        </TabPane>
                        <TabPane tab="Завершенные" key="completed">
                            <PerfectScrollbar
                                speed={1}
                                className=""
                                contentClassName="content"
                                horizontal={true}
                            >
                                {this.tabHeaderRender()}
                                {this.historyRender(this.state.data)}
                            </PerfectScrollbar>
                        </TabPane>
                        <TabPane tab="Актуальные" key="topical">
                            <PerfectScrollbar
                                speed={1}
                                className=""
                                contentClassName="content"
                                horizontal={true}
                            >
                                {this.tabHeaderRender()}
                                {this.historyRender(this.state.data)}
                            </PerfectScrollbar>
                        </TabPane>
                        <TabPane tab="Предстоящие" key="upcoming">
                            <PerfectScrollbar
                                speed={1}
                                className=""
                                contentClassName="content"
                                horizontal={true}
                            >
                                {this.tabHeaderRender()}
                                {this.historyRender(this.state.data)}
                            </PerfectScrollbar>
                        </TabPane>
                    </Tabs>
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

HistoryReceptionsTabs.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    limit: PropTypes.number,
    onGoto: PropTypes.func,
    onGotoChat: PropTypes.func,
};

HistoryReceptionsTabs.defaultProps = {
    data: [],
    limit: 7,
    onGoto: () => {},
    onGotoChat: () => {},
};

export default HistoryReceptionsTabs
