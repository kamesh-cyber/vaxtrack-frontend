import React, { useEffect } from 'react';
import {Alert, Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close,CheckCircle } from '@mui/icons-material';
import './Modal.css';
import { _get, _patch } from '../api/client';
import dayjs from 'dayjs';


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
    const [vaccinations, setVaccinations] = React.useState([])
    const [updateReq, setUpdateReq] = React.useState({vaccination: ""});
    const [updatedStudent, setUpdatedStudent] = React.useState(null);
    const [apiError, setApiError] = React.useState(null);
    const [fieldErrors, setFieldErrors] = React.useState({
        vaccination: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    useEffect(() => {
        if (updateData) {
            getModalDatas(updateData);
        }
    }, [updateData])
    const getModalDatas = async (data) => {
        await getVaccinesByClass(data.class);
        await getStudentData(data.studentId);
        setShowModal(true);
    }
    const getVaccinesByClass = async (classId) => {
        await _get(`/vaccinations?class=${classId}`, {})
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp.success === true && resp.data) {
                setVaccinations(resp.data);
            }
        })
        .catch((err) => {
            console.log(err);
            setApiError("Failed to load available vaccinations. Please try again.");
        })
        .finally(() => {
            setIsSubmitting(false);
        }
        );
    }
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
                    vaccinations: resp.data?.vaccinations || [],
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const handleChange = (key, value) => {
        setFieldErrors({
            ...fieldErrors,
            [key]: ''
        });
        setApiError(null);
        setUpdateReq({
            [key]: value,
        });
    }
    const validateForm = () => {
        const errors = {
            vaccination: !updateReq.vaccination ? 'Please select a vaccination' : '',
        };
        
        setFieldErrors(errors);
        
        return Object.values(errors).every(error => error === '');
    }
    const handleSubmit = () => {
        if (!validateForm()) return;
        updateStudent();
    }
    const updateStudent = async () => {
        if (!updateReq.vaccination) {
            setFieldErrors({
                vaccination: 'Please select a vaccination'
            });
            return;
        }
        
        setIsSubmitting(true);
        setApiError(null);
        const data = JSON.parse(updateReq.vaccination);
        await _patch(`/students/${updateData.studentId}/vaccinate`, {
            "vaccineName": data.name,
            "vaccinatedOn": dayjs(data.scheduled_date).format('DD-MM-YYYY'),
          }, {})
        .then((res) => {
            console.log(res);
            if (res.status !== 200) {
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
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                setUpdateReq({ vaccination: "" });
                if (errorData.error && errorData.error.includes("Duplicate vaccination")) {
                    setFieldErrors({
                        vaccination: 'This vaccination has already been recorded for this student'
                    });
                    setApiError("Duplicate vaccination: This student has already received this vaccination.");
                }
                else if (errorData.error && errorData.error.includes("No Student with id")) {
                    setApiError("Student not found. Please refresh and try again.");
                }
                else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    const formattedErrors = errorData.errors.join('\n');
                    setApiError(formattedErrors);
                }
                else {
                    setApiError(errorData.error || "Failed to update vaccination status. Please try again.");
                }
            } else {
                setApiError("An error occurred while updating vaccination status. Please try again.");
            }
        });
    }
    return (
        <Modal
            open={showModal}
            onClose={() => {
                if (!isSubmitting) {
                    setShowModal(false);
                    handleClose();
                }
            }}
            className='update-student-modal'
        >
            <Paper className='update-student-modal-box' sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Update Student Vaccination Details
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        if (!isSubmitting) {
                                handleClose();
                                setShowModal(false);
                            }
                    }}  style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <form style={{ padding: 20 }}>
                {apiError && (
                        <Alert
                            severity="error" 
                            sx={{ mb: 2, whiteSpace: 'pre-line' }}
                            onClose={() => setApiError(null)}
                        >
                            {apiError}
                        </Alert>
                    )}
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
                                <TextField label="Date of Birth" fullWidth size='small'
                                    disabled
                                    value={studentData.dob}
                                    onChange={(e) => handleChange("dob", e.target.value)}/>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction={"column"}>
                            <Grid container spacing={0.25} direction={"column"}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    Vaccinations Taken
                                </Typography>
                                <Grid>
                                    {studentData.vaccinations.length ? 
                                    studentData.vaccinations.map((vaccine) => (<Typography variant="body1" sx={{ textAlign: 'center' }} fullWidth>{vaccine.vaccineName} on {vaccine.vaccinatedOn}</Typography>))
                                    :<Typography variant="body1" sx={{ textAlign: 'center' }} fullWidth>No Vaccination Taken</Typography>}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} size={12}>
                                <Grid size={12}>
                                    <TextField fullWidth
                                        select
                                        size="small"
                                        slotProps={{
                                            select: {
                                                native: true,
                                            },
                                        }}
                                        required
                                            error={!!fieldErrors.vaccination}
                                            helperText={fieldErrors.vaccination}
                                            disabled={isSubmitting}
                                        value={updateReq.vaccination}
                                        onChange={(e) => handleChange("vaccination", e.target.value)}
                                    >
                                        <option value="" disabled>--Select Vaccination--</option>
                                        { vaccinations.filter(vaccine => vaccine.active).map((vaccine) => (<option value={JSON.stringify(vaccine)}>{vaccine.name}</option>)) }
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} direction={"column"}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold',textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center',gap: 1}}>
                            <CheckCircle sx={{ color: 'success.main' }} />
                                Student Vaccine Details Updated Successfully
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
                    {!updatedStudent && <Grid item xs={6}>
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Update</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    );
}
export default UpdateStudentModal;