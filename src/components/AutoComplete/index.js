import React from 'react'
import PropTypes from 'prop-types'

import PerfectScrollbar from 'react-perfect-scrollbar'
import AddNewPatientItem from '../AddNewPatientItem'
import Input from '../Input'
import Spinner from '../Spinner'
import {Modal} from 'antd';
import './style.css'
import Icon from "../Icon";

class AutoComplete extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            isVisible: false,
            inputValue: "",
            loading: false,
            searchRes: this.props.data,
        };
        this.input;
    }

    focusHandler = (e) => {
        this.setState({
            isVisible: false,
            searchRes: []
        });
    };

    componentWillMount() {
        this.timer = null;
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            searchRes: nextProps.data,
            loading: false
        });
    }

    onClickHandler = (id, flag, userGroup) => {
        let user;
        flag === 'goto' ? (
                this.state.searchRes.some((el, i) => {
                    (el.id === id) ? user = el : null;
                    return el.id === id;
                }),
                this.input.inp.input.value = "",
                this.props.onGoto(id, userGroup),
                this.setState({isVisible: false})
            )
            : flag === 'add' ? (
                this.props.onAdd(id, this.input.inp.input.value)
            )
            : (
                this.props.onDelete(id, this.input.inp.input.value)
            );
    };

    onDeletePatientHandler = (id, patientName) => {
        const {authMode} = this.props;
        let that = this;
        Modal.confirm({
            title: `Вы действительно хотите удалить ${authMode === 'student' ? `коуча` : `студента`}?`,
            content: `${patientName} будет удален из списка ${authMode === 'student' ? `коуча` : `студента`}`,
            width: '445px',
            okText: 'Да',
            cancelText: 'Нет',
            onOk() {
                that.onClickHandler(id, 'delete');
            },
          });
    };

    studentsRender = (dataArr) => {
        return dataArr.map((item) => {
            return (<AddNewPatientItem
                {...item}
                onAdd={(id) => {
                    this.onClickHandler(id, 'add')
                }}
                onDelete={this.onDeletePatientHandler}
                onGoto={(id, userGroup) => {
                    this.onClickHandler(id, 'goto', userGroup)
                }}
                key={item.id}
                searchQuery={this.state.inputValue}
                isAdmin={this.props.authMode === 'admin'}
            />)
        });
    };

    changeHandleSearch = (e) => {
        this.setState({inputValue: e.target.value});
        clearTimeout(this.timer);
        if (e.target.value.length === 3) {
            this.triggerChange(e.target.value);
            return
        }
        e.target.value.length > 2 ? this.timer = setTimeout(this.triggerChange, 800) : this.setState({searchRes:[]});
    };

    triggerChange = (value) => {
        this.setState({
            loading: true,
            isVisible: true
        },this.props.findName(value || this.state.inputValue));
    };

    handleKeyDown = (e) => {
        if (e.keyCode===13) {
            if ( e.target.value.length > 2 ) {
                clearTimeout(this.timer);
                this.setState({isVisible: true});
                this.triggerChange();
            }
        }
    };

    render() {
        const {authMode} = this.props;
        const {loading, searchRes, inputValue} = this.state;
        const resultClass = (this.state.isVisible)? 'auto__complete-result auto__complete-result-focus' : 'auto__complete-result';
        const overlayClass = (this.state.isVisible)? 'auto__complete-overlay auto__complete-overlay-focus' : 'auto__complete-overlay';

        return (
            <div className='auto__complete'>
                <div className='auto__complete-icon'><Icon type="search" size={18}/></div>
                <div className='auto__complete-search'>
                    <div className={overlayClass} onClick={() => this.focusHandler(false)}/>
                    <Input
                        placeholder='Поиск...'
                        onChange={this.changeHandleSearch}
                        onKeyDown={this.handleKeyDown}
                        ref = {inp => {this.input = inp}}
                    />
                    <div className={resultClass}>
                        <div className='auto__complete-title'>
                            Результаты поиска
                            {searchRes.length && inputValue.length > 2
                                ? <span className='auto__complete-count'>{searchRes.length}</span> : null }
                            {loading ? <div className='auto__complete-title-spinner'><Spinner/></div> : null}
                        </div>
                        <PerfectScrollbar
                            style={{height: 500}}
                            className="auto__complete-results"
                        >
                            <div>
                                {!loading ?
                                    (inputValue.length > 2 ?
                                        (
                                            (searchRes).length ?
                                                this.studentsRender(searchRes)
                                                : <div className='entry-list'>{(authMode === "student" ? "Коучи" :
                                                authMode === "master" ? "Студенты" : "Пользователи") + " не найдены"}</div>
                                        )
                                        : (<div className='entry-list'>Введите больше символов для поиска</div>)
                                    )
                                : null}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        )
    }
}

AutoComplete.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    findName: PropTypes.func
};

AutoComplete.defaultProps = {
    data: [],
    findName: () => {}
};

export default AutoComplete
