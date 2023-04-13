import React, { useEffect, useState } from 'react'
import './Stylesheets/Dashboard.css'
//import { useNavigate } from 'react-router-dom';
//import windowAggregateData from '../windowAggregateData.json';
import { BiReset } from 'react-icons/bi';
import { AiOutlineFilter } from 'react-icons/ai';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import GroupByResult from './GroupByResult';
import windowAggregateService from '../Services/windowAggregateService';
const Dashboard = ({windowAggregateData, setWindowAggregateData}) => {
    const [aggSearchValue, setAggSearchValue] = useState('');
    const [fvSearchValue, setFvSearchValue] = useState('');
    const [open, setOpen] = useState(false);
    // const [windowAggregateData, setWindowAggregateData] = useState([]);
    const [windowGroupByData, setWindowGroupByData] = useState([]);
    const [queryId, setQueryId] = useState('');
    //const navigate = useNavigate();
    // console.log(user);

    var uniqueAggFun = [];
    var uniqueFactVariables = [];
    for (let i = 0; i < windowAggregateData.length; i++) {
        if (uniqueAggFun.indexOf(windowAggregateData[i].aggregateFunction) === -1) {
            uniqueAggFun.push(windowAggregateData[i].aggregateFunction);
        }
        if (uniqueFactVariables.indexOf(windowAggregateData[i].factVariable) === -1) {
            uniqueFactVariables.push(windowAggregateData[i].factVariable);
        }
    }

    var aggregateFunctionList = uniqueAggFun.map((queryItem, index) => {
        return {
            id: index,
            value: queryItem,
            displayName: queryItem
        }
    });
    var factVariableList = uniqueFactVariables.map((queryItem, index) => {
        return {
            id: index,
            value: queryItem,
            displayName: queryItem
        }
    });

    function Options({ options }) {
        return (
            options.map(option =>
                <option key={option.id} value={option.value}>
                    {option.displayName}
                </option>)
        );
    }

    const handleGetData = param => event => {
        event.preventDefault();
        const reqParams = {
            queryId: param
        }
        setQueryId(param);
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
        }
        catch (exception) {
            alert("Failed to Load Data");
        }
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);
    return (
        <div>
            <div className='DashboardPage container container-responsive'>
                <div className='container container-fluid shadow-sm bg bg-white py-2'>
                    <div className="card text-center m-1">
                        <div className="card-header">
                            <div className='h6 text-start text-primary'>Window Aggregate Analytics</div>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title text-sm">Stream Data Aggregate Analytics</h5>
                            <p className="card-text"></p>
                            <div className='row text-info'>
                                <div className="form-floating  mx-5 col-4 col-sm-2">
                                    <select className="form-select" id="aggFun" aria-label="Floating label select example" value={aggSearchValue} onChange={(e) => setAggSearchValue(e.target.value)}>
                                        <option selected value="">All</option>
                                        <Options options={aggregateFunctionList} />
                                    </select>
                                    <label for="aggFun"><AiOutlineFilter /> Agg. Function</label>
                                </div>
                                <div className='form-floating col-4 col-sm-2 mx-5'>
                                    <select className="form-select" id="fv" aria-label="Floating label select example" value={fvSearchValue} onChange={(e) => setFvSearchValue(e.target.value)}>
                                        <option selected value="">All</option>
                                        <Options options={factVariableList} />
                                    </select>
                                    <label for="fv"><AiOutlineFilter /> Fact Variable</label>
                                </div>
                                <div onClick={() => { setAggSearchValue(''); setFvSearchValue('') }} style={{ cursor: "pointer" }} className='col-sm-auto mt-2'>
                                    <BiReset /> Reset
                                </div>
                            </div>

                            {
                                (windowAggregateData
                                    .filter((queryItem) => { return (aggSearchValue === "" || aggSearchValue === queryItem.aggregateFunction) })
                                    .filter((queryItem) => { return (fvSearchValue === "" || fvSearchValue === queryItem.factVariable) })
                                    .length === 0) ?
                                    <div className='text-center text-info text-bold'>No Data Is Available</div> :


                                    <table class="table table-hover table-responsive">
                                        <thead>
                                            <tr>
                                                <th scope="col">Query Id.</th>
                                                <th scope="col">Fact Variable</th>
                                                <th scope="col">Aggregate Function</th>
                                                <th scope="col">Group By</th>
                                                <th scope="col">Result(s)</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table table-hover  table-responsive'>
                                            {
                                                windowAggregateData
                                                    .filter((queryItem) => { return (aggSearchValue === "" || aggSearchValue === queryItem.aggregateFunction) })
                                                    .filter((queryItem) => { return (fvSearchValue === "" || fvSearchValue === queryItem.factVariable) })
                                                    .map((queryItem) => (
                                                        <tr>
                                                            <th scope="row">{queryItem.queryId}</th>
                                                            <td>{queryItem.factVariable}</td>
                                                            <td>{queryItem.aggregateFunction}</td>
                                                            <td>{
                                                                queryItem.groupByAttributes.length === 0 ? "-" :
                                                                    <div className='bg bg-white'>
                                                                        {
                                                                            queryItem.groupByAttributes.map((groupItem, index) => (
                                                                                <div key={index}> {groupItem} </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                            }
                                                            </td>
                                                            <td>{
                                                                queryItem.groupByAttributes.length !== 0 ?
                                                                    <div className='bg bg-white'>
                                                                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleGetData(queryItem.queryId)}>View Result</button>
                                                                        <Modal open={open} onClose={() => setOpen(false)} setOpen={setOpen} center classNames={{
                                                                            overlay: 'customOverlay',
                                                                        }}>
                                                                            {/* closeOnOverlayClick={false} */}
                                                                            <h4 style={{ color: "navy" }} className='text-start mx-5'>Group By Result</h4>
                                                                            {/* <h5>Request: {consentRequestId} &ensp; &ensp; Doctor: {doctorId} - {doctorName}</h5> */}
                                                                            {/* <p style={{ fontStyle: "italic", fontFamily: "cursive" }}>(*) Tick your health records that can be viewed by Requested Doctor.</p> */}
                                                                            <GroupByResult data={windowGroupByData} queryId={queryId}/>
                                                                        </Modal>
                                                                    </div> :
                                                                    queryItem.result}
                                                            </td>
                                                        </tr>
                                                    ))
                                            }

                                        </tbody>
                                    </table>
                            }
                        </div>
                        <div className="card-footer text-muted">
                            {windowAggregateData.length} Queries in the Repository
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard