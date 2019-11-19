import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import {connect} from 'react-redux';
import * as actions from '../../store/actions'

import './styles.css'

const ListTrainersModal = (props) => {
    const {visible, hideListTrainersModal} = props;

    return (
        <Modal title='Список коучей'
               visible={visible}
               onCancel={hideListTrainersModal}
               width={720}
        >
            <Content {...props}/>
        </Modal>
    )
};

const mapStateToProps = state => {
    return {
        visible: state.modal.visible_ListTrainersModal,

        freetrainers: state.admin.freetrainers,
        busytrainers: state.admin.busytrainers,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideListTrainersModal: () => dispatch(actions.hideListTrainersModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTrainersModal);