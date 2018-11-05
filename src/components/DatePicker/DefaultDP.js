import React from 'react'

import {DatePicker as AntDatePicker} from 'antd'

const DefaultDP = (props) => {
    return (<AntDatePicker defaultValue={props.defaultValue}
                           format={props.format}
                           onChange={props.onChange}
                           placeholder={props.placeholder}
                           className={props.className}
                           {...props}
    /> )
};

export default DefaultDP;