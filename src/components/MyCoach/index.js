import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyCoachItem from "../MyCoachItem";
import PerfectScrollbar from "react-perfect-scrollbar";
import Spinner from "../Spinner";

class MyCoach extends React.Component {

    state = {
        loading: true
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            this.setState({loading: false});
        }
    }

    coachItemsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<MyCoachItem {...item}
                                    key={index}
                                    onGoto={this.props.onGoto}
                                    goToChat={this.props.goToChat}
            />)
        });
    };

    render() {
        const {data} = this.props;
        const {loading} = this.state;

        return (
            <div className='my-coaches'>
                <Card title="Мои коучи"
                      extra={<a className="my-coaches-link"><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {loading ? <Spinner size='large'/> : <PerfectScrollbar className="my-coaches-scroll">
                        {data.length ?
                            this.coachItemsRender(data)
                            : <div className='entry-list no-trainings'>Коучей нет</div>}
                    </PerfectScrollbar>}
                </Card>
            </div>
        )
    }
}

MyCoach.propTypes = {};

MyCoach.defaultProps = {
    data: []
};


export default MyCoach