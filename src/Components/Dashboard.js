import React, { useEffect, useState } from 'react'
import './Stylesheets/Dashboard.css'
//import { useNavigate } from 'react-router-dom';
//import windowAggregateData from '../windowAggregateData.json';
// import { BiReset } from 'react-icons/bi';
// import { AiOutlineFilter } from 'react-icons/ai';

import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import GroupByResult from './GroupByResult';
import windowAggregateService from '../Services/windowAggregateService';
const Dashboard = ({ windowAggregateData, setWindowAggregateData }) => {
    const [open, setOpen] = useState(false);
    // const [windowAggregateData, setWindowAggregateData] = useState([]);
    const [windowGroupByData, setWindowGroupByData] = useState([]);
    const [queryId, setQueryId] = useState('');
    const [query, setQuery] = useState('');
    //const navigate = useNavigate();
    // console.log(user);



    const handleGetData = param => event => {
        event.preventDefault();
        const reqParams = {
            queryId: param[0]
        }
        setQueryId(param[0]);
        setQuery(param[2]);
        //console.log(reqParams);
        fetchGetData(reqParams);
        setOpen(true);

    }
    const fetchData = async () => {
        try {
            const response = await windowAggregateService.getQueries()
            if (response) {
                setWindowAggregateData(response);
            }
        }
        catch (exception) {
            alert("Failed to Load Data");
        }
    }
    //fetchData();
    const fetchGetData = async (reqParams) => {
        try {
            const response = await windowAggregateService.getData(reqParams)
            if (response) {
                setWindowGroupByData(response);
            }
            console.log(response);
        }
        catch (exception) {
            alert("Failed to Load Data");
        }
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 15000);

        return () => clearInterval(intervalId);
    }, []);
    return (
        <div>
            <div className='DashboardPage container container-responsive'>
                <div className='container container-fluid shadow-sm bg bg-white py-2'>
                    <div className="card m-1">
                        <div className="card-header">
                            <div className='h6 text-center text-primary'>Stream Data Analytics</div>
                        </div>
                        <div className="card-body">
                            <p className="card-text"></p>


                            {
                                (windowAggregateData
                                    .length === 0) ?
                                    <div className='text-center text-info text-bold'>No Data Is Available</div> :


                                    <table class="table table-hover">
                                        {windowAggregateData.map((row, rowIndex) => (
                                            (rowIndex === 0) ?
                                                <thead>
                                                    <tr>
                                                        {row.map((cell, cellIndex) => (
                                                            (cellIndex !== 3) &&
                                                            <th key={`${rowIndex}-${cellIndex}`}>{cell}</th>
                                                        ))}
                                                        <th>Result</th>
                                                    </tr>

                                                </thead>

                                                :
                                                <tbody>
                                                    <tr key={rowIndex}>
                                                        {row.map((cell, cellIndex) => (
                                                            (cellIndex !== 3) &&
                                                            <td key={`${rowIndex}-${cellIndex}`} className={(cellIndex === 2) ? "text-sm text-success" : ""}>{cell}</td>
                                                        ))}
                                                        <td>
                                                            <div>
                                                                <BsFillArrowRightCircleFill onClick={handleGetData(row)} size={20} style={{color:"navy"}}/>
                                                                <Modal open={open} onClose={() => setOpen(false)} setOpen={setOpen} center classNames={{
                                                                    overlay: 'customOverlay',
                                                                }}>
                                                                    {/* closeOnOverlayClick={false} */}
                                                                    <h4 style={{ color: "navy" }} className='text-start mx-5'>Generic Query Result</h4>
                                                                    <p>Query: {queryId} - {query}</p>
                                                                    <GroupByResult data={windowGroupByData} />
                                                                </Modal>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                        ))}
                                    </table>
                            }
                        </div>
                        <div className="card-footer text-center text-secondary">
                            {windowAggregateData.length} Queries in the Repository
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard