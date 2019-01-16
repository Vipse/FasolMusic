import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyStudentsItem from "../MyStudentsItem";
import PerfectScrollbar from 'react-perfect-scrollbar'

class MyStudents extends React.Component {
    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<MyStudentsItem {...item}
                                    key={index}
                                    onGoto={this.props.onGoto}
            />)
        });
    };

    render() {


        const {data} = this.props;
        console.log('MYSTUDENT :', this.props);
        return (
            <div className='lastTrainings'>
                <Card title="Мои студенты"
                      extra={<a className="myStudents-link" >
                            <Icon type="circle_arrow_right"/>
                            <span>Весь список</span></a>}>
                            <PerfectScrollbar className="lastTrainings-scroll">    
                                        {data.length ?
                                            this.studentsRender(data)
                                            : <div className='noStudents'>Студентов нет</div>}
                            </PerfectScrollbar>
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