// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Home = ({ refresh }) => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         if (refresh) {
//             axios.get("http://localhost:5000/data")
//                 .then(response => {
//                     const filteredData = response.data.map(({ _id, __v, ...rest }) => rest);
//                     setData(filteredData);
//                 })
//                 .catch(error => console.error("Error fetching data:", error));
//         }
//     }, [refresh]);

    
//     // Extract unique project and customer values
//     const uniqueProjects = [...new Set(data.map(item => item["Project_Short_Text"]).filter(Boolean))];
//     const uniqueCustomers = [...new Set(data.map(item => item["Customer_Short_Text"]).filter(Boolean))];

//     return (
//         <div style={{ padding: "20px", display: "flex", flexDirection: "row", gap: "20px" }}>
//             {/* Project Section */}
//             <div>
//                 <h2 style={{ marginBottom: "10px" }}>Project</h2>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//                     {uniqueProjects.map((project, index) => (
//                         <button key={index} style={{
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #ddd",
//                             background: "#007bff",
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             textAlign: "center",
//                             cursor: "pointer"
//                         }}>
//                             {project}
//                         </button>
//                     ))}
//                 </div>
//             </div>
            
//             {/* Customer Section */}
//             <div>
//                 <h2 style={{ marginBottom: "10px" }}>Customer</h2>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//                     {uniqueCustomers.map((customer, index) => (
//                         <button key={index} style={{
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #ddd",
//                             background: "#007bff",
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             textAlign: "center",
//                             cursor: "pointer"
//                         }}>
//                             {customer}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;











// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Home = ({ refresh }) => {
//     const [data, setData] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [selectedCustomers, setSelectedCustomers] = useState(null);
//     const [filteredData, setFilteredData] = useState([]);

//     useEffect(() => {
//         if (refresh) {
//             axios.get("http://localhost:5000/data")
//                 .then(response => {
//                     const filteredData = response.data.map(({ _id, __v, ...rest }) => rest);
//                     setData(filteredData);
//                 })
//                 .catch(error => console.error("Error fetching data:", error));
//         }
//     }, [refresh]);

//     // Extract unique project values
//     const uniqueProjects = [...new Set(data.map(item => item["Project_Short_Text"]).filter(Boolean))];
//     const uniqueCustomers = [...new Set(data.map(item => item["Customer_Short_Text"]).filter(Boolean))];

//     // Handle project selection and filter data
//     const handleProjectClick = (project) => {
//         setSelectedProject(project);
//         setFilteredData(data.filter(item => item["Project_Short_Text"] === project));
//     };
//     const handleCustomersClick = (project) => {
//         setSelectedCustomerst(project);
//         setFilteredData(data.filter(item => item["Customer_Short_Text"] === project));
//     };

//     return (
//         <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
//             {/* Project Section */}
//             <div>
//                 <h2 style={{ marginBottom: "10px" }}>Project</h2>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//                     {uniqueProjects.map((project, index) => (
//                         <button key={index} onClick={() => handleProjectClick(project)} style={{
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #ddd",
//                             background: selectedProject === project ? "#0056b3" : "#007bff",
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             textAlign: "center",
//                             cursor: "pointer"
//                         }}>
//                             {project}
//                         </button>
//                     ))}
//                 </div>
//             </div>

            
//             {/* customer Section */}
//             <div>
//                 <h2 style={{ marginBottom: "10px" }}>Customers</h2>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//                     {uniqueCustomers.map((customer, index) => (
//                         <button key={index} onClick={() => handleProjectClick(customer)} style={{
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #ddd",
//                             background: selectedCustomers === customer ? "#0056b3" : "#007bff",
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             textAlign: "center",
//                             cursor: "pointer"
//                         }}>
//                             {customer}
//                         </button>
//                     ))}
//                 </div>
//             </div>

            
        
            
//             {/* Data Table Section */}
//             {selectedProject && (
//                 <div>
//                     <h2 style={{ marginBottom: "10px" }}>{selectedProject} Details</h2>
//                     <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
//                         <thead>
//                             <tr>
//                                 <th>Customer</th>
//                                 <th>System</th>
//                                 <th>Spares</th>
//                                 <th>Service</th>
//                                 <th>ET Lab</th>
//                                 <th>FE Var</th>
//                                 <th>CD</th>
//                                 <th>Grand Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredData.map((row, index) => (
//                                 <tr key={index}>
//                                     <td>{row["Customer_Short_Text"] || "N/A"}</td>
//                                     <td>{row["System"] || 0}</td>
//                                     <td>{row["Spares"] || 0}</td>
//                                     <td>{row["Service"] || 0}</td>
//                                     <td>{row["ET_Lab"] || 0}</td>
//                                     <td>{row["FE_Var"] || 0}</td>
//                                     <td>{row["CD"] || 0}</td>
//                                     <td>{row["Grand_Total"] || 0}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Home;








































import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = ({ refresh }) => {
    const [data, setData] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

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

    // Extract unique project and customer values
    const uniqueProjects = [...new Set(data.map(item => item["Project_Short_Text"]).filter(Boolean))];
    const uniqueCustomers = [...new Set(data.map(item => item["Customer_Short_Text"]).filter(Boolean))];

    // Handle project selection
    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setSelectedCustomer(null); // Reset customer selection
        setFilteredData(data.filter(item => item["Project_Short_Text"] === project));
    };

    // Handle customer selection
    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        if (selectedProject) {
            setFilteredData(data.filter(item => item["Project_Short_Text"] === selectedProject && item["Customer_Short_Text"] === customer));
        } else {
            setFilteredData(data.filter(item => item["Customer_Short_Text"] === customer));
        }
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Project Section */}
            <div>
                <h2 style={{ marginBottom: "10px" }}>Project</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                    {uniqueProjects.map((project, index) => (
                        <button key={index} onClick={() => handleProjectClick(project)} style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            background: selectedProject === project ? "#0056b3" : "#007bff",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            textAlign: "center",
                            cursor: "pointer"
                        }}>
                            {project}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer Section */}
            {selectedProject && (
                <div>
                    <h2 style={{ marginBottom: "10px" }}>Customers</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                        {uniqueCustomers.map((customer, index) => (
                            <button key={index} onClick={() => handleCustomerClick(customer)} style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                background: selectedCustomer === customer ? "#0056b3" : "#007bff",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textAlign: "center",
                                cursor: "pointer"
                            }}>
                                {customer}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Table Section */}
            {selectedProject && (
                <div>
                    <h2 style={{ marginBottom: "10px" }}>{selectedProject} {selectedCustomer ? ` - ${selectedCustomer}` : "Details"}</h2>
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>System</th>
                                <th>Spares</th>
                                <th>Service</th>
                                <th>ET Lab</th>
                                <th>FE Var</th>
                                <th>CD</th>
                                <th>Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row["Customer_Short_Text"] || "N/A"}</td>
                                    <td>{row["System"] || 0}</td>
                                    <td>{row["Spares"] || 0}</td>
                                    <td>{row["Service"] || 0}</td>
                                    <td>{row["ET_Lab"] || 0}</td>
                                    <td>{row["FE_Var"] || 0}</td>
                                    <td>{row["CD"] || 0}</td>
                                    <td>{row["Grand_Total"] || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Home;
