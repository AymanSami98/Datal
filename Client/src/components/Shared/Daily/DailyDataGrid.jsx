import  { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { dailyColumns } from '../../../utils/columns';
import { GET_ALL_DAILY_DURATIONS } from '../../../utils/endpoints';

export default function DailyDataGrid() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_ALL_DAILY_DURATIONS);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching grid data: ", error);
            }
        };
        fetchData();
    }, []);

    const getRowId = (row) => `${row.date}-${row.createdAt}`;

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={data}
                columns={dailyColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                getRowId={getRowId}
            />
        </div>
    );
}
