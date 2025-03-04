// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const DataTable = ({ refresh }) => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         if (refresh) {
//             axios.get("http://localhost:5000/data")
//                 .then(response => setData(response.data))
//                 .catch(error => console.error("Error fetching data:", error));
//         }
//     }, [refresh]);

//     return (
//         <div>
//             {data.length > 0 && (
//                 <table border="1">
//                     <thead>
//                         <tr>
//                             {Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((row, index) => (
//                             <tr key={index}>
//                                 {Object.values(row).map((val, i) => (
//                                     <td key={i}>{typeof val === "object" ? JSON.stringify(val) : val}</td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default DataTable;








import React, { useEffect, useState } from "react";
import axios from "axios";

const DataTable = ({ refresh }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (refresh) {
            axios.get("http://localhost:5000/data")
                .then(response => {
                    // Filter out _id and __v from data
                    const filteredData = response.data.map(({ _id, __v, ...rest }) => rest);
                    setData(filteredData);
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [refresh]);

    return (
        <div>
            {data.length > 0 && (
                <table border="1">
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((val, i) => (
                                    <td key={i}>{typeof val === "object" ? JSON.stringify(val) : val}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DataTable;
