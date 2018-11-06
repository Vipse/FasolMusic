import React from 'react'
import {eventLevels} from './utils/eventLevels'
import cn from 'classnames'
import Icon from '../../Icon'
import PopoverApp from '../../Popover'
import moment from 'moment'


class EventRowMonth extends React.Component {
    constructor(props) {
        super(props);
        this.now = new Date();
        this.state = {
            activeDate: 0,
        }
    }

    isSegmentInSlot = (seg, slot) => seg.left <= slot && seg.right >= slot;

    prepareRow = (segments, slotCount) => {
        let rowSegments = eventLevels(segments).levels[0];
        if (!rowSegments) rowSegments = [];

        let current = 1,
            row = [],
            currentInSeg = 0;
        while (current <= slotCount) {
            let {event} =
            rowSegments.filter(seg => this.isSegmentInSlot(seg, current))[0] || {}

            if (!event) {
                row.push(null)
                current++;
                continue
            }

            let gap = 0,
                dayEvents = [];
            for (let i = 0, len = segments.length; i < len; i++) {
                if (segments[i].left == current) {
                    gap++;
                    dayEvents.push(segments[i]);
                    continue;
                }
                if (segments[i].left > current) {
                    break
                }
            }
            if (gap) {
                row.push({
                    gap: gap,
                    ev: dayEvents,
                    date: rowSegments[currentInSeg].event.start
                })
            }
            currentInSeg++;
            current++
        }
        return row;
    };

    renderOneVisit = (el, i, isShort, num = 0, toNull = false) => {
        const key_val = {
            'chat': 'chat1',
            'voice': 'telephone',
            'video': "video-camera",
        };
        return (
            <div key={"uDiv_" + i + "_" + num}
                 className={"separate-visit-div"}>
                <Icon svg type={key_val[el.ev[num].event.type]} size={16}/>
                <div className="vis-info">
                    {moment(el.ev[num].event.start).format("HH:mm")
                    } - {
                    moment(el.ev[num].event.end).format("HH:mm")}
                </div>
                <div className="vis-info">
                    {this.props.isUser ? el.ev[num].event.doctorSpecialty : el.ev[num].event.doctorType}
                </div>
                <div className="vis-info">
                    {this.props.isUser ? el.ev[num].event.doctorName : el.ev[num].event.fio}
                </div>
                {el.gap > 1 && isShort &&
                (<div className="vis-info vis-info-btn"
                      onClick={(e) => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          toNull ?
                              this.setState({activeDate: 0})


                              : this.setState({activeDate: el.date.getDate()})
                      }
                      }>
                    &#x2550;
                </div>)
                }
            </div>
        )
    }

    renderAllVisits = (el, i) => {
        let content = [];
        for (let j = 0; j < el.ev.length; j++) {
            j === el.ev.length - 1 ?
                content.push(this.renderOneVisit(el, i, true, j, true))
                : content.push(this.renderOneVisit(el, i, false, j));
        }
        return content;
    }

    userDiv = (el, i) => {
        return (
            <div className="user-month-row-segment"
                 key={"lvl_" + i}
                 style={{width: `${100 / 7}%`}}>
                {el.gap > 1 && <div className="user-visit-gap">{el.gap}</div>}
                <PopoverApp events={el.ev}
                            isUser={true}
                            cancelAppByPatient={this.props.cancelAppByPatient}

                >
                    <div className="user-visit" style={this.state.activeDate === el.date.getDate() ?
                        {height: "auto"} : {}}>
                        {
                            this.state.activeDate === el.date.getDate() ?
                                this.renderAllVisits(el, i) : this.renderOneVisit(el, i, true)
                        }
                    </div>
                </PopoverApp>
            </div>
        )
    }
    docDiv = (el, i) => {

        let cellClass = cn(
            'month-row-segment',
            {
                'month-row-segment-coming':
                    this.now.getDate() <= el.date.getDate() &&
                    this.now.getMonth() <= el.date.getMonth() &&
                    this.now.getYear() <= el.date.getYear()
            })

        return (<div key={'_lvl_' + i}
                     className={cellClass}
                     style={{width: `${100 / 7}%`}}>
            <div className="month-row-segment-content">
                <div className="icon-count">
                    <Icon type="user" size={28}/>
                </div>
                {el.gap}
            </div>
        </div>)
    }
    renderRow = (row) => {
        return row.map((el, i) => {
            let div = el ?
                this.props.isUser ?
                    this.userDiv(el, i) : this.docDiv(el, i)
                : <div key={'_lvl_' + i}
                       className="rbc-row-segment"
                       style={{width: `${100 / 7}%`}}/>


            return (div)
        });
    };

    prepareEditorRow = (segments, slotCount) => {
        let rowSegments = eventLevels(segments).levels[0];
        if (!rowSegments) rowSegments = [];
        let current = 1,
            row = [],
            currentInSeg = 0;

        while (current <= slotCount) {
            let {event} =
            rowSegments.filter(seg => this.isSegmentInSlot(seg, current))[0] || [];

            if (!event) {
                row.push(null)
                current++;
                continue
            }
            row.push(event)
            currentInSeg++;
            current++
        }

        return row;
    };
    renderEditorRow = (row) => {
        return row.map((el, i) => {
            let cellClass;

            let div = el ? (
                    cellClass = cn(
                        'month-row-segment',
                    ),

                        <div key={'edit-lvl_' + i}
                             className={cellClass}
                             style={{width: `${100 / 7}%`}}>
                            {this.renderScheduleContent(el)}
                        </div>
                ) :
                <div key={'edit-lvl_' + i}
                     className="rbc-row-segment"
                     style={{width: `${100 / 7}%`}}/>


            return (div)
        });
    };

    renderScheduleContent = (sched) => {
        let rootCl = +(sched.isEditable) ? 'root_schedule' : 'root_schedule no-edit'


        return (<div className={rootCl}>
            {+(sched.isEditable)
                ? <Icon type="setting_edit" size={20} svg/>
                : <Icon type="no" size={20} svg/>}

            <div className="month-row-segment-schedule">

                {sched.isDayOff === "1" ? <div className="schedule-isDayOff-item">Выходной</div> :
                    sched.intervalOb.length !== 0
                    && <div className="schedule-time">
                        <div className="schedule-time-item empty"></div>
                        <div className="schedule-time-item">
                            {sched.intervalOb.map((time, i) => (<div key={'time' + i}>
                                {
                                    moment(time.start).format('HH:mm')
                                } - {
                                moment(time.end).format('HH:mm')
                            }
                            </div>))

                            }
                        </div>
                    </div>
                }


                {sched.intervalEx.length !== 0
                && <div className="schedule-emrgtime">
                    <div className="schedule-emrgtime-item with-sign">
                        <div><Icon type="emergency-call" svg size={20}/></div>
                    </div>
                    <div className="schedule-emrgtime-item">
                        {sched.intervalEx.map((time, i) => (<div key={'emrgtime' + i}>
                            {moment(time.start).format('HH:mm')
                            } - {
                            moment(time.end).format('HH:mm')}
                        </div>))

                        }
                    </div>
                </div>
                }
            </div>
        </div>)
    }


    render() {
        let {segments, scheds, editor, slots: slotCount = 7} = this.props;

        let row = [];

        if (!editor)
            row = this.prepareRow(segments, slotCount);
        else
            row = this.prepareEditorRow(scheds, slotCount);

        return <div className="month-row"
                    style={this.props.isUser ? {zIndex: 8} : {}}>
            {editor
                ? this.renderEditorRow(row)
                : this.renderRow(row)}
        </div>
    }

}

export default EventRowMonth
