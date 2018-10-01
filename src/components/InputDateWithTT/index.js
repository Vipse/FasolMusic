import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import './style.css'
import { DatePicker } from "antd";
import moment from "moment";


class InputDateWithToolTip extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            focused: false,
            value: ""
        }
    }

    onChange = (value) => {
        console.log(value);
        if(value) {
            this.setState({value: moment(value).format("X")});
            //this.props.onChange && this.props.onChange(value)
            console.log(moment(value).format("X"), "onChange")
        } else {
            this.setState({focused: false, value: ""})
        }
    };

    render() {
        const labelClassName = this.state.value ? "bubble" : "";
        return (
            <div className = "new-input-date-wrapper input-effect">
                <DatePicker
                    className = "effect"
                    placeholder = ""
                    onChange={this.onChange}
                    dropdownClassName = "input-date-with-tt-calendar-popup"

                />
                {this.props.tooltip && <button type="button" data-tip={this.props.tooltip || ""} className='note'>?</button>}
                <label className={labelClassName}>{this.props.bubbleplaceholder || ""}</label>
                {this.props.tooltip && <ReactTooltip place="top" type="dark" effect="float"/>}
            </div>
        )
    }
}

InputDateWithToolTip.propTypes = {
    className: PropTypes.string,
};

InputDateWithToolTip.defaultProps = {
    className: '',
};

export default InputDateWithToolTip