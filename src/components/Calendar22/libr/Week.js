import PropTypes from 'prop-types'
import React from 'react'
import dates from './utils/dates'
import localizer from './header/localizer'
import { navigate } from './utils/constants'
import TimeGrid from './TimeGrid'


import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

class Week extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
  }

  static defaultProps = TimeGrid.defaultProps

  deleteEvent = (value) => {
    if(Object.keys(value).length){
        this.props.deleteEvent(value);
    }
    
  }


  render() {

    let { date, ...props } = this.props

    let range = Week.range(date, this.props)
 
    return (
        <div>
          <TimeGrid 
                  {...props} 
                  range={range} 
                  eventOffset={15} 
                  handleDrop = {(id) => this.deleteEvent(id)} 
                  
                
                  />
        </div>  
    )
  }
}

Week.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'week')

    case navigate.NEXT:
      return dates.add(date, 1, 'week')

    default:
      return date
  }
}

Week.range = (date, { culture }) => {

  let firstOfWeek = localizer.startOfWeek(culture)
  let start = dates.startOf(date, 'week', firstOfWeek)
  let end = dates.endOf(date, 'week', firstOfWeek)

  return dates.range(start, end)
}

Week.title = (date, { formats, culture }) => {
  let [start, ...rest] = Week.range(date, { culture })
  return localizer.format(
    { start, end: rest.pop() },
    formats.dayRangeHeaderFormat,
    culture
  )
}

export default DragDropContext(HTML5Backend)(Week)
