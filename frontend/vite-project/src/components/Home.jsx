import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (refresh) {
      axios
        .get("http://localhost:5000/data")
        .then((response) => {
          const filteredData = response.data.map(
            ({ _id, __v, ...rest }) => rest
          );
          setData(filteredData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [refresh]);

  const uniqueProjects = [
    ...new Set(data.map((item) => item["Project_Short_Text"]).filter(Boolean)),
  ];
  const uniqueCustomers = [
    ...new Set(data.map((item) => item["Customer_Short_Text"]).filter(Boolean)),
  ];

  const handleProjectClick = (project) => {
    setSelectedCustomers([]);
    setSelectedProjects((prevProjects) =>
      prevProjects.includes(project)
        ? prevProjects.filter((p) => p !== project)
        : [...prevProjects, project]
    );
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomers((prevCustomers) =>
      prevCustomers.includes(customer)
        ? prevCustomers.filter((c) => c !== customer)
        : [...prevCustomers, customer]
    );
  };

  useEffect(() => {
    let newFilteredData = data;

    if (selectedProjects.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        selectedProjects.includes(item["Project_Short_Text"])
      );
    }

    if (selectedCustomers.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        selectedCustomers.includes(item["Customer_Short_Text"])
      );
    }
    setFilteredData(newFilteredData);
  }, [selectedProjects, selectedCustomers, data]);

  const groupedData = {};

  filteredData.forEach((item) => {
    const projectName = item["Project_Short_Text"] || "Unnamed Project";
    const customerName = item["Customer_Short_Text"] || "N/A";
    const materialType =
      item["Material_Price_Type"] || item["Material_Type"] || "Misc";
    const itemPrice = parseFloat(item["Ordered_Value"]?.$numberDecimal || 0);

    if (!groupedData[projectName]) {
      groupedData[projectName] = {};
    }

    if (!groupedData[projectName][customerName]) {
      groupedData[projectName][customerName] = {
        "Material Price Type": 0,
        Spares: 0,
        System: 0,
        Services: 0,
        Misc: 0,
        Grand_Total: 0,
      };
    }

    const lowerType = materialType.toLowerCase();

    if (lowerType === "spares") {
      groupedData[projectName][customerName]["Spares"] += itemPrice;
    } else if (lowerType === "system") {
      groupedData[projectName][customerName]["System"] += itemPrice;
    } else if (lowerType === "services") {
      groupedData[projectName][customerName]["Services"] += itemPrice;
    } else {
      groupedData[projectName][customerName]["Misc"] += itemPrice;
    }

    groupedData[projectName][customerName]["Grand_Total"] += itemPrice;
  });

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div>
        <h2 style={{ marginBottom: "10px" }}>Projects</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "10px",
          }}
        >
          {uniqueProjects.map((project, index) => (
            <button
              key={index}
              onClick={() => handleProjectClick(project)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: selectedProjects.includes(project)
                  ? "#0056b3"
                  : "#007bff",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {project}
            </button>
          ))}
        </div>
      </div>

      {selectedProjects.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Customers</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
            }}
          >
            {uniqueCustomers.map((customer, index) => (
              <button
                key={index}
                onClick={() => handleCustomerClick(customer)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: selectedCustomers.includes(customer)
                    ? "#0056b3"
                    : "#007bff",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {customer}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProjects.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Filtered Data</h2>
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              background: "#1E1E1E",
              color: "#fff",
            }}
          >
            <thead>
              <tr style={{ background: "#333" }}>
                <th>Project</th>
                <th>Customer</th>
                <th>Spares</th>
                <th>System</th>
                <th>Services</th>
                <th>Misc</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).map((project, projectIndex) => {
                const customers = Object.keys(groupedData[project]);
                return customers.map((customer, customerIndex) => (
                  <tr key={`${projectIndex}-${customerIndex}`}>
                    {customerIndex === 0 && (
                      <td
                        rowSpan={customers.length}
                        style={{
                          fontWeight: "bold",
                          background: "#444",
                          color: "#fff",
                          padding: "10px",
                          border: "1px solid #fff",
                        }}
                      >
                        {project}
                      </td>
                    )}
                    <td>{customer}</td>
                    <td>
                      {groupedData[project][customer]["Spares"].toFixed(2)}
                    </td>
                    <td>
                      {groupedData[project][customer]["System"].toFixed(2)}
                    </td>
                    <td>
                      {groupedData[project][customer]["Services"].toFixed(2)}
                    </td>
                    <td>{groupedData[project][customer]["Misc"].toFixed(2)}</td>
                    <td>
                      {groupedData[project][customer]["Grand_Total"].toFixed(2)}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
