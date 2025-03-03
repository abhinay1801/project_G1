import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";

const App = () => {
    const [refresh, setRefresh] = useState(false);

    return (
        <div>
            <FileUpload onUploadSuccess={() => setRefresh(true)} />
            <DataTable refresh={refresh} />
        </div>
    );
};

export default App;
