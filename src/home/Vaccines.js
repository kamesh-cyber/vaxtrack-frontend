import React from 'react';
import "./Vaccines.css";
import {Grid, Paper, Typography, Button} from '@mui/material';
import {EditDocument as EditIcon, AddBox as AddIcon} from '@mui/icons-material';
import TableComp from '../components/TableComp';
import { _get } from '../api/client';
import { formatClass, formatDate } from '../utils/common';
import AddVaccineModal from '../components/AddVaccineModal';
import UpdateVaccineModal from '../components/UpdateVaccineModal';

const Vaccines = ({}) => {
    const [vaccines, setVaccines] = React.useState([]);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState({show: false, vaccine: null});

    const getVaccines = async () => {
        await _get("/vaccinations", {})
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
    }
    React.useEffect(() => {
        getVaccines();
    }, []);

    return (
        <>
        <Paper sx={{ padding: 2 }}>
            <Typography className="page-title" sx={{ fontWeight: "bold" }}>
                Vaccination Drive List
            </Typography>
            <Grid container direction="row" spacing={1} sx={{ marginBottom: 2, alignItems: "baseline" }}>
                <Typography className="vaccine-count"  sx={{ fontWeight: "bold", color: "gray" }}>
                    Total Drives: {vaccines.length}
                </Typography>
                {/* <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<UploadIcon />}
                    sx={{ marginLeft: "auto" }}
                >Bulk Upload</Button> */}
                <Button 
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<AddIcon />}
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >Add Vaccination Drive</Button>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <TableComp
                    title="Vaccination Drives"
                    columns={[
                        // { id: "_id", label: "ID", align: "center", format: (value) => value.slice(8) },
                        { id: "name", label: "Name", align: "center" },
                        { id: "active", label: "Active", align: "center", format: (value) => value ? "Yes" : "No" },
                        { id: "classes", label: "Classes", align: "center", format: (value) => formatClass(value) },
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
                                setUpdateModal({show: true, vaccine: row});
                            },
                        }
                    ]}
                />
            </Grid>
        </Paper>
        {showAddModal && <AddVaccineModal
            open={showAddModal}
            handleClose={() => {
                setShowAddModal(false);
            }}
            refreshVaccines={getVaccines}
        />}
        {updateModal.show && <UpdateVaccineModal
            updateData={updateModal}
            handleClose={() => {
                setUpdateModal({show: false, vaccine: null});
            }}
            refreshVaccines={getVaccines}
        />}
        </>
    );
}
export default Vaccines;