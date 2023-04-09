import React, { useEffect, useState } from 'react'
import './Stylesheets/Dashboard.css'
//import { useNavigate } from 'react-router-dom';
import windowAggregateData from '../windowAggregateData.json';
import { BiReset } from 'react-icons/bi';
import { AiOutlineFilter } from 'react-icons/ai';
const Dashboard = () => {
    const [aggSearchValue, setAggSearchValue] = useState('');
    const [fvSearchValue, setFvSearchValue] = useState('');

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

    return (
        <div>
            <div className='DashboardPage'>
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
                                <div onClick={() => { setAggSearchValue(''); setFvSearchValue('') }} style={{ cursor: "pointer" }} className='col-sm-auto'>
                                    <BiReset /> Reset
                                </div>
                            </div>

                            {
                                (windowAggregateData
                                    .filter((queryItem) => { return (aggSearchValue === "" || aggSearchValue === queryItem.aggregateFunction) })
                                    .filter((queryItem) => { return (fvSearchValue === "" || fvSearchValue === queryItem.factVariable) })
                                    .length === 0) ?
                                    <div className='text-center text-info text-bold'>No Data Is Available</div> :


                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Query Id.</th>
                                                <th scope="col">Fact Variable</th>
                                                <th scope="col">Aggregate Function</th>
                                                <th scope="col">Group Id.</th>
                                                <th scope="col">Result(s)</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table table-hover'>
                                            {
                                                windowAggregateData
                                                    .filter((queryItem) => { return (aggSearchValue === "" || aggSearchValue === queryItem.aggregateFunction) })
                                                    .filter((queryItem) => { return (fvSearchValue === "" || fvSearchValue === queryItem.factVariable) })
                                                    .map((queryItem) => (
                                                        <tr>
                                                            <th scope="row">{queryItem.queryId}</th>
                                                            <td>{queryItem.factVariable}</td>
                                                            <td>{queryItem.aggregateFunction}</td>
                                                            <td>{queryItem.groupId === 0 ? "-NA-" : queryItem.groupId}</td>
                                                            <td>{queryItem.groupId !== 0 ?
                                                                <button type="button" className="btn btn-outline-primary btn-sm">View Result</button> :
                                                                queryItem.result}</td>
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