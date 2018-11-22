import React from 'react';
import PropTypes from 'prop-types'

import { Modal as AntModal } from 'antd';
import Icon from '../Icon'
import './styles.css'

class Modal extends React.Component{

    render(){
        const {visible, title, warning, width, className} = this.props;
        
        return (
            <AntModal visible={visible}
                      title={title}
                      width={width}
                      footer={null}
                      className = {(warning ? 'warning' : '') + ' ' + className}
                      closable = {!warning}
                      onCancel={this.props.onCancel}
                      afterClose={this.props.afterClose}
            >
                {warning && <Icon type="caution" svg size={24}/>}
                {this.props.children}
            </AntModal>
        )
    }
}

Modal.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    width: PropTypes.number,
    warning: PropTypes.bool,
    onCancel: PropTypes.func,
};

Modal.defaultProps = {
    visible: false,
    title: '',
    width: 395,
    warning: false,
    onCancel: () => {},
    className: '',
};

export default Modal