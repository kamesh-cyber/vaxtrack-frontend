import React, { useEffect } from 'react';
import {Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close } from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './Modal.css';
import dayjs from 'dayjs';
import { _post } from '../api/client';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};
const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AddVaccineModal = ({ open, handleClose, refreshVaccines }) => {
    const [showModal, setShowModal] = React.useState(open);
    const [vaccineData, setVaccineData] = React.useState({
        name: "",
        scheduled_date: null,
        available_doses: 0,
        classes: [],
    });
    const [newVaccine, setNewVaccine] = React.useState(null);
    const handleChange = (key, value) => {
        if (key === "classes") {
            let selectedClasses = []
            if (vaccineData.classes.includes(value))
                selectedClasses = vaccineData.classes.filter((classItem) => classItem !== value);
            else
                selectedClasses = [...vaccineData.classes, value];
            setVaccineData({
                ...vaccineData,
                [key]: selectedClasses,
            });
            return;
        }
        setVaccineData({
            ...vaccineData,
            [key]: value,
        });
    }
    const handleSubmit = () => {
        console.log("handleSubmit", vaccineData);
        createVaccine();
    }
    const createVaccine = async () => {
        console.log("createVaccine", vaccineData);
        await _post("/vaccinations", {
            "name": vaccineData?.name || "",
            "scheduled_date": vaccineData?.scheduled_date ? dayjs(vaccineData.scheduled_date).format() : "",
            "available_doses": vaccineData?.available_doses || 0,
            "classes": vaccineData?.classes || [],
        }, {})
        .then((res) => {
            console.log(res);
            if (res.status !== 201) {
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
            className='add-vaccine-modal'
        >
            <Paper className='add-vaccine-modal-box' sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Add Vaccine
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
                            value={vaccineData.name} 
                            onChange={(e) => handleChange("name", e.target.value)}/>
                        <Grid container spacing={2}>
                            <Grid>
                                <TextField
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
                                </TextField>
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
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Vaccination Created Successfully
                            </Typography>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Student ID: {newVaccine?.studentId}
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Data: {JSON.stringify(newVaccine)}
                            </Typography>
                        </Grid>
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
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Submit</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    );
}
export default AddVaccineModal;