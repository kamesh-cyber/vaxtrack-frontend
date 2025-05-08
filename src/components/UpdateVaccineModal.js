import React, { useEffect } from 'react';
import {Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close,CheckCircle } from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './Modal.css';
import dayjs from 'dayjs';
import { _patch } from '../api/client';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const UpdateVaccineModal = ({ updateData, handleClose, refreshVaccines }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [vaccineData, setVaccineData] = React.useState({
        name: "",
        scheduled_date: null,
        available_doses: 0,
        classes: [],
    });
    const [newVaccine, setNewVaccine] = React.useState(null);
    useEffect(() => {
        const data = updateData.vaccine;
        setVaccineData({
            name: data?.name || "",
            scheduled_date: data?.scheduled_date ? dayjs(data.scheduled_date) : null,
            available_doses: data?.available_doses || 0,
            classes: data?.classes || [],
        });
        setShowModal(true);
    }, [updateData]);
    const handleChange = (key, value) => {
        setVaccineData({
            ...vaccineData,
            [key]: value,
        });
    }
    const handleSubmit = () => {
        console.log("handleSubmit", vaccineData);
        updateVaccine();
    }
    const updateVaccine = async () => {
        console.log("updateVaccine", vaccineData);
        await _patch(`/vaccinations/${updateData.vaccine._id}`, {
            "scheduled_date": vaccineData?.scheduled_date ? dayjs(vaccineData.scheduled_date).format() : "",
            "available_doses": vaccineData?.available_doses || 0,
        }, {})
        .then((res) => {
            console.log(res);
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp.success === true && resp.data) {
                setNewVaccine(resp.data);
                refreshVaccines();
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
            className='update-vaccine-modal'
        >
            <Paper className='update-vaccine-modal-box' sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Update Vaccination Drive
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        handleClose();
                        setShowModal(false);
                    }} style={{ cursor: 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <form style={{ padding: 20 }}>
                    {!newVaccine ? <Grid container spacing={2} direction={"column"}>
                        <TextField label="Name" fullWidth size='small' 
                            disabled
                            value={vaccineData.name} 
                            onChange={(e) => handleChange("name", e.target.value)}/>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                {/* <TextField
                                    disabled
                                    select
                                    size="small"
                                    slotProps={{
                                        select: {
                                            multiple: true,
                                            renderValue: (selected) => {
                                                return selected.join(", ");
                                            },
                                            native: true,
                                        },
                                    }}
                                    value={vaccineData.classes}
                                    onChange={(e) => handleChange("classes", e.target.value)}
                                >
                                    <option value="" disabled>--Select Classes--</option>
                                    { classes.map((classItem) => (<option value={classItem}>{classItem}</option>)) }
                                </TextField> */}
                                <TextField label="Classes" fullWidth size='small'
                                    disabled
                                    value={vaccineData.classes.join(", ")}    
                                />                                
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid>
                                <TextField label="Available Doses" fullWidth size='small' type='number'
                                    value={vaccineData.available_doses}
                                    onChange={(e) => handleChange("available_doses", e.target.value)}/>
                            </Grid>
                            <Grid>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Scheduled Date" slotProps={{ textField: { size: 'small' } }}
                                        format='DD-MM-YYYY'
                                        onChange={(newValue) => {
                                            handleChange("scheduled_date", newValue);
                                        }}
                                        value={vaccineData.scheduled_date}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} direction={"column"}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold',textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center',gap: 1}}>
                            <CheckCircle sx={{ color: 'success.main' }} />
                                Vaccination Drive updated Successfully
                            </Typography>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Student ID: {newVaccine?.studentId}
                            </Typography>
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Data: {JSON.stringify(newVaccine)}
                            </Typography>
                        </Grid> */}
                    </Grid>
                    }
                </form>
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid size={newVaccine ? 12 : 6}>
                        <Button variant='outlined' color='warning' fullWidth
                            onClick={() => {
                                handleClose();
                                setShowModal(false);
                            }}
                        >{newVaccine ? 'Close' : 'Cancel'}</Button>
                    </Grid>
                    {!newVaccine && <Grid size={6}>
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Update</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    );
}
export default UpdateVaccineModal;