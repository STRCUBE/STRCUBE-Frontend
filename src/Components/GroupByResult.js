import React from "react";

function GroupByResult({ data }) {
    return (
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
    );
}

export default GroupByResult;
