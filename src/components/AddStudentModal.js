import React, { useEffect } from 'react';
import {Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close } from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './Modal.css';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const AddStudentModal = ({ open, handleClose, handleAddStudent }) => {
    const [showModal, setShowModal] = React.useState(open);
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
                        Add Student
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        setShowModal(false);
                        handleClose();
                    }} style={{ cursor: 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <form style={{ padding: 20 }}>
                    <Grid container spacing={2} direction={"column"}>
                        <TextField label="Name" fullWidth size='small' />
                        <Grid container spacing={2}>
                            <Grid size="grow">
                                <TextField fullWidth label="Class" size='small' />
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
                                    value={""}
                                    onChange={() => {}}
                                >
                                    <option value="" disabled>--Select Gender--</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid>
                                <TextField label="Age" fullWidth size='small' />
                            </Grid>
                            <Grid>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Date of Birth" slotProps={{ textField: { size: 'small' } }}/>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid size={6}>
                        <Button variant='outlined' color='warning' fullWidth
                            onClick={() => {
                                setShowModal(false);
                                handleClose();
                            }}
                        >Cancel</Button>
                    </Grid>
                    <Grid size={6}>
                        <Button variant='contained' color='success' fullWidth>Submit</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
}
export default AddStudentModal;