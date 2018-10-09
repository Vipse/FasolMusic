import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Icon from '../Icon'

import './style.css'
import '../../icon/style.css'

class Button extends React.Component {

        render() {
            const {className, type, size, btnText, icon, iconSize, title, svg, disable, onClick} = this.props;

            const rootClass = cn( `${className}`, 'btn',`btn-size-${size}`, `btn-type-${type}`)

            return (
                <button className={rootClass}
                        title={title}
                        onClick={onClick}
                        {...(disable ? { disabled: true } : {})}
                        style={this.props.style}
                >
                    {icon && (
                        <Icon title={title} key={btnText+icon} svg={svg} type={icon} size={iconSize}/>
                    )}

                    {type !== 'icon'
                        && btnText !== ""
                        && <span style={type ==="go" ? {marginRight:10} : {}}>
                            {btnText}
                        </span>}
                </button>
            )
        }

}

Button.propTypes ={
    className: PropTypes.string,
    type: PropTypes.oneOf(['blue','dark-blue','float','yellow',
        'gradient','icon','light-blue', 'file', 'link', 'go',
        'blue-float', 'no-brd', 'upload', 'transparent', 'emergency', 'emergensy', 'pink', 'bright-blue']),
    size: PropTypes.oneOf(['small', 'default', 'large', 'icon',
        'file', 'link', 'file all-download', 'go', 'upload', 'mini']),
    btnText: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    iconSize: PropTypes.number,
    svg: PropTypes.bool,
    disable: PropTypes.bool,
    onClick: PropTypes.func,
}

Button.defaultProps = {
    className: '',
    title: '',
    type: 'float',
    size: 'default',
    btnText: '',
    icon: '',
    iconSize: 20,
    svg: false,
    disable: false,
    onClick: () => {},
}

export default Button
