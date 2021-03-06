import React from 'react';
import PropTypes from 'prop-types'

import Icon from '../Icon'
import Modal from '../Modal'
import './styles.css'

class MapsModal extends React.Component{

    render(){
        const {visible, title, warning, width} = this.props;
        
        return (
            <Modal visible={visible}
                      title={title}
                      width={width}
                      footer={null}
                      className = {warning ? 'warning' : ''}
                      closable = {!warning}
                      onCancel={this.props.onCancel}
            >
                {warning && <Icon type="caution" svg size={24}/>}
                {this.props.children}
            </Modal>
        )
    }
}

MapsModal.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    width: PropTypes.number,
    warning: PropTypes.bool,
    onCancel: PropTypes.func,
};

MapsModal.defaultProps = {
    visible: false,
    title: '',
    width: 400,
    warning: false,
    onCancel: () => {},
};

export default MapsModal