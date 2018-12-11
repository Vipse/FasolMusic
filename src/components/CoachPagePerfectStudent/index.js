import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import ScrollArea from 'react-scrollbar'
import './style.css'
import '../../icon/style.css'

class CoachPagePerfectStudent extends React.Component {
    state = {};

    render() {
        const { sex, age, homework, qualities } = this.props;

        return (
            <Card title="Идеальный студент">
                <ScrollArea
                    speed={0.5}
                    contentClassName="flex-div"
                    smoothScrolling={true}
                >
                    <div className="perfect-student">
                            <div className="perfect-student-fields">
                                <div className="perfect-student-fields-row">Пол <span className="data">{sex === 'm' ? "Мужской" : "Женский"}</span></div>
                                <div className="perfect-student-fields-row">Возраст <span className="data">{age}</span></div>
                                <div className="perfect-student-fields-row">Хочет получать домашнее задание <span className="data">{homework ? "Да" : "Нет"}</span></div>
                                {/*<div className="perfect-student-fields-row">Качества <span className="data">{qualities.join(" ")}</span></div>*/}
                            </div>
                        <div className="perfect-student-comment">
                            <p>Комментарий о студенте</p>
                        </div>
                    </div>
                </ScrollArea>

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
