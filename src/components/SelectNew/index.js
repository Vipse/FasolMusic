import React from 'react'
import PropTypes from 'prop-types'
import {Select as AntSelect} from "antd"
import './style.css'

const Option = AntSelect.Option;
class SelectNew extends AntSelect{
    constructor(props){
        super(props);
        this.state ={
            onFocus: false
        }
    }

    renderOptions = (data) => {
        let dataArr =[];
        data.forEach((item, index) => {
            dataArr.push( <Option value={item} key = {index}>{item}</Option>)
        });
        return dataArr
    };
    handleChange = (value) => {
        this.setState({select: value});
        this.props.onChange(value)
    };
    render() {
        const inputClassName = (this.props.value && this.props.value.length ? "effect has-content" : "effect");
        const rootCl = "new-input input-effect" +" "+ this.props.className + " " +  'input-root ';
        return (
            <div className={rootCl}
                 style={{width:this.props.width ? this.props.width : null}}
            >
                <AntSelect
                    {...this.props}
                    showSearch
                    mode={this.props.mode || null}
                    style={{ width: "100%" }}
                    placeholder=""
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    className={inputClassName}
                    ref = {sel => this.sel = sel}
                    onChange={this.handleChange}
                >
                    {this.renderOptions(this.props.data)}
                </AntSelect>
                <label>{this.props.bubbleplaceholder}</label>


            </div>
        )
    }
}

SelectNew.propTypes = {
    className: PropTypes.string,
};

SelectNew.defaultProps = {
    className: '',
};

export default SelectNew