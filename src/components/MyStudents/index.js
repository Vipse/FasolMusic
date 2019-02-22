import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyStudentsItem from "../MyStudentsItem";
import PerfectScrollbar from 'react-perfect-scrollbar'
import Spinner from "../Spinner";

class MyStudents extends React.Component {

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
            return (<MyStudentsItem {...item}
                                    key={index}
                                    onGoto={this.props.onGoto}
                                    goToChat={this.props.goToChat}

            />)
        });
    };

    render() {
        const {data, openMyStudents} = this.props;
        const {loading} = this.state;

        return (
            <div className='my-students'>
                <Card title="Мои студенты"
                      extra={<a className="my-students-link" onClick={openMyStudents}>
                          <Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {loading ? <Spinner size='large'/> : (data.length ?
                        this.studentsRender(data)
                        : <div className='entry-list no-trainings'>Студентов нет</div>)}
                </Card>
            </div>
        )
    }
}

MyStudents.propTypes = {};

MyStudents.defaultProps = {
    data: []
};


export default MyStudents
