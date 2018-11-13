import React from 'react'
import Hoc from '../../../Hoc'

const Header = ({ labels, label }) => {
  let content = labels  ?
    (<div className="header-week">
      <div className="header-week-weekday">
          {labels[0]}
      </div>
      <div className="header-week-day">
          {labels[1]}
      </div>
    </div>)
       :
    (<div className="header-month">
        {label}
    </div>)

    return <Hoc>{content}</Hoc>
}

export default Header
