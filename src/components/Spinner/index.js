import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import './style.css'


class Spinner extends Spin{
    constructor(props){
        super(props);
    }


    render() {
        const { isInline, tip, size, style } = this.props;
        let cls = isInline ? "inline-spinner" :"spinner-wrapper";
        return (
            <div className={cls}>
                <Spin size={size}
                      style={style}
                      tip={tip}
                />
            </div>
        )
    }
}

Spinner.propTypes = {
    isInline: PropTypes.bool,
    onBackground: PropTypes.bool,
    tip: PropTypes.string
};

Spinner.defaultProps = {
    isInline: false,
    onBackground: false,
    tip: null,
};

export default Spinner;