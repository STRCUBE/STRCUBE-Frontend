import React, { useEffect, useState } from 'react'
import './Stylesheets/Analytics.css'
import windowAggregateService from '../Services/windowAggregateService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { random } from 'lodash';
function Table({ data }) {
    return (
        <div className='container container-fluid container-sm bg bg-light' style={{ width: "48rem" }}>
            <table class="table table-hover">
                {data.map((row, rowIndex) => (
                    (rowIndex === 0) ?
                        <thead>
                            <tr>
                                {row.map((cell, cellIndex) => (
                                    <th key={`${rowIndex}-${cellIndex}`}>{cell}</th>
                                ))}
                            </tr>
                        </thead>

                        :
                        <tbody>
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                                ))}
                            </tr>
                        </tbody>
                ))}
            </table>

        </div>
    );
}
const Analytics = () => {
    const [queryId, setQueryId] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [endTimestamp, setEndTimestamp] = useState('');
    const [processedTimestamp, setProcessedTimestamp] = useState('');
    const [processedEndTimestamp, setProcessedEndTimestamp] = useState('');
    const [data, setData] = useState([]);
    const [logs, setLogs] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [id, setId] = useState([]);
    const [strokeColor, setStrokeColor] = useState([]);
    const [aggQuery, setAggQuery] = useState(false);
    // const strokeColour = `#${random(0xffffff).toString(16)}`;
    const fetchGetData = async (reqParams) => {
        try {
            const response = await windowAggregateService.getData(reqParams)
            if (response) {
                setData(response);
            }
            // console.log(response);
        }
        catch (exception) {
            alert("Failed to Load Data");
        }
    }
    const fetchGetLogs = async (reqParams) => {
        try {
            const response = await windowAggregateService.getLogs(reqParams)
            if (response) {
                setLogs(response);
            }
            // console.log(response);
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
        if (aggQuery) {
            setChartData(transformedLogs
                .filter((item) => { return (item.timestamp >= processedTimestamp) && (item.timestamp <= processedEndTimestamp) }));
        }
        else {
            setChartData(groupByTimestamp(transformedLogs)
                .filter((item) => { return (item.timestamp >= processedTimestamp) && (item.timestamp <= processedEndTimestamp) }));
        }

        //console.log("Chart Data: ", chartData);
        setId(data.map(row => row[0]).slice(1));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (queryId.startsWith('a')) {
            setAggQuery(true);
            // console.log("TRUE");
        }
        else {
            setAggQuery(false);
            // console.log("FALSE");
        }
        const reqParams = {
            queryId: queryId
        }
        fetchGetLogs(reqParams);
        fetchGetData(reqParams);

        // console.log(queryId + " : " + timestamp + " : " + endTimestamp);
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
                        id.map((cell, index) => (
                            <p style={{ color: strokeColor[index] }}>{`${cell} : ${payload[index].value}`}</p>
                        ))
                    }
                </div>
            );
        }

        return null;
    };
    const CustomTooltip2 = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip border p-5">
                    <p className="label">{`Timestamp: ${label}`}</p>
                    <p style={{ color: "#8884d8" }}>{`sum : ${payload[0].value}`}</p>
                    <p style={{ color: "#82ca9d" }}>{`avg : ${payload[1].value}`}</p>
                    <p style={{ color: "#FFD700" }}>{`count : ${payload[2].value}`}</p>
                    <p style={{ color: "#76c2ef" }}>{`min : ${payload[3].value}`}</p>
                    <p style={{ color: "#FF6347" }}>{`max : ${payload[4].value}`}</p>

                </div>
            );
        }

        return null;
    };
    return (
        <div className='AnalyticsPage'>
            <div className='container container-sm bg-white shadow-sm p-5'>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <input type='text' placeholder='Query Id...' className='form-control' value={queryId} onChange={(e) => setQueryId(e.target.value)} required />
                        <label class="control-label mx-3 mt-2" for="timestamp">Range : </label>
                        <input type="datetime-local" id="timestamp" name="timestamp" className='form-control' value={timestamp} onChange={(e) => setTimestamp(e.target.value)} required />
                        <input type="datetime-local" id="timestamp" name="timestamp" className='form-control' value={endTimestamp} onChange={(e) => setEndTimestamp(e.target.value)} required />
                        <input type="submit" name='Submit' className='btn btn-primary form-control mx-2' />
                    </div>
                </form>
                <div className='container container-fluid p-5 bg bg-white m-5'>
                    {
                        (aggQuery) ?
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
                                <Tooltip content={<CustomTooltip2 />} />
                                <Legend />
                                <Line type="monotone" dataKey="sum" stroke="#8884d8" />
                                <Line type="monotone" dataKey="avg" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="count" stroke="#FFD700" />
                                <Line type="monotone" dataKey="min" stroke="#76c2ef" />
                                <Line type="monotone" dataKey="max" stroke="#FF6347" />
                            </LineChart>
                            :
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
                                    id.map((cell, index) => (
                                        <Line type="monotone" dataKey={cell} stroke={strokeColor[index]} />
                                    ))
                                }
                            </LineChart>
                    }
                    <div>
                        <h6 className='h6 text-center' style={{ color: "skyblue" }}>Result from Summary</h6>
                        <Table data={data} />
                    </div>
                    <div className='container my-5'>
                        <h6 className='h6 text-center' style={{ color: "skyblue" }}>Logs from Output Buffer</h6>
                        <Table data={logs.filter((item, index) => (index === 0) || ((item[logs[0].length - 1] >= processedTimestamp) && (item[logs[0].length - 1] <= processedEndTimestamp)))} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics