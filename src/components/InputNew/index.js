import React from 'react'
import PropTypes from 'prop-types'
import {Input as AntInput} from "antd"
import './style.css'


class InputNew extends AntInput{
    constructor(props){
        super(props);
        this.state ={
            onFocus: false,
            inputClassName: ""
        }
    }

    componentWillMount() {
        this.setState({inputClassName: ((this.inp && this.inp.input.value) || this.props.value ? "effect has-content" : "effect")});
    }


    render() {
        const rootCl = "new-input input-effect" +" "+ this.props.className + " " +  'input-root ';
        return (
            <div className={rootCl}
                 style={{width:this.props.width ? this.props.width : null}}
            >
                <AntInput {...this.props}
                          className={this.state.inputClassName}
                          ref = {inp => this.inp = inp}
                          onBlur={(e) => this.setState({inputClassName: (e.target.value && e.target.value) ? "effect has-content" : "effect"})}
                />
                <label>{this.props.bubbleplaceholder}</label>


            </div>
        )
    }
}

InputNew.propTypes = {
    className: PropTypes.string,
};

InputNew.defaultProps = {
    className: '',
};

export default InputNew