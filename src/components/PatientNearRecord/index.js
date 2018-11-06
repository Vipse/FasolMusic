import React from 'react';
import PropTypes from 'prop-types'

import PatientNearRecordItem from '../PatientNearRecordItem'
import Card from '../Card'
import Icon from '../Icon'
import Spinner from "../Spinner"

import './style.css'
import '../../icon/style.css'


class PatientNearRecord extends React.Component{
    state = {
        isLoading: true
    };

    nearRender = (dataArr) => {
        let nearArr = [];

        dataArr.map((item,index) => {
            nearArr.push(<PatientNearRecordItem key={index} {...item} cancelAppByPatient={this.props.cancelAppByPatient}/>)
        });

        return nearArr;
    }
    componentWillReceiveProps(props) {
        if(props.nearVisitsLoaded) {
            this.setState({isLoading: false});
        }
    }

    render(){
        const { data, onGoto } = this.props;

        return (
            <div className='record-all'>
                <Card title="Ближайшие записи" style={{height: 500}} extra={<div onClick={this.props.redirect} className='go-to' ><Icon svg type='calendar' size={18} /> Все</div>}>
                    {this.state.isLoading ? <Spinner/> : this.nearRender(this.props.data)}
                </Card>
            </div>
        )
    }
}

PatientNearRecord.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    onGoto: PropTypes.func,
};

PatientNearRecord.defaultProps = {
    data: [],
    onGoto: () => {},
};

export default PatientNearRecord
