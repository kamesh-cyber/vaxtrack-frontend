import React from 'react';
import "./Vaccines.css";
import { vaccinesData } from '../utils/dummyDatas';
import {IconButton, Grid, Paper, Typography, Button} from '@mui/material';
import {EditDocument as EditIcon, AddBox as AddIcon, DriveFolderUpload as UploadIcon} from '@mui/icons-material';
import TableComp from '../components/TableComp';
import { _get } from '../api/client';
import { formatDate } from '../utils/common';

const Vaccines = ({}) => {
    const [vaccines, setVaccines] = React.useState([]);

    React.useEffect(() => {
        if (vaccines && vaccines.length > 0) {
            return;
        }
        // Fetch data from API
        _get("/vaccinations", {})
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to fetch data");
                }
                const resp = res.data;
                if (resp.success === true && resp.data) {
                    setVaccines(resp.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography sx={{ fontWeight: "bold" }}>
                Vaccination Drive List
            </Typography>
            <Grid container direction="row" spacing={1} sx={{ marginBottom: 2, alignItems: "baseline" }}>
                <Typography sx={{ fontWeight: "bold", color: "gray" }}>
                    Total Vaccination Drives: {vaccines.length}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<UploadIcon />}
                    sx={{ marginLeft: "auto" }}
                >Bulk Upload</Button>
                <Button 
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<AddIcon />}
                >Add Vaccination Drive</Button>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <TableComp
                    title="Vaccination Drives"
                    columns={[
                        { id: "_id", label: "ID", align: "center" },
                        { id: "name", label: "Name", align: "center" },
                        { id: "active", label: "Active", align: "center", format: (value) => value ? "Yes" : "No" },
                        { id: "classes", label: "Classes", align: "center", format: (value) => value.join(", ") },
                        { id: "scheduled_date", type: "date", label: "Scheduled Date", align: "center", format: (value) => formatDate(value) },
                        { id: "available_doses", label: "Available Doses", align: "center" },
                        { id: "action", label: "Action", align: "center" }]}
                    rows={vaccines}
                    actions={[
                        {
                            name: "Edit",
                            color: "rgb(40, 40, 206)",
                            icon: <EditIcon fontSize="small"/>,
                            onClick: (row) => {
                                console.log("Edit", row);
                            },
                        }
                    ]}
                />
            </Grid>
        </Paper>
    );
}
export default Vaccines;