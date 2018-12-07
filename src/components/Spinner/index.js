import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import './style.css'


class Spinner extends Spin{
    constructor(props){
        super(props);
    }


    render() {
        const cls = this.props.isInline ? "inline-spinner" :"spinner-wrapper";
        return (
            <div className={cls}>
                <Spin size={this.props.size}
                      style={this.props.style}

                />
            </div>
        )
    }
}

Spinner.propTypes = {
    isInline: PropTypes.bool,
};

Spinner.defaultProps = {
    isInline: false,
};

export default Spinner;