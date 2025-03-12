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

const Home = ({ refresh }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (refresh) {
            axios.get("http://localhost:5000/data")
                .then(response => {
                    const filteredData = response.data.map(({ _id, __v, ...rest }) => rest);
                    setData(filteredData);
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [refresh]);

    console.log("hello");
    console.log(data);
    
    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Project Section */}
            <div>
                <h2 style={{ marginBottom: "10px" }}>Project</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                    {data.filter(item => item["Project Short Text"]).map((item, index) => (
                        <button key={index} style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            background: "#007bff",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            textAlign: "center",
                            cursor: "pointer"
                        }}>
                            {item["Project Short Text"]}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Customer Section */}
            <div>
                <h2 style={{ marginBottom: "10px" }}>Customer</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                    {data.filter(item => item["Customer Short Text"]).map((item, index) => (
                        <button key={index} style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            background: "#6c757d",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            textAlign: "center",
                            cursor: "pointer"
                        }}>
                            {item["Customer Short Text"]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;