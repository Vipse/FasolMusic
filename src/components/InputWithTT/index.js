import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import './style.css'


class InputWithTT extends React.Component{
    constructor(props){
        super(props);
        this.input = React.createRef();
        this.state ={
            onFocus: false,
            value: ""
        }
    }

    onChange = (e) => {
        this.setState({value: e.target.value});
        this.props.onChange && this.props.onChange(e.target.value)
    };

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
        this.input.current.value = nextProps.value;
    }

    render() {
        const labelClassName = this.state.value ? "bubble" : "";
        return (
            <div className = "new-input-wrapper input-effect">
                <input onChange={this.onChange} className="effect" type={this.props.type} ref={this.input}/>
                {this.props.tooltip && <button type="button" data-tip={this.props.tooltip || ""} className='note'>?</button>}
                <label className={labelClassName}>{this.props.bubbleplaceholder || ""}</label>
                {this.props.tooltip && <ReactTooltip place="top" type="dark" effect="float"/>}
            </div>
        )
    }
}

InputWithTT.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired
};

InputWithTT.defaultProps = {
    className: '',
    type: "text"
};

export default InputWithTT