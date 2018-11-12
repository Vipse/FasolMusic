import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import HomeworkListItem from '../HomeworkListItem'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'
import Hoc from '../Hoc'

import './style.css'
import '../../icon/style.css'
import Spinner from "../Spinner";

class HomeworkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filt_name: '',
            max: 7,
            old: 0,
            data: [],
            loading: false
        };
        this.timer = null;
    }


    // componentDidMount() {
    //     //this.getTrainings();
    // }
    //
    //
    // componentWillReceiveProps(newProps) {
    //     if (newProps.data.length && this.state.refresh) {
    //         this.setState({data: newProps.data, refresh: false})
    //     } else if (newProps.data.length && newProps.data !== this.props.data) {
    //         this.setState({data: [...this.state.data, ...newProps.data]})
    //     }
    // }
    //
    // getTrainings = () => {
    //     this.setState({loading: true});
    //     let obj = {...this.state};
    //
    //
    // };
    //
    // loadMore = () => {
    //   this.setState({old: this.state.old + this.state.max}, ()=> {
    //     this.getTrainings()
    //   })
    // };


    historyRender = (dataArr) => {
        let history = [];
        if (!dataArr.length && !this.state.loading) {
            return <div className="table-footer"
                        key="btn">
                <Button btnText={'Нет тренировок. Нажмите чтобы обновить.'}
                        size='link'
                        type='link'
                        icon={'circle_close'}
                        //onClick={() => this.getTrainings()}
                />
            </div>
        } else {
            history = dataArr.map((item, i) => {
                return (<HomeworkListItem {...item}
                                          onGoto={this.props.onGoto}
                                          key={'histRecept' + i}
                                          isUser={this.props.isUser}
                                          onAddFiles={this.props.onAddFiles}
                                          makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
                />)

            });
        }
        if (this.props.treatmentsCount > dataArr.length && !this.state.loading) {
            history.push(
                <div className="table-footer"
                     key="btn"
                >
                    <Button btnText='Показать еще'
                            size='link'
                            type='link'
                            title='Показать ещё'
                            icon='circle_arrow_down'
                            onClick={this.loadMore}
                    />
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
                    <Input.Search
                        placeholder="Поиск..."
                        onChange = {this.changeHandleSearch}
                        onKeyDown = {this.handleKeyDown}

                    />
                </div>
                <div className="tableheader menu-header">
                    <div className="flex-col">
                        <div className="tableheader-name">Дата приема</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">{this.props.isUser ? "Коуч" : "Студент"}</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Дисциплина</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Запись тренировки</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">ДЗ</div>
                    </div>
                    <div className="flex-col">
                        <div className="tableheader-name">Материалы</div>
                    </div>
                </div>
            </Hoc>
        )
    };


    // changeHandleSearch = (e) => {
    //     this.setState({filt_name: e.target.value});
    //     clearTimeout(this.timer);
    //     this.timer = setTimeout(this.triggerChange, 800);
    // };
    //
    // triggerChange = () => {
    //     this.setState({
    //         old:0,
    //         count: 0,
    //         loadedCount: 0,
    //         data: [],
    //         loading: true,
    //     }, () => {
    //         this.getTrainings()
    //     })
    // };
    //
    // handleKeyDown = (e) => {
    //     if(e.keyCode===13) {
    //             clearTimeout(this.timer);
    //             this.triggerChange();
    //     }
    // };
    render() {
        return (
            <div className='trainings-all'>
                <Card title="История тренировок">
                    {this.tabHeaderRender()}
                    {this.historyRender(this.props.trainings)}
                </Card>
            </div>
        )
    }
}

HomeworkList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    limit: PropTypes.number,
    onGoto: PropTypes.func,
    onGotoChat: PropTypes.func,
};

HomeworkList.defaultProps = {
    trainings: [],
    limit: 7,
    onGoto: () => {},
    onGotoChat: () => {},
};

export default HomeworkList
