import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

import NearTrainingsItem from '../NearTrainingsItem'
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'

class NearTrainings extends React.Component {
    scheduleRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<NearTrainingsItem {...item}
                                       key={index}
                                       onGoto={this.props.onGoto}
            />)
        });
    };

    render() {
        const {data} = this.props;
        const rootClass = cn('schedule-all');

        let arrData = [];
        for (let el in data) {
            if(data.hasOwnProperty(el) && Array.isArray(data[el]) ) {
                arrData.push(data[el]);
            } 
        }

        
        // data={[
        //     {
        //         profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
        //         online: true,
        //         date: 1540813960,
        //         discipline: "Вокал",
        //         name: "Петров василий чвасильевич",
        //         homework: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the " +
        //             "printing and typesetting industry. Lorem Ipsum has been the industry's " +
        //             "standard dummy text ever since the 1500s, when a"
        //     },
        //     {
        //         profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
        //         online: true,
        //         discipline: "Вокал",
        //         name: "Петров ВАСКЕ чвасильевич",
        //         homework: ''
        //     }
        // ]}

       
     
        return (
            <div className={rootClass}>
                <Card title="Ближайшие тренировки"
                      extra={<a className="schedule-all-link" onClick={this.props.openNearTrains}><Icon type="circle_arrow_right"/> <span>Все</span></a>}>
                    {arrData.length ?
                        this.scheduleRender(arrData)
                        : <div className='entry-list no-trainings'>Тренировок нет</div>}
                </Card>
            </div>
        )
    }
}

NearTrainings.propTypes = {};

NearTrainings.defaultProps = {};


export default NearTrainings