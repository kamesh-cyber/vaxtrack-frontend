import React from "react";
import {Box, Button, Grid, Modal,Paper, Typography} from "@mui/material"
import { Close } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import "./Modal.css"

//https://www.npmjs.com/package/react-dropzone

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const UploadStudentModal = ({ open, handleClose, refreshStudents }) => {
    const [showModal, setShowModal] = React.useState(open);
    const [uploadedFile, setUploadedFile] = React.useState(null);

    const handleUploadedExcel = (file) => {
        setUploadedFile({file: file[0], name: file[0].name, size: (file[0].size/1000)+'kb', numberOfRecords: getNumberOfRecords(file[0])});
    }
    const getNumberOfRecords = (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                // Assuming the first line is the header
                const numberOfRecords = lines.length - 1;
                resolve(numberOfRecords);
            };
            reader.readAsText(file);
        });
    }
    return (
        <Modal
            open={showModal}
            onClose={() => {
                setShowModal(false);
                handleClose();
            }}
        >
            <Paper sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Bulk Upload Students
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        setShowModal(false);
                        handleClose();
                    }} style={{ cursor: 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <Grid style={{ padding: 20 }}>
                    {!uploadedFile && <Dropzone onDrop={acceptedFiles => handleUploadedExcel(acceptedFiles)}
                        accept={{
                            'text/csv': ['.csv'],
                        }}
                        maxFiles="1"
                    >
                        {({getRootProps, getInputProps}) => (
                            <Grid container sx={{width: "40vw", height: "30vh", backgroundColor: "#f1f1f1", cursor: "pointer", border: "2px dashed #7a7a7a"}}>
                                <div {...getRootProps()} style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <input {...getInputProps()}/>
                                    <p>Drag 'n' drop a CSV file here, or click to select a file</p>
                                </div>
                            </Grid>
                        )}
                    </Dropzone>}
                    {uploadedFile && <Grid container sx={{width: "40vw", height: "30vh"}} spacing={2} alignItems="center" justifyContent="center">
                        <Grid container direction={"column"} spacing={2} alignItems="end" justifyContent="center">
                            <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73"}}>File Name:</Typography>
                            <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73"}}>File Size:</Typography>
                            <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73"}}>Number of Records:</Typography>
                        </Grid>
                        <Grid container direction={"column"} spacing={2} alignItems="start" justifyContent="center">
                            <Typography variant="subtitle" sx={{fontWeight: "bold", color: "#254a73"}}>{uploadedFile.name}</Typography>
                            <Typography variant="subtitle" sx={{fontWeight: "bold", color: "#254a73"}}>{uploadedFile.size}</Typography>
                            <Typography variant="subtitle" sx={{fontWeight: "bold", color: "#254a73"}}>{uploadedFile.numberOfRecords}</Typography>
                        </Grid>
                    </Grid>}
                </Grid>
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
                        <Button variant='contained' color='success' fullWidth>Upload</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    )
}

export default UploadStudentModal;