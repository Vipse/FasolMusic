import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Icon as AntdIcon } from 'antd'
const iconList = [
    "clock",
    "add-button",
    "alarm",
    "archive-box",
    "arrow_down",
    "arrow_left",
    "arrow_right",
    "arrow_up",
    "arrow2_left",
    "calendar",
    "caution",
    "chat",
    "chat1",
    "circle_arrow_down",
    "circle_arrow_left",
    "circle_arrow_right",
    "circle_arrow_up",
    "circle_close",
    "circle_plus",
    "clip",
    "close",
    "dashboard",
    "download",
    "emergency-call",
    "emoticon-face",
    "empty",
    "end-call-button",
    "enter",
    "exit",
    "file-download",
    "file",
    "hint",
    "incoming-calls",
    "left-arrow-forward_small",
    "mail",
    "no",
    "notification",
    "order-form",
    "pdf-file",
    "phone-call-outcoming",
    "play-button",
    "plus",
    "result",
    "result2",
    "right-arrow-forward_small",
    "search",
    "setting_edit",
    "star",
    "telephone",
    "video-camera",
    "volume",
    "xls-file",
    "icon1",
    "remove",
    "icon2",
    "icon3",
    "icon4",
    "message"
];

class Icon extends React.Component{
    constructor(props){
        super(props);
        const {type, svg} = this.props;
        let isAntd;
        (function () {
            if(!svg)
            isAntd = iconList.every((elem,i) => {
                return elem !== type;
            });
        }());
        this.svg = !isAntd;
    }


    render(){
        const { svg, type, size, num, title, onClick, style } = this.props;


        if (!this.svg)
            return (<AntdIcon onClick={onClick}
                              title={title || null}
                              type={type}
                              style={{fontSize:size, ...style}}
            />);

        const clName = cn('icon', `icon-${type}`)

        return <span onClick={onClick}
                        title={title}
                     className={clName}
                     num={num}
                     style={{fontSize:size, ...style}}/>
    }
}

Icon.propTypes = {
    svg: PropTypes.bool,
    type: PropTypes.string.isRequired,
    size: PropTypes.number,
    num: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
};

Icon.defaultProps = {
    svg: false,
    size: 36,
    num: '',
    title: '',
    onClick: () => {},
};

export default Icon
