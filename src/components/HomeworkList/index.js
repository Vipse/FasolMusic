import React from 'react';
import PropTypes from 'prop-types'
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
            loading: true
        };
        this.timer = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.loading && ((prevProps.trainings !== this.props.trainings)))
            this.setState({loading: false});
    }


    // componentDidMount() {
    //     //this.getTrainings();
    // }
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
            return <div className="table-footer" key="btn">
                <Button btnText={'Нет тренировок. Нажмите чтобы обновить.'}
                        size='link'
                        type='link'
                        icon={'circle_close'}
                        //onClick={() => this.getTrainings()}
                />
            </div>
        } else if (this.state.loading)
            history.push(
                <div className="table-footer" key="btn">
                    <Spinner/>
                </div>);
        else if (dataArr.length) {
            history = dataArr.map((item, i) => {
                return (<HomeworkListItem {...item}
                                          onGoto={this.props.onGoto}
                                          key={'histRecept' + i}
                                          isStudent={this.props.isStudent}
                                          onStudentPage={this.props.onStudentPage}
                                          onAddFiles={this.props.onAddFiles}
                                          makeArchiveOfFiles={this.props.makeArchiveOfFiles}
                                          onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                />);
            });
        }

        return history;
    };

    tabHeaderRender = () => {
        const {isStudent, onStudentPage} = this.props;
        return (
            <Hoc>
                <div className="tableheader">
                    <Input.Search
                        placeholder="Поиск..."
                        onChange={this.changeHandleSearch}
                        onKeyDown={this.handleKeyDown}
                    />
                </div>
                <div className="menu-header">
                    <div className="flex-col date">
                        <div className="date">Дата</div>
                    </div>
                    {!onStudentPage && <div className="flex-col name">
                        <div className="name">{isStudent ? "Коуч" : "Студент"}</div>
                    </div>}
                    <div className="flex-col discipline">
                        <div className="discipline">Дисциплина</div>
                    </div>
                    <div className="flex-col record">
                        <div className="record">Запись</div>
                    </div>
                    <div className="flex-col homework">
                        <div className="homework">ДЗ</div>
                    </div>
                    <div className="flex-col attachments">
                        <div className="attachments">Материалы</div>
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
