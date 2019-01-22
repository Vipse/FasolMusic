import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyCoachItem from "../MyCoachItem";

class MyCoach extends React.Component {
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
        return (
            <div className='myStudents'>
                <Card title="Мои коучи"
                      extra={<a className="myStudents-link" ><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {data.length ?
                        this.coachItemsRender(data)
                        : <div className='noStudents'>Коучей нет</div>}
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