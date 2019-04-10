import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";

import Hoc from '../../hoc'
import PerfectScrollbar from 'react-perfect-scrollbar';
import DownloadLink from "../../components/DownloadLink";
import Card from "antd/es/card";
import Button from "../../components/Button";
import DatePicker from "../../components/DatePicker";
import Spinner from "../../components/Spinner";
import {message} from "antd";
import moment from "moment";

class AdminMain extends React.Component{

    state = {
        loadingLinks: false,
        reportLinksReady: false,
        loadingRegLinks:false,
        reportLinksRegReady: false,
        reportDateRange: []
    };

    filesList = [];

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.reportLinks !== this.props.reportLinks && this.state.loadingLinks)
            this.setState({
                reportLinksReady: true,
                loadingLinks: false
            });

        if (prevProps.reportRegistrationLinks !== this.props.reportRegistrationLinks && this.state.loadingRegLinks)
            this.setState({
                reportLinksRegReady: true,
                loadingRegLinks: false
            });
    }

    renderFilesList = () => {
        if (this.filesList.length) return this.filesList.map((file, i) => {
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
        else return <div className='entry-list no-trainings'>Актов работ нет</div>
    };

    handleCreateReport = () => {
        const {reportDateRange} = this.state;
    
        if (reportDateRange.length) {
            this.setState({loadingLinks: true});
            this.props.onGetReport(reportDateRange[0], reportDateRange[1])
                .then(res => {
                    if (res && res.data && res.data.process) message.success('Отчет сформирован');
                    else message.error('Ошибка при формировании отчета');
                    this.setState({loadingLinks: false});
                })
                .catch(err => console.log(err));
        }
        else message.error('Не выбран период');
    };

    handleChangeReportDateRange = (dateRange) => {
        this.setState({
            loadingLinks: false,
            reportLinksReady: false,
            reportDateRange: dateRange.every((item => item)) ?
                [
                    moment(dateRange[0]).startOf('day').format('X'),
                    moment(dateRange[1]).endOf('day').format('X')
                ] : []
        });
    };

    handleCreateRegistrationReport = () => {
        this.setState({loadingRegLinks: true});
        this.props.onGetRegistrationRepost()

            .then(res => {
                if (res && res.data && res.data.process) message.success('Отчет сформирован');
                else message.error('Ошибка при формировании отчета');
                this.setState({loadingRegLinks : false});
            })
            .catch(err => console.log(err));
    };

    render() {
        const {reportLinks, reportRegistrationLinks} = this.props;
        const {loadingLinks, reportLinksReady, loadingRegLinks, reportLinksRegReady} = this.state;

        return (
            <Hoc>
                <Row gutter={32}>
                    <Col className='section' xs={13}>
                        <Card className="payment-coach-record" title="Акты выполненных работ">
                            <PerfectScrollbar className="payment-coach-record-overlay">
                                {this.renderFilesList()}
                            </PerfectScrollbar>
                        </Card>
                    </Col>
                    <Col className='section' xs={11}>
                        <Card title="Получение отчета">
                            <div className="admin-payload">
                                <p>Выберите период для формирования отчета</p>
                                <DatePicker width ="100%"
                                            rangeSet={{placeholderStart: "От", placeholderEnd: "До"}}
                                            range
                                            onChange={this.handleChangeReportDateRange}
                                />
                                <div className="admin-payload-btnPlate">
                                    {loadingLinks ? <Spinner/> :
                                        reportLinksReady ?
                                            <React.Fragment>
                                                <a className="admin-payload-btnPlate-link"
                                                   target='_blank'
                                                   href={reportLinks.excelLink}>
                                                    <Button
                                                        type='light-pink'
                                                        btnText='Загрузить Excel-файл'
                                                    />
                                                </a>
                                                <a className="admin-payload-btnPlate-link"
                                                   target='_blank'
                                                   href={reportLinks.htmlLink}
                                                >
                                                    <Button
                                                        type='light-pink'
                                                        btnText='Открыть HTML'
                                                    />
                                                </a>
                                            </React.Fragment>
                                            : <Button
                                                type='light-pink'
                                                btnText='Сформировать отчет'
                                                onClick={this.handleCreateReport}
                                            />}
                                </div>
                            </div>

                            <div className="admin-payload">
                                <div className="admin-payload-btnPlate">
                                    {loadingRegLinks ? <Spinner/> :
                                        reportLinksRegReady ?
                                            <React.Fragment>
                                                <a className="admin-payload-btnPlate-link"
                                                   target='_blank'
                                                   href={reportRegistrationLinks.excelLink}>
                                                    <Button
                                                        type='light-pink'
                                                        btnText='Загрузить Excel-файл регистраций'
                                                    />
                                                </a>
                                                <a className="admin-payload-btnPlate-link"
                                                   target='_blank'
                                                   href={reportRegistrationLinks.htmlLink}
                                                >
                                                    <Button
                                                        type='light-pink'
                                                        btnText='Открыть HTML регистраций'
                                                    />
                                                </a>
                                            </React.Fragment>
                                            : <Button
                                                type='light-pink'
                                                btnText='Сформировать отчет регистраций'
                                                onClick={this.handleCreateRegistrationReport}
                                            />}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Hoc>
        )
    }
}

export default AdminMain;
