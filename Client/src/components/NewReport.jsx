import { useEffect, useState } from "react";
import axios from "axios";

function NewReport() {
  const [users, setUsers] = useState([]);
  // const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // To store the status of the upload
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
      const data = JSON.parse(text);
      try {
        await axios.post('http://localhost:8000/api/v1/upload-json', { data });
        setUploadStatus('success'); // Set the status to success on successful upload
        setUpdateContents(true); // Set this to trigger the update process
      } catch (error) {
        setUploadStatus('error');

      }
    };
    reader.readAsText(file);
  };
  const updateContents = async () => {
    try {
      await axios.get('http://localhost:8000/api/v1/update-all-contents');
      alert('Contents updated successfully');
    } catch (error) {
      console.error('Error updating contents:', error);
      alert('Failed to update contents');
    }
  };
  useEffect(() => {
    if (updateAllContents) {
      updateContents();
      setUpdateContents(false); // Reset the flag after updating
    }
  }, [updateAllContents]);

  const handleFetchDataClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/get-all-data');
      setUsers(response.data); // Assuming the data is the direct response
      // setTotalUsers(response.data.length); // Uncomment if you want to use totalUsers
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
        <input type="file" onChange={handleFileChange} />
        <br />
        <button type="submit">Upload JSON</button>
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
