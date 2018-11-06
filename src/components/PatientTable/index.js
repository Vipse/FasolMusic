import React from 'react';
import PropTypes from 'prop-types'

import PatientTableItem from '../PatientTableItem'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'
import ScrollArea from 'react-scrollbar'
import {search} from '../../helpers/searching'
import './style.css'
import '../../icon/style.css'


class PatientTable extends React.Component{
    state = {
        searchRes: this.props.data,
        filtered: false,
    };

    

    componentWillReceiveProps(nextProps){
        this.setState({
            searchRes: nextProps.data,
        })
    }

    onInputChange = (e) => {

        e.target.value.length > 0 
            ? (this.setState({
                searchRes: search(e.target.value, this.props.data),
            }))
            : this.setState({
                searchRes: this.props.data,
            });
    };

    patinetRender = (dataArr) => {
        return dataArr.map((item) => {
            return (<PatientTableItem key={item.id} 
                                onGoto={this.props.onGoto}
                                onDelete={this.props.onDelete} 
                                onNewVisit={this.props.onNewVisit}
                                onNewMessage={this.props.onNewMessage}
                                setModal1Visible={this.props.setModal1Visible}
                                setModal2Visible={this.props.setModal2Visible}
                                onChangeDate={this.props.onChangeDate}
                                {...item}/>)
        });
    }

    render(){
        const { data } = this.props;

        return (
            <div className='patient-all'>
                <Card title="Список пациентов" extra={data.length && <div className='patient-count'>{data.length}</div>}>
                    <ScrollArea
                            speed={1}
                            className="patient-list"
                            contentClassName="content"
                    >
                        <div className="tableheader">
                            <div className="flex-col">
                                <Button
                                    onClick = {this.props.onAdd} 
                                    btnText='Добавить'
                                    size='default'
                                    type='yellow'
                                    icon='plus'
                                    iconSize={11}
                                    svg
                                />
                            </div>
                            <div className="flex-col ico-btn">
                                <Input.Search
                                    placeholder="Поиск..."
                                    onChange={this.onInputChange}
                                    onSearch={e => this.props.onSearch(e)}
                                />
                            </div>
                        </div>
                        {this.state.searchRes.length ? this.patinetRender(this.state.searchRes) : <span className='noPatients'>На данный момент у вас нет пациентов</span>}
                    </ScrollArea>
                  </Card>
            </div>
        )
    }
}

PatientTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    onAdd: PropTypes.func,
    onSearch: PropTypes.func,
    onGoto: PropTypes.func,
    onChangeDate:  PropTypes.func,
};

PatientTable.defaultProps = {
    data: [],
    onAdd: () => {},
    onSearch: () => {},
    onGoto: () => {},
    onChangeDate: () => {},
};

export default PatientTable