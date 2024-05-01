import { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_DATA, UPDATE_ALL_CONTENTS, UPLOAD_CSV } from "../utils/endpoints";
import Papa from "papaparse";

function NewReport() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [updateAllContents, setUpdateContents] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      Papa.parse(text, {
        complete: async (results) => {
          const data = results.data; // Parse CSV data into an array of objects
          try {
            await axios.post(UPLOAD_CSV, { data });
            setUploadStatus('success');
            setUpdateContents(true);
          } catch (error) {
            setUploadStatus('error');
          }
        },
        header: true // Set to true if the first row of your CSV contains column headers
      });
    };
    reader.readAsText(file);
  };

  const updateContents = async () => {
    try {
      await axios.get(UPDATE_ALL_CONTENTS);
      alert('Contents updated successfully');
    } catch (error) {
      console.error('Error updating contents:', error);
      alert('Failed to update contents');
    }
  };

  useEffect(() => {
    if (updateAllContents) {
      updateContents();
      setUpdateContents(false);
    }
  }, [updateAllContents]);

  const handleFetchDataClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(GET_ALL_DATA);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJSON = () => {
    const jsonData = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".csv"/>
        <br />
        <button type="submit">Upload CSV</button>
        {uploadStatus === 'success' && <p>Upload successful!</p>}
        {uploadStatus === 'error' && <p>Error in upload. Please try again.</p>}
      </form>
      <button className="fetch-button" onClick={handleFetchDataClick}>
        Fetch Data
      </button>
      {isLoading && <p>Loading...</p>}
      {users.length > 0 ? (
        <>
          <button className="download-button" onClick={handleDownloadJSON}>
            Download JSON
          </button>
          <p>Download JSON Now</p>
        </>
      ) : (
        <p>Click the button to fetch data</p>
      )}
    </div>
  );
}

export default NewReport;
