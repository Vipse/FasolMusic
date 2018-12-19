import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import './style.css'
import '../../icon/style.css'

class StudentPagePerfectCoach extends React.Component {
    state = {};

    render() {
        const { sex, age, homework, qualities, comment } = this.props;

        return (
            <Card title="Идеальный тренер">
                    <div className="perfect-coach">
                            <div className="perfect-coach-fields">
                                <div className="perfect-coach-fields-row">Пол <span className="data">{sex === 'm' ? "Мужской" : "Женский"}</span></div>
                                <div className="perfect-coach-fields-row">Возраст <span className="data">{age}</span></div>
                                <div className="perfect-coach-fields-row">Дает домашнее задание <span className="data">{homework ? "Да" : "Нет"}</span></div>
                                <div className="perfect-coach-fields-row">Качества <span className="data">{qualities.join(', ')}</span></div>
                            </div>
                        <div className="perfect-coach-comment">
                            <p>{comment}</p>
                        </div>
                    </div>
            </Card>
        )
    }
}

StudentPagePerfectCoach.propTypes = {
    sex: PropTypes.string,
    age: PropTypes.string,
    homework: PropTypes.number,
    qualities: PropTypes.arrayOf(PropTypes.string)
};

StudentPagePerfectCoach.defaultProps = {
    sex: 'm',
    age: "",
    homework: 0,
    qualities: []
};

export default StudentPagePerfectCoach
