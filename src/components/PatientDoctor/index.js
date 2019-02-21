import React from 'react';
import PropTypes from 'prop-types'

import PatientDoctorItem from '../PatientDoctorItem'
import NewVisitModalPage from '../NewVisitModalPage'
import Card from '../Card'
import Icon from '../Icon'

import './style.css'
import '../../icon/style.css'
import {message} from "antd";
import Spinner from "../Spinner";


class PatientDoctor extends React.Component{

    state = {
        modal1Visible: false,
        doctorName: '',
        isRecordInProcess: false,
        submitSuccess: true,
        loading: true
    };

    setModal1Visible = (value, name, ID)=> {
        this.setState({
            modal1Visible: value,
            doctorName: (value) ? name : this.state.doctorName,
            doctorID: (value) ? ID : this.state.doctorID,
        });
        if (value) this.props.onGetAllDocIntervals(ID);
    };

    doctorRender = (dataArr) => {
        let doctorArr = [];

        if(!Array.isArray(dataArr)) return [];
        
        dataArr.map((item,index) => {
            doctorArr.push(<PatientDoctorItem onGoto={this.props.onGoto} key={index} {...item} checkModal1Visible={this.setModal1Visible}/>)
        });

        return doctorArr;
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.myDoctorsLoaded) {
            this.setState({loading: false});
        }
    };


    render(){
        const { data, onGoto } = this.props;

        return (
            <div className='doctor-all'>
                <Card style={{height: 500}} title="Мои врачи" extra={
                    <div onClick={this.props.redirect} className='go-to'>
                        <Icon svg type='people' size={18} /> Весь список
                    </div>}>
                    {this.state.loading ? <Spinner/> : this.doctorRender(data)}
                </Card>
                <NewVisitModalPage
                    visible={this.state.modal1Visible}
                    onCancel={() => this.setModal1Visible(false)}
                    userName={this.state.doctorName}
                    intervals={this.props.intervals}
                    onChangeDate={this.props.onGetIntervalForDate}
                    availableIntervals={this.props.availableIntervals}
                    id={this.state.doctorID}
                    submitSuccess={this.state.submitSuccess}
                />
            </div>
        )
    }
}

PatientDoctor.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    onGoto: PropTypes.func,
    isReceptionRecorded: PropTypes.bool,
    receptionRecordedID: PropTypes.string
};

PatientDoctor.defaultProps = {
    data: [],
    onGoto: () => {},
    isReceptionRecorded: false,
    receptionRecordedID: "0"
};

export default PatientDoctor