import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";
import TopPanel from "../../components/TopPanel";
import Reviews from "../../components/Reviews";
import NearTrainings from "../../components/NearTrainings";
import Icon from "../../components/Icon";

import Hoc from '../../hoc'
import MyStudents from "../../components/MyStudents";
import LastTrainings from "../../components/LastTrainings";

const CouchMain = props => {

    const gotoHandler = (id) => {
		props.onSelectPatient(id);
		props.history.push('/app/patient'+id);
	}
    return (
        <Hoc>
					<Row>
						<Col span={24} className='section'>
							<TopPanel  {...props.docTodayInfo}/>
						</Col>
					</Row>

					<Row>
						<Col xs={14} xxl={7} className='section'>
                            <NearTrainings
                                onGoto={(val) => gotoHandler(val)}
                                data={[{
                                    start: 1540907648,
                                    end: 1540908648,
                                    discipline: "Вокал",
                                    name: "Петров василий  васильевичв асильеви чвасильеви чвасильевич"
                                }]}

                            />
						</Col>
						<Col xs={14} xxl={8} className='section'>
                            <LastTrainings
                                onGoto={(val) => gotoHandler(val)}
                                data={[
                                	{
                                    profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                    online: true,
									date: 1540813960,
                                    discipline: "Вокал",
                                    name: "Петров василий чвасильевич",
                                    homework: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the " +
                                        "printing and typesetting industry. Lorem Ipsum has been the industry's " +
                                        "standard dummy text ever since the 1500s, when a"
                                	},
                                    {
                                        profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                        online: true,
                                        discipline: "Вокал",
                                        name: "Петров ВАСКЕ чвасильевич",
                                        homework:''
                                    }
                                ]}

                            />
						</Col>

						<Col xs={14} xxl={9} className='section'>
                            <MyStudents
                                onGoto={(val) => gotoHandler(val)}
                                data={[{
                                    profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                    online: true,
                                    discipline: "Вокал",
                                    name: "Петров василий чвасильевич",
                                    lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the " +
                                        "printing and typesetting industry. Lorem Ipsum has been the industry's " +
                                        "standard dummy text ever since the 1500s, when a"
                                },
								{
									profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
									online: true,
									discipline: "Вокал",
									name: "Петров ВАСКЕ чвасильевич",
									lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the " +
										"printing and typesetting industry. Lorem Ipsum has been the industry's " +
										"standard dummy text ever since the 1500s, when a"
								}
								]}

                            />
						</Col>
					</Row>

                </Hoc>
    )
}

export default CouchMain;
