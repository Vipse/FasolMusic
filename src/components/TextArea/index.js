import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './styles.css'

class TextArea extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value,
        }
    }

    changeHandler = (e) => {
        this.setState({value: e.target.value})
        this.props.onChange(e.target.value);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.value === ''){
            this.setState({value: ""})
        }
    }

    render(){
        const {label, className, placeholder} = this.props;
        const clName = cn("textarea", className);

        return (
            <div className={clName}>
                {label && <div className="textarea-label">{label}</div>}
                <textarea className="textarea-field"
                          placeholder={placeholder}
                          value={this.state.value}
                          onChange={this.changeHandler}/>
            </div>
        )
    }
}

TextArea.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
};

TextArea.defaultProps = {
    label: '',
    value: '',
    className: '',
    placeholder: '',
    onChange: () => {},
};

export default TextArea;