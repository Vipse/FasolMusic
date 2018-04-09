import React from 'react'
import {connect} from 'react-redux';

import { Icon, Row, Col, PatientTable, AddNewPatient } from 'appdoc-component'
import Hoc from '../../hoc'

import {patientArr} from './mock-data'
import * as actions from '../../store/actions'

import './styles.css';

class Patients extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			addNew_show: false,
		}
	}

	componentDidMount(){
		this.props.onGetDocPatients();	
	}

	showModalHandler = () => {
		//this.props.onGetNotDocPatients();
		this.setState({addNew_show: true});
	}

    render(){

        return (
        	<Hoc>
        		<Row>
        			<Col span={24}>
        				<h1 className='page-title'>Мои пациенты</h1>
        			</Col>
        		</Row>
            	<Row>
            		<Col xs={24} xxl={18}>
						<PatientTable countPatient='9' 
										data={this.props.docPatients}
										onSearch = {(val) => console.log(val)}
										onAdd = {this.showModalHandler}
										
										onNewVisit={(val) => console.log(val)}
										onNewMessage = {(val) => console.log(val)}
										onDelete = {(val) => this.props.removePatient(val)}
										/>
            		</Col>
            	</Row>
				<AddNewPatient data={this.props.notDocPatients} 
							visible={this.state.addNew_show} 
							onCancel={() => {
								this.setState({addNew_show: false});
								this.props.onClearNotDocPatients();
							}}
							onSearch = {(name) => this.props.onGetNotDocPatients(name)}
							onAdd={(id)=>this.props.addPatient(id)}/>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
	return {
		docPatients: state.patients.docPatients,
		notDocPatients: state.patients.notDocPatients,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onGetDocPatients: () => dispatch(actions.getDocPatients()),
		onGetNotDocPatients: (name) => dispatch(actions.getNotDocPatients(name)),
		onClearNotDocPatients: () => dispatch(actions.clearNotDocPatients()),
		addPatient: (id, name) => dispatch(actions.addPatient(id, name)),
		removePatient: (id_user, id_doctor) => dispatch(actions.removePatient(id_user, id_doctor)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Patients);