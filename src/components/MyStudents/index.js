import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyStudentsItem from "../MyStudentsItem";

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
        console.log(this.props.data, "DATA TO MY STUDENTS")
        const {data} = this.props;
        return (
            <div className='myStudents'>
                <Card title="Мои студенты"
                      extra={<a className="myStudents-link"><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {data.length ?
                        this.studentsRender(data)
                        : <div className='noStudents'>Студентов нет</div>}
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