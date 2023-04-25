import React, { useEffect, useState } from 'react'
import './Stylesheets/Analytics.css'
//import dimensionalData from '../dimensionalData.json'
import windowAggregateService from '../Services/windowAggregateService';

// import { BiReset } from 'react-icons/bi';
import { AiOutlineFilter } from 'react-icons/ai';
import DropdownSequence from './DropdownSequence';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { random } from 'lodash';
function Table({ data }) {
    return (
        <div className='container container-fluid container-sm bg bg-light' style={{ width: "48rem" }}>
            <table class="table table-hover">
                {
                    (data) &&
                    data.map((row, rowIndex) => (
                        (rowIndex === 0) ?
                            <thead>
                                <tr>
                                    {
                                        (row) &&
                                        row.map((cell, cellIndex) => (
                                            <th key={`${rowIndex}-${cellIndex}`}>{cell.toUpperCase()}</th>
                                        ))}
                                </tr>
                            </thead>

                            :
                            <tbody>
                                <tr key={rowIndex}>
                                    {
                                        (row) &&
                                        row.map((cell, cellIndex) => (
                                            <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                                        ))}
                                </tr>
                            </tbody>
                    ))}
            </table>

        </div>
    );
}
const DimensionalAnalytics = ({ dimensionalData }) => {
    const [factVariable, setFactVariable] = useState('');
    const [aggFun, setAggFun] = useState('');
    const [dimensions, setDimensions] = useState([]);
    const [data, setData] = useState([]);
    const [logs, setLogs] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [timestamp, setTimestamp] = useState("2000-01-01T00:00");
    const [endTimestamp, setEndTimestamp] = useState("2023-12-31T23:59");
    const [processedTimestamp, setProcessedTimestamp] = useState('');
    const [processedEndTimestamp, setProcessedEndTimestamp] = useState('');
    const [id, setId] = useState([]);
    const [strokeColor, setStrokeColor] = useState([]);
    var factVariableList = [];
    var aggregateFunctionList = [];
    if (dimensionalData && dimensionalData.factVariables) {
        factVariableList = dimensionalData.factVariables.map((item, index) => {
            return {
                id: index,
                value: item,
                displayName: item
            }
        })
    }
    if (dimensionalData && dimensionalData.aggregateFunctions) {
        aggregateFunctionList = dimensionalData.aggregateFunctions.map((item, index) => {
            return {
                id: index,
                value: item,
                displayName: item
            }
        })
    }
    // console.log(dimensionalData);

    function Options({ options }) {
        return (
            options.map(option =>
                <option key={option.id} value={option.value}>
                    {option.displayName}
                </option>)
        );
    }

    function handleSelectionChange(input) {
        setDimensions(input);
        // console.log(input);
    }



    const fetchGetLogs = async (reqBody) => {
        try {
            const response = await windowAggregateService.getSomethingLogs(reqBody)
            if (response) {
                setLogs(response);
            }
            console.log("Logs: ", response);
        }
        catch (exception) {
            alert("Failed to Load Data");
        }
    }

    const fetchGetData = async (reqBody) => {
        try {
            const response = await windowAggregateService.getSomething(reqBody)
            if (response) {
                setData(response);
            }
            //console.log(response);
        }
        catch (exception) {
            alert("Failed to Load Data");
        }
    }

    const processLogs = (processedTimestamp, processedEndTimestamp) => {
        const [header, ...rows] = logs;
        //Transform into well formed JSON
        const transformedLogs = rows.map(row => {
            return header.reduce((obj, key, index) => {
                obj[key] = row[index];
                return obj;
            }, {});
        });
        // console.log("Logs: ", transformedLogs);

        //GroupBy Timestamp then Filter by Given Range

        setChartData(groupByTimestamp(transformedLogs)
            .filter((item) => { return (item.timestamp >= processedTimestamp) && (item.timestamp <= processedEndTimestamp) }));

        //console.log("Chart Data: ", chartData);
        setId(data.map(row => row[0]).slice(1));
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!factVariable || !aggFun || !dimensions) {
            return;
        }
        const reqBody = {
            "aggregateFunction": aggFun,
            "factVariable": factVariable,
            "dimensions": dimensions
        }
        fetchGetData(reqBody);
        fetchGetLogs(reqBody);

        let inputArray = timestamp.split('T');
        inputArray[1] += ":00.000";
        setProcessedTimestamp(inputArray[0] + " " + inputArray[1]);
        // console.log("processedTimestamp", processedTimestamp, typeof (processedTimestamp));

        inputArray = endTimestamp.split('T');
        inputArray[1] += ":00.000";
        setProcessedEndTimestamp(inputArray[0] + " " + inputArray[1]);
        // console.log("processedEndTimestamp", processedEndTimestamp, typeof (processedEndTimestamp));

        processLogs(processedTimestamp, processedEndTimestamp);

        setId(data.map(row => row[0]).slice(1));
        for (let i = 0; i < id.length; i++) {
            setStrokeColor((strokeColor) => [...strokeColor, `#${random(0xffffff).toString(16)}`]);
            //console.log(strokeColor);
        }

    }

    useEffect(() => {
        processLogs(processedTimestamp, processedEndTimestamp);
        //console.log("Chart Data",chartData);
        //console.log("Filtered Logs: ",logs.filter(item => (item[logs[0].length-1] >= processedTimestamp) && (item[logs[0].length-1] <= processedEndTimestamp)));
    }, [logs]);
    useEffect(() => {
        setStrokeColor([]);
        for (let i = 0; i < id.length; i++) {
            setStrokeColor((strokeColor) => [...strokeColor, `#${random(0xffffff).toString(16)}`]);
            //console.log(strokeColor);
        }
    }, [id]);


    //Group Data By Timestamp
    const groupByTimestamp = (data) => {
        const result = {};
        data.forEach((d) => {
            const timestamp = d.timestamp;
            if (result[timestamp]) {
                result[timestamp][d.id] = d.result;
            } else {
                result[timestamp] = { [d.id]: d.result };
            }
        });
        return Object.keys(result).map((timestamp) => ({
            timestamp,
            ...result[timestamp],
        }));
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip border p-5">
                    <p className="label">{`Timestamp: ${label}`}</p>
                    {
                        (id) &&
                        id.map((cell, index) => (
                            <p style={{ color: strokeColor[index] }}>{(cell && payload[index] && payload[index].value) ? `${cell} : ${payload[index].value}` : ``}</p>
                        ))
                    }
                </div>
            );
        }

        return null;
    };
    useEffect(() => {
        // console.log(data);
    }, [data]);
    return (
        <div className='AnalyticsPage bg bg-light py-3'>
            <div className='container-sm mx-auto my-2 p-3 shadow-sm bg bg-white'>
                <div className='input-group mx-auto'>
                    {
                        (dimensionalData && dimensionalData.dimensions) &&
                        <DropdownSequence options={dimensionalData.dimensions} onChange={handleSelectionChange} />
                    }

                </div>
                <br />
                <form onSubmit={handleSubmit}>
                    <div className='input-group row'>
                        <div className='form-floating col mx-5' style={{ maxHeight: "5px", minWidth: "200px" }}>
                            <select className="form-select" id="fv" aria-label="Floating label select example" value={factVariable} onChange={(e) => setFactVariable(e.target.value)} required>
                                <option selected value="" disabled>Select Any</option>
                                <Options options={factVariableList} />
                            </select>
                            <label for="fv"><AiOutlineFilter /> Fact Variable</label>
                        </div>
                        <div className='form-floating col mx-5' style={{ minWidth: "200px" }}>
                            <select className="form-select" id="fv" aria-label="Floating label select example" value={aggFun} onChange={(e) => setAggFun(e.target.value)} required>
                                <option selected value="" disabled>Select Any</option>
                                <Options options={aggregateFunctionList} />
                            </select>
                            <label for="fv"><AiOutlineFilter /> Aggregate Function</label>
                        </div>
                        <label class="control-label mx-3 mt-2 col col-sm-1" for="timestamp">Range : </label>
                        <input type="datetime-local" id="timestamp" name="timestamp" className='form-control col' value={timestamp} onChange={(e) => setTimestamp(e.target.value)} required />
                        <input type="datetime-local" id="timestamp" name="timestamp" className='form-control col' value={endTimestamp} onChange={(e) => setEndTimestamp(e.target.value)} required />
                        <input type="submit" name='FetchResult' value="Fetch Result" className='btn btn-primary form-control mx-2 rounded my-auto col' style={{ maxWidth: "200px", maxHeight: "40px" }} />
                    </div>
                </form>
                <div className='container container-fluid p-5 bg bg-white'>
                    <LineChart
                        width={600}
                        height={300}
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        className='mx-auto'
                    >
                        <XAxis dataKey="timestamp"

                        />
                        <YAxis
                            label={{
                                value: `Result`,
                                style: { textAnchor: 'middle' },
                                angle: -90,
                                position: 'left',
                                offset: 0,
                            }}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        {
                            (id) &&
                            id.map((cell, index) => (
                                <Line type="monotone" dataKey={cell} stroke={strokeColor[index]} />
                            ))
                        }
                    </LineChart>
                </div>
                <div>
                    <h6 className='h6 text-center' style={{ color: "skyblue", marginTop: "25px" }}>Result from Cuboid Summary</h6>
                    <Table data={data} />
                </div>
                <div className='container my-5'>
                    <h6 className='h6 text-center' style={{ color: "skyblue" }}>Logs from Output Buffer</h6>
                    <Table data={logs.filter((item, index) => (index === 0) || ((item[logs[0].length - 1] >= processedTimestamp) && (item[logs[0].length - 1] <= processedEndTimestamp)))} />
                </div>
            </div>

        </div>
    )
}

export default DimensionalAnalytics