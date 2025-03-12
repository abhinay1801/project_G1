import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import Home from "./components/Home";

const App = () => {
    const [refresh, setRefresh] = useState(false);

    return (
        <div>
            <FileUpload onUploadSuccess={() => setRefresh(true)} />
            <Home refresh={refresh} />
            {/* <Home/> */}
        </div>
    );
};

export default App;
