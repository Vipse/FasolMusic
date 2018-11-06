import Calendar from './Calendar'
import BackgroundWrapper from './BackgroundWrapper'
import { set as setLocalizer } from './localizer'
import momentLocalizer from './localizers/moment'
import globalizeLocalizer from './localizers/globalize'
import move from './utils/move'
import { views, navigate } from './utils/constants'

Object.assign(Calendar, {
  globalizeLocalizer,
  momentLocalizer,
  Views: views,
  Navigate: navigate,
  move,
  components: {
    dayWrapper: BackgroundWrapper,
    dateCellWrapper: BackgroundWrapper,
  },
})

export default Calendar
