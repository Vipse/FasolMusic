import React from 'react';
import PropTypes from 'prop-types'
import HomeworkListItem from '../HomeworkListItem'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'


import './style.css'
import '../../icon/style.css'
import Spinner from "../Spinner";

class HomeworkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFieldValue: '',
            searchApplying: ''
        };
        this.timer = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchApplying !== this.state.searchApplying)
            this.loadMore();
    }

    loadMore = () => {
        const { searchApplying } = this.state;
        this.props.loadMoreTrainings(searchApplying);
    };

    getFooterElement = () => {
        const {loading, isRequestFailed, endAchieved, trainings} = this.props;

        if (loading) {
            return <div className="table-footer" key="btn">
                <Spinner/>
            </div>;
        } else if (isRequestFailed) {
            return <div className="table-footer" key="btn">
                <Button btnText='Ошибка при загрузке. Нажмите чтобы обновить'
                        size='link'
                        type='link'
                        icon='circle_close'
                        onClick={this.loadMore}
                />
            </div>;
        } else if (endAchieved && !trainings.length) {
            return <div className="table-footer" key="btn">
                <Button btnText='Нет данных. Нажмите, чтобы обновить'
                        size='link'
                        type='link'
                        icon='circle_close'
                        onClick={this.loadMore}
                />
            </div>;
        } else if (!endAchieved && trainings.length) {
            return <div className="table-footer" key="btn">
                <Button btnText='Показать еще'
                        size='link'
                        type='link'
                        icon='circle_arrow_down'
                        onClick={this.loadMore}
                />
            </div>;
        }
        else return null;
    };

    historyRender = () => {
        const {trainings} = this.props;
        let history = [];

        if (trainings) {
            history = trainings.map((item, i) =>
                <HomeworkListItem {...item}
                                  onGoToProfile={this.props.onGoToProfile}
                                  onGoToChat={this.props.onGoToChat}
                                  key={'histRecept' + i}
                                  isStudent={this.props.isStudent}
                                  onStudentPage={this.props.onStudentPage}
                                  makeArchiveOfFiles={this.props.makeArchiveOfFiles}
                                  onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                />);
        }

        history.push(this.getFooterElement());
        return history;
    };

    tabHeaderRender = () => {
        const {isStudent, onStudentPage} = this.props;
        return (
            <React.Fragment>
                <div className="tableheader">
                    <Input.Search
                        placeholder="Поиск по ДЗ..."
                        onChange={this.changeInputSearch}
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
                    {/*<div className="flex-col attachments">
                        <div className="attachments">Материалы</div>
                    </div>*/}
                </div>
            </React.Fragment>
        )
    };


    changeInputSearch = (e) => {
        this.setState({searchFieldValue: e.target.value});
        clearTimeout(this.timer);
        this.timer = setTimeout(this.triggerChangeSearchFilter, 800);
    };

    triggerChangeSearchFilter = () => {
        const { searchFieldValue } = this.state;
        this.setState({searchApplying: searchFieldValue});
    };

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            clearTimeout(this.timer);
            this.triggerChangeSearchFilter();
        }
    };

    render() {
        return (
            <div className='trainings-all'>
                <Card title="История тренировок">
                    {this.tabHeaderRender()}
                    {this.historyRender()}
                </Card>
            </div>
        )
    }
}

HomeworkList.propTypes = {
    trainings: PropTypes.arrayOf(PropTypes.object),
    loadMoreTrainings: PropTypes.func
};

HomeworkList.defaultProps = {
    trainings: [],
    loadMoreTrainings: () => {}
};

export default HomeworkList
