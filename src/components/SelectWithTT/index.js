import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { Select } from 'antd';

import './style.css'

const Option = Select.Option;


class SelectWithTT extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: ""
        }
    }

    componentDidMount() {
        if (this.props.value) this.setState({value: this.props.value});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.value !== this.props.value) this.setState({value: this.props.value});
    }

    onChange = (value) => {
        if (value) {
            this.setState({value});
            this.props.onChange && this.props.onChange(value)
        } else
            this.setState({value: ""})
    };

    render() {
        const labelClassName = this.state.value && this.state.value.length ? "bubble" : "";
        const valuesArr = this.props.values ? this.props.values : [];
        return (
            <div className = "new-select-wrapper input-effect">
                <Select onChange={this.onChange} dropdownClassName="new-select-variants" mode={this.props.mode} value={this.props.value}>
                    {valuesArr.map((item, i) => <Option value={item} key={i}>{item}</Option>)}
                </Select>
                {this.props.tooltip && <button type="button" data-tip={this.props.tooltip || ""} className='note'>?</button>}
                <label className={labelClassName}>{this.props.bubbleplaceholder || ""}</label>
                {this.props.tooltip && <ReactTooltip place="top" type="dark" effect="float"/>}
            </div>
        )
    }
}

SelectWithTT.propTypes = {
    className: PropTypes.string,
};

SelectWithTT.defaultProps = {
    className: '',
};

export default SelectWithTT