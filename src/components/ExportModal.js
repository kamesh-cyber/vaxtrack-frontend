import { Close } from "@mui/icons-material";
import { Box, Button, Grid, Modal, Paper, Typography } from "@mui/material";
import React from "react";
import { generateReport } from "../utils/generateReport";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const ExportModal = ({open, data, handleClose}) => {
    const [showModal, setShowModal] = React.useState(open);

    const onCSVExport = () => {
        // Implement CSV export logic here
        console.log("Exporting as CSV");
        generateReport(data, "csv");
        // setShowModal(false);
        // handleClose();
    }

    return (<Modal
        open={showModal}
        onClose={() => {
            setShowModal(false);
            handleClose();
        }}
        className='export-modal'
    >
        <Paper className='export-modal-box' sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                    Export Vaccination Data
                </Typography>
                <Typography variant="body2" onClick={() => {
                    setShowModal(false);
                    handleClose();
                }} style={{ cursor: 'pointer' }}>
                    <Close />
                </Typography>

            </Box>
            <Box sx={{ padding: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Select the format to export
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant='contained' color='success' fullWidth onClick={() => {
                            onCSVExport();
                        }}>CSV</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' color='success' fullWidth onClick={() => {
                            setShowModal(false);
                            handleClose();
                        }}>Excel</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' color='success' fullWidth onClick={() => {
                            setShowModal(false);
                            handleClose();
                        }}>PDF</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    </Modal>)
}

export default ExportModal;