import React from "react";
import "./Students.css";
import TableComp from "../components/TableComp";
// import {studentsData} from "../utils/dummyDatas";
import {EditDocument as EditIcon, AddBox as AddIcon, DriveFolderUpload as UploadIcon} from '@mui/icons-material';
import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import AddStudentModal from "../components/AddStudentModal";
import UploadStudentModal from "../components/UploadStudentModal";
import { _get } from "../api/client";
import UpdateStudentModal from "../components/UpdateStudentModal";

const Students = ({}) => {
    const [students, setStudents] = React.useState([]);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState({show: false, studentId: null, class: 0});

    const getStudents = async () => {
        await _get("/students", {})
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
    React.useEffect(() => {
        getStudents();
    }, []);

    return (
        <>
        <Paper sx={{ padding: 2 }}>
            <Typography className="page-title" sx={{ fontWeight: "bold" }}>
                Students List
            </Typography>
            <Grid container direction="row" spacing={1} sx={{ marginBottom: 2, alignItems: "baseline" }}>
                <Typography className="student-count" sx={{ fontWeight: "bold", color: "gray" }}>
                    Total Students: {students.length}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<UploadIcon />}
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                        setShowUploadModal(true);
                    }}
                >Bulk Upload</Button>
                <Button 
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >Add Student</Button>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {students.length && <TableComp
                    title="Students"
                    columns={[
                        { id: "_id", label: "ID", align: "center" },
                        { id: "name", label: "Name", align: "center" },
                        { id: "age", label: "Age", align: "center" },
                        { id: "class", label: "Class", align: "center" },
                        { id: "gender", label: "Gender", align: "center" },
                        { id: "dateOfBirth", label: "Date of Birth", align: "center" },
                        { id: "action", label: "Action", align: "center" }]}
                    rows={students}
                    actions={[
                        {
                            name: "Edit",
                            color: "rgb(40, 40, 206)",
                            icon: <EditIcon fontSize="small"/>,
                            onClick: (row) => {
                                console.log("Edit", row);
                                setUpdateModal({show: true, studentId: row._id, class: row.class});
                            },
                        }
                    ]}
                />}
            </Grid>
        </Paper>

        {showAddModal && <AddStudentModal
            open={showAddModal}
            handleClose={() => {
                setShowAddModal(false);
            }}
            refreshStudents={getStudents}
        />}
        {updateModal.show && <UpdateStudentModal
            updateData={updateModal}
            handleClose={() => {
                setUpdateModal({show: false, studentId: null, class: 0});
            }}
            refreshStudents={getStudents}
        />}
        {showUploadModal && <UploadStudentModal
            open={showUploadModal}
            handleClose={() => {
                setShowUploadModal(false);
            }}
            refreshStudents={getStudents}
        />}
        </>     
    )
}
export default Students;