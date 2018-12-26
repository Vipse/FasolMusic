import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyCoachItem from "../MyCoachItem";

class MyCoach extends React.Component {
    studentsRender = (dataArr) => {
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
        console.log('MYSTUDENT :', this.props);
        return (
            <div className='myStudents'>
                <Card title="Мои студенты"
                      extra={<a className="myStudents-link" ><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {data.length ?
                        this.studentsRender(data)
                        : <div className='noStudents'>Студентов нет</div>}
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