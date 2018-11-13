import React from 'react'
import  moment from 'moment'
import {TimePicker  as AntTimePicker} from 'antd'
import PropTypes from "prop-types";


class RangeTp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: this.props.rangeSet.defaultStartValue || null,
            endValue: this.props.rangeSet.defaultEndValue || null,
            disabledHours: [],
            disabledMinutes: [...Array(60).keys()],
            availableMinutes: [],
            isReset: false
        };
    };

    getNotAvailableHours = (availableArea) => {
        if (availableArea.length) {
            let availableHours = [];
            let notAvailableHours = [];
            for (let i = 0; i < availableArea.length; i++) {
                const from = moment(availableArea[i].from).get("hour");
                const to = moment(availableArea[i].to).get("hour");
                let partOfAvailableHours = Array(to - from + 1).fill(0).map((e, i) => from + i);
                availableHours.push(...partOfAvailableHours)
            }
            for (let i = 0; i < 24; i++) {
                if (availableHours.indexOf(i) === -1) {
                    notAvailableHours.push(i);
                }
            }
            this.setState({disabledHours: notAvailableHours})
        } else {
            this.setState({
                disabledHours: [...Array(24).keys()],
                disabledMinutes: [...Array(60).keys()]
            })
        }
    };


    getNotAvailableMin = (hour, availableArea) => {
        const area = availableArea ? availableArea : this.props.availableArea;
        let errorMin = [];
        let beginH, endH, beginM, endM;
        let firstFoundedBegin, firstFoundedEnd;
        let lastFoundedBegin, lastFoundedEnd;
        let outsideInterval = false;

        for (let i = 0; i < area.length; i++) {
            beginH = parseInt(area[i].from.format('HH'));
            if (hour === beginH) {
                beginM = parseInt(area[i].from.format('mm'));
                lastFoundedBegin = beginM;
                if (!firstFoundedBegin) firstFoundedBegin = beginM;

                if (hour === endH) {
                    errorMin.push(...Array.from(Array(beginM).keys())
                        .splice(endM, beginM - endM));
                }
            }

            endH = parseInt(area[i].to.format('HH'));
            if (hour === endH) {
                endM = parseInt(area[i].to.format('mm'));
                lastFoundedEnd = endM;
                if (!firstFoundedEnd) firstFoundedEnd = endM;
            }

            if (beginH < hour && endH > hour) {
                outsideInterval = true;
                break;
            }
        }

        if (!outsideInterval) {
            if (firstFoundedBegin === undefined && firstFoundedEnd === undefined)
                errorMin.push(...Array.from(Array(60).keys()));
            if (firstFoundedBegin && (!firstFoundedEnd || firstFoundedBegin < firstFoundedEnd))
                errorMin.push(...Array.from(Array(firstFoundedBegin).keys()));
            if (lastFoundedEnd && (!firstFoundedBegin || lastFoundedEnd > lastFoundedBegin))
                errorMin.push(...Array.from(Array(60).keys()).splice(lastFoundedEnd, 60 - lastFoundedEnd));
        }

        this.setState({
            disabledMinutes: errorMin
        });
        return errorMin;
    };

    onChange = (field, value) => {

        if(value) {
            this.getNotAvailableMin(value._d.getHours());
            if(field === "start") {
                let minuteAdd = 10 - (+moment(value).format("mm").substr(-1));
                let roundVal = (minuteAdd === 5 || minuteAdd === 10) ? moment(value) : moment(value).add(minuteAdd, 'minute');
                this.setState({startValue: roundVal});
            } else if(field==="end") {
                this.setState({endValue: moment(value, "hh:mm")})
            }

        }

        if(value === null) {
            if(field === "start") {
                this.setState({
                    startValue: null,
                    endValue: null
                })
            } else if(field==="end") {
                this.setState({
                    startValue: null,
                    endValue: null
                })
            }
            this.props.onChange(null);
        }

       else if (field === 'end' && value) {
            let start = this.state.startValue;
            this.setState({
                [field]: value,
            });

            if(!start || value < start){
                const {rangeSet} = this.props;
                const {defaultStartValue} = rangeSet;
                start = defaultStartValue || value;
                this.setState({
                    startValue: start,
                });
            }
            this.props.onChange([start, value]);
        }
        else {
            let minuteAdd = 10 - (+moment(value).format("mm").substr(-1));
            let roundVal = (minuteAdd === 5 || minuteAdd === 10) ? moment(value) : moment(value).add(minuteAdd, 'minute');
            this.setState({
                [field]: roundVal,
                endValue: roundVal,
            });
            this.props.onChange([roundVal, roundVal]);
        }
        this.setState({isReset: false});
        //this.props.onChange([value, value], field, this.props.id);
        //this.props.id ? this.props.onChange(value, field, this.props.id) : this.props.onChange(value, field);
    };

    componentDidMount() {
        this.getNotAvailableHours(this.props.availableArea);
        this.getNotAvailableMin(new Date().getHours(), this.props.availableArea);
        this.setState({isReset:this.props.isReset})
    }


    componentWillReceiveProps(nextProps){
        if(nextProps.isReset !== this.props.isReset && nextProps.isReset === true){
            this.setState({
                startValue: null,
                endValue: null,
            })
        }

        if((nextProps.rangeSet.defaultStartValue !== this.props.rangeSet.defaultStartValue) ||
            (nextProps.rangeSet.defaultEndValue !== this.props.rangeSet.defaultEndValue)) {
            this.setState ({
                startValue: nextProps.rangeSet.defaultStartValue,
                endValue: nextProps.rangeSet.defaultEndValue
            })
        }
        if(nextProps.availableArea !== this.props.availableArea) {
            this.getNotAvailableHours(nextProps.availableArea);
            this.getNotAvailableMin(new Date().getHours(), nextProps.availableArea);
        }

    }

    render() {
        const {format, delimiter, minuteStep} = this.props;
        const {rangeSet} = this.props;
        const {defaultStartValue, defaultEndValue} = rangeSet;
        const {startValue, endValue} = this.state;

        return (
            <div className="timepicker-base-range">
                <AntTimePicker placeholder ={"Начало"}
                               value={this.state.startValue ? this.state.startValue : null}
                               format={format}
                               minuteStep={minuteStep}
                               onChange={(val) => this.onChange("start", val)}
                               disabledHours={() => this.state.disabledHours}
                               disabledMinutes={() => this.disabledMinutes}/>

                {delimiter && <span className="timepicker-base-range-delim"> {delimiter} </span>}

                <AntTimePicker placeholder = {"Конец"}
                               value={this.state.endValue ? this.state.endValue: null}
                               format={format}
                               minuteStep={minuteStep}
                               disabledHours={() => this.state.disabledHours}
                               disabledMinutes={() => this.disabledMinutes}
                               onChange={(val) => this.onChange("end", val)}/>
            </div>
        )
    }
}



RangeTp.propTypes = {
    availableArea: PropTypes.array, // доступный промежуток времени
    format: PropTypes.string, //"HH:mm:ss"
    onChange: PropTypes.func,
    minuteStep: PropTypes.number,
    rangeSet: PropTypes.shape({
        defaultStartValue: PropTypes.object,
        placeholderStart: PropTypes.string,
        defaultEndValue: PropTypes.object,
        placeholderEnd: PropTypes.string,
    }),
};

RangeTp.defaultProps = {
    value: null,
    availableArea: [],
    format: "HH:mm",
    minuteStep: 5,
};

export default  RangeTp;
