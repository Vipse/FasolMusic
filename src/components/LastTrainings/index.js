import React from 'react';
import * as PropTypes from "prop-types";
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import LastTrainingsItem from "../LastTrainingsItem";
import PerfectScrollbar from 'react-perfect-scrollbar'
import Spinner from "../Spinner";

class LastTrainings extends React.Component {

    state = {
        loading: true
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            this.setState({loading: false});
        }
    }

    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<LastTrainingsItem {...item}
                                       key={index}
                                       onGoto={this.props.onGoto}
            />)
        });
    };

    render() {
        const {data, openLastTrains} = this.props;
        const {loading} = this.state;

        return (
            <div className='lastTrainings'>
                <Card title="Последние тренировки"
                      extra={<a className="lastTrainings-link" onClick={openLastTrains}><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {loading ? <Spinner size='large'/> : <PerfectScrollbar className="lastTrainings-scroll">
                    {data.length ? this.studentsRender(data) :
                        <div className='entry-list no-trainings'>Тренировок ещё не было</div>}
                    </PerfectScrollbar>}
                </Card>
            </div>
        )
    }
}

LastTrainings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

LastTrainings.defaultProps = {
    data: []
};


export default LastTrainings