import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";

import Hoc from '../../hoc'
import PerfectScrollbar from 'react-perfect-scrollbar';
import DownloadLink from "../../components/DownloadLink";
import Card from "antd/es/card";

class AdminMain extends React.Component{
    constructor(props) {
        super(props);
    }

    filesList = [
        {
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        }
    ];

    renderFilesList = () => {
        return this.filesList.map((file, i) => {
            return <div className="file">
                <DownloadLink {...file}
                              key={file.id + '' + i}
                              size="default"
                              type="link"
                              svg
                              icon="file"
                              iconSize={14}
                              download
                              btnText={file.name}
                />
            </div>;
        });
    };

    render(){
        return (
            <Hoc>
                <Row>
                    <Col className='section'>
                        <Card className="payment-coach-record" title="Акты выполненных работ">
                            <PerfectScrollbar className="payment-coach-record-overlay">
                                {this.renderFilesList()}
                            </PerfectScrollbar>
                        </Card>
                    </Col>
                </Row>
            </Hoc>
        )
    }
}

export default AdminMain;
