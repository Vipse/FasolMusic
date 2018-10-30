import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'


import './style.css'
import '../../icon/style.css'

class TopPanelItem extends React.Component{

    render(){

        const {className, panelText, type, panelTitle, svg} = this.props;

        const rootClass = cn( `${className}`, 'panelItem')

        return (
            <div className={rootClass}>
                <p className="panelItem-value">{panelText}</p>
                <p className='panelItem-description'>{panelTitle}</p>
            </div>
        )
    }
}


TopPanelItem.propTypes ={
    className: PropTypes.string,
    panelTitle: PropTypes.string,
    panelText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    iconSize: PropTypes.number,
    svg: PropTypes.bool,
    firstItem: PropTypes.bool
}

TopPanelItem.defaultProps = {
    className: '',
    panelTitle: '',
    panelText: '',
    svg: true,
    iconSize: 30,
    firstItem: false,
}

export default TopPanelItem