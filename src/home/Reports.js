import React from "react";
import "./Reports.css";
import { Button, Grid, Paper, Typography } from "@mui/material";
import TableComp from "../components/TableComp";
import { ImportExportOutlined as ExportIcon } from "@mui/icons-material";
import { _get } from "../api/client";
import ReportsFilter from "../components/ReportsFilter";
import ExportModal from "../components/ExportModal";

const Reports = () => {
    const [students, setStudents] = React.useState([]);
    const [showExpModal, setShowExpModal] = React.useState(false);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState({show: false, studentId: null, class: 0});
    
    const getFilteredData = async (filters) => {
        console.log(filters);
        const filtersObject = filters.reduce((acc, filter) => {
            acc[filter.filterType] = filter.filterValue;
            return acc;
        }, {});
        await _get("/students/reports", {params: filtersObject})
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to fetch data");
                }
                const resp = res.data;
                if (resp.success === true && resp.data) {
                    setStudents(resp.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const onClickExport = () => {
        // Implement export functionality here
        console.log("Export clicked");
        setShowExpModal(true);
    }
    const handleExpClose = () => {
        setShowExpModal(false);
    }
    return (
        <>
        <Paper sx={{ padding: 2 }}>
            <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>Reports</Typography>
            <ReportsFilter getFilteredData={getFilteredData}/>
            {students.length > 0 && <>
            <Grid container direction="row" spacing={1} sx={{ margin: 2, alignItems: "baseline" }}>
                <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<ExportIcon />}
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                        onClickExport();
                    }}
                >Export</Button>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {students.length && <TableComp
                    title="Students"
                    columns={[
                        { id: "_id", label: "ID", align: "center" },
                        { id: "name", label: "Name", align: "center" },
                        { id: "class", label: "Class", align: "center" },
                        { id: "gender", label: "Gender", align: "center" },
                        { id: "vaccinations", label: "Vaccinations", align: "center", default: "Not Vaccinated", format: (value) => {
                            return value.map((vaccine) => {
                                return (
                                    <div key={vaccine.vaccineName}>
                                        {vaccine.vaccineName} - {vaccine.vaccinatedOn}
                                    </div>
                                );
                            });
                        }}]}
                    rows={students}
                />}
            </Grid>
            </>}
        </Paper>
        {showExpModal && <ExportModal open={showExpModal} data={students} handleClose={handleExpClose}/>}
        </>
    );
}
export default Reports;