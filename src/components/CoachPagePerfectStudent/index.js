import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import './style.css'
import '../../icon/style.css'

class CoachPagePerfectStudent extends React.Component {
    state = {};

    render() {
        const {sex, age, homework, qualities, comment} = this.props;

        return (
            <Card title="Идеальный студент">
                <div className="perfect-student">
                    <div className="perfect-student-fields">
                        <div className="field">Пол <span className="value">{sex === 'm' ? "Мужской" : "Женский"}</span>
                        </div>
                        <div className="field">Возраст <span className="value">{age}</span></div>
                        <div className="field">Хочет получать домашнее задание <span
                            className="value">{homework ? "Да" : "Нет"}</span></div>
                        <div className="field">Качества <span className="value">{qualities.join(", ")}</span></div>
                    </div>
                    <div className="perfect-student-comment">
                        <p>{comment}</p>
                    </div>
                </div>
            </Card>
        )
    }
}

CoachPagePerfectStudent.propTypes = {
    sex: PropTypes.string,
    age: PropTypes.string,
    homework: PropTypes.number,
    qualities: PropTypes.arrayOf(PropTypes.string)
};

CoachPagePerfectStudent.defaultProps = {
    sex: 'm',
    age: "",
    homework: 0,
    qualities: []
};

export default CoachPagePerfectStudent
