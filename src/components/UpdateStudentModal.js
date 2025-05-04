import React, { useEffect } from 'react';
import {Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close } from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './Modal.css';
import { _get, _patch } from '../api/client';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const UpdateStudentModal = ({ updateData, handleClose, refreshStudents }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [studentData, setStudentData] = React.useState({
        name: "",
        age: 0,
        class: 0,
        gender: "",
        dob: null,
        vaccinations: []
    });
    const [updatedStudent, setUpdatedStudent] = React.useState(null);
    useEffect(() => {
        if (updateData) {
            getStudentData(updateData.studentId);
        }
    }, [updateData])
    const getStudentData = async (id) => {
        await _get(`/students/${id}`, {})
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp.success === true && resp.data) {
                setStudentData({
                    name: resp.data.name,
                    age: resp.data.age,
                    class: resp.data.class,
                    gender: resp.data.gender,
                    dob: resp.data.dateOfBirth,
                    vaccinations: resp.data.vaccinations,
                });
                setShowModal(true);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const handleChange = (key, value) => {
        setStudentData({
            ...studentData,
            [key]: value,
        });
    }
    const handleSubmit = () => {
        console.log("handleSubmit", studentData);
        updateStudent();
    }
    const updateStudent = async () => {
        console.log("updateStudent", studentData);
        await _patch("/students/{id}/vaccinate", {
            "vaccines": studentData.vaccinations
          }, {})
        .then((res) => {
            console.log(res);
            if (res.status !== 201) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp.success === true && resp.data) {
                setUpdatedStudent(resp.data);
                refreshStudents();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    return (
        <Modal
            open={showModal}
            onClose={() => {
                setShowModal(false);
                handleClose();
            }}
            className='add-student-modal'
        >
            <Paper className='add-student-modal-box' sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Edit Student Vaccination
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        handleClose();
                        setShowModal(false);
                    }} style={{ cursor: 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <form style={{ padding: 20 }}>
                    {!updatedStudent ? <Grid container spacing={2} direction={"column"}>
                        <TextField label="Name" fullWidth size='small' 
                            disabled
                            value={studentData.name} 
                            onChange={(e) => handleChange("name", e.target.value)}/>
                        <Grid container spacing={2}>
                            <Grid size="grow">
                                <TextField fullWidth label="Class" size='small' type='number'
                                    disabled
                                    value={studentData.class} 
                                    onChange={(e) => handleChange("class", e.target.value)}/>
                            </Grid>
                            <Grid>
                                <TextField
                                    select
                                    size="small"
                                    slotProps={{
                                        select: {
                                            native: true,
                                        },
                                    }}
                                    value={studentData.gender}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                    disabled
                                >
                                    <option value="" disabled>--Select Gender--</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid>
                                <TextField label="Age" fullWidth size='small' type='number'
                                    disabled
                                    value={studentData.age}
                                    onChange={(e) => handleChange("age", e.target.value)}/>
                            </Grid>
                            <Grid>
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Date of Birth" slotProps={{ textField: { size: 'small' } }}
                                        format='DD-MM-YYYY'
                                        onChange={(newValue) => {
                                            handleChange("dob", newValue);
                                        }}
                                        value={studentData.dob}
                                    />
                                </LocalizationProvider> */}
                                <TextField label="Date of Birth" fullWidth size='small'
                                    disabled
                                    value={studentData.dob}
                                    onChange={(e) => handleChange("dob", e.target.value)}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} direction={"column"}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Student Vaccines Updated Successfully
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Vaccination: {updatedStudent?.vaccinations}
                            </Typography>
                        </Grid>
                    </Grid>
                    }
                </form>
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid size={updatedStudent ? 12 : 6}>
                        <Button variant='outlined' color='warning' fullWidth
                            onClick={() => {
                                handleClose();
                                setShowModal(false);
                            }}
                        >{updatedStudent ? 'Close' : 'Cancel'}</Button>
                    </Grid>
                    {!updatedStudent && <Grid size={6}>
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Submit</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    );
}
export default UpdateStudentModal;