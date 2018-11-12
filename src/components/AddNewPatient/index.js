import React from 'react'
import PropTypes from 'prop-types'
import ScrollArea from 'react-scrollbar'
import AddNewPatientItem from '../AddNewPatientItem'
import Modal from '../Modal'
import Input from '../Input'
import './styles.css'
import Spinner from "../Spinner";


class AddNewPatient extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            patients: props.data,
            inputValue: '',
            loading: false
        };
    }

    onAddHandler = (id) => {
        this.props.onAdd(id, this.state.inputValue);
    };

    patientsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<AddNewPatientItem {...item}
                                        onAdd={this.onAddHandler}
                                        key={item.id + ''+index}
                                        searchQuery = {this.state.inputValue}

            />)
        });

    };

    componentWillReceiveProps(nextProps){
        if (this.props.visible !== nextProps.visible && nextProps.visible === true)
            this.setState({
                inputValue: '',
                loading: false,
                patients: []
            })
    }

    componentWillMount() {
        this.timer = null;
    }

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
        clearTimeout(this.timer);
        if (e.target.value.length === 3)
            this.triggerChange();
        else if (e.target.value.length > 2)
            this.timer = setTimeout(this.triggerChange, 800);
        else this.props.onClear();
    };

    triggerChange = () => {
        this.setState({loading: true});
        this.props.onSearch(this.state.inputValue)
            .then((res) => {
                if (res.status === 200)
                    this.setState({loading: false});
            })
            .catch((err) => console.log(err))
    };

    handleKeyDown = (e) => {
        if (e.target.value.length > 2) {
            if (e.keyCode === 13) {
                clearTimeout(this.timer);
                this.props.onSearch(this.state.inputValue);
            }
        }
        else this.props.onClear();
    };

    handleSearch = () => {
        if (this.state.inputValue.length > 2) {
            clearTimeout(this.timer);
            this.triggerChange();
        }
        else this.props.onClear();
    };

    render(){
        const {visible, onCancel} = this.props;

        return (
            <Modal title='Добавление пациента в свой список'
                   visible={visible}
                   onCancel={onCancel}
                   width={560}
            >
                <div className='new-patient'>
                    <div className='new-patient-search'>
                        <Input.Search placeholder="Введите ФИО пациента"
                                    ref={inp => this.inp = inp}
                                      onSearch={this.handleSearch}
                                      onChange={this.handleChange}
                                      onKeyDown={this.handleKeyDown}
                                      value={this.state.inputValue} />
                    </div>
                    <div className='new-patient-title'>Результаты поиска</div>
                    <ScrollArea
                            speed={1}
                            className="new-patient-list"
                            contentClassName="content"
                            horizontal={false}
                    >
                        {this.state.inputValue.length > 2 ?
                            (
                                this.state.loading ? <Spinner/> :
                                    this.props.data.length === 0 ?
                                        (<div className="no-patients">Пациенты не найдены</div>)
                                        : this.patientsRender(this.props.data)
                            )
                            : (<div className="no-patients">Введите больше символов для поиска</div>)}
                    </ScrollArea>
                </div>
            </Modal>
        )

    }
}

AddNewPatient.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onAdd: PropTypes.func,
    onSearch: PropTypes.func,
};

AddNewPatient.defaultProps = {
    data: [],
    visible: false,
    onCancel: () => {},
    onAdd: () => {},
    onSearch: () => {},
};

export default AddNewPatient;
