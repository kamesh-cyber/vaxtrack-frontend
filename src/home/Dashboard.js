import React, { useEffect } from 'react';
import { Grid, Icon, Paper, Typography } from '@mui/material';
import {Groups as GroupsIcon, MedicalServices as MedicalServicesIcon, Summarize as SummarizeIcon} from '@mui/icons-material';
import './Dashboard.css';
import UpcomingVaccinations from '../components/UpcomingVaccinations';
import VaccinationDetailsModal from '../components/VaccinationDetailsModal';
import { _get } from '../api/client';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = React.useState({});
    const [selectedVaccine, setSelectedVaccine] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleVaccineClick = (vaccine) => {
        setSelectedVaccine(vaccine);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getDashoboardData = async () => {
        if (dashboardData && Object.keys(dashboardData).length > 0) {
            return;
        }
        await _get('/dashboard/overview', {})
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch data');
                }
                const resp = res.data;
                if (resp.success === true && resp.data) {
                    setDashboardData(resp.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        // const interval = setInterval(() => {
            getDashoboardData();
        // }, 60000);
        // return () => clearInterval(interval);
    }, []);
  return (
    <div>
      <Grid container direction={"column"} spacing={2} style={{ padding: 20 }}>
        <Grid container spacing={5}>
            <Grid>
                <Paper elevation={3} style={{ padding: 15, width: '100%', textAlign: 'start', borderRadius: 10 }}>
                    <Icon className='student icon'>
                        <GroupsIcon fontSize="inherit" />
                    </Icon>
                    <Typography sx={{opacity: 0.6}}>Total number of students</Typography>
                    <Typography className='count'>{dashboardData?.totalStudents || 0}</Typography>
                </Paper>
            </Grid>
            <Grid>
                <Paper elevation={3} style={{ padding: 15, width: '100%', textAlign: 'start', borderRadius: 10 }}>
                    <Icon className='vaccinated icon'>
                        <MedicalServicesIcon fontSize="inherit" />
                    </Icon>
                    <Typography sx={{opacity: 0.6}}>Number of students vaccinated</Typography>
                    <Typography className='count'>{dashboardData?.numberOfStudentsVaccinated || 0}</Typography>
                </Paper>
            </Grid>
            <Grid>
                <Paper elevation={3} style={{ padding: 15, width: '100%', textAlign: 'start', borderRadius: 10 }}>
                    <Icon className='percentage icon'>
                        <SummarizeIcon fontSize="inherit" />
                    </Icon>
                    <Typography sx={{opacity: 0.6}}>Percentage of students vaccinated</Typography>
                    <Typography className='count'>{dashboardData?.percentageOfStudentsVaccinated || 0}%</Typography>
                </Paper>
            </Grid>
        </Grid>
        <Grid>
            <Paper elevation={3} style={{ width: '100%', textAlign: 'start', borderRadius: 10, marginTop: 20 }}>
                <div style={{ padding: 20 }}>
                    <Typography sx={{opacity: 0.6}}>Upcoming Vaccination Drives</Typography>
                    {dashboardData?.upcomingDrives?.length && <UpcomingVaccinations
                        upcomingDrives={dashboardData?.upcomingDrives || []}
                        onVaccineClick={handleVaccineClick}
                    />}
                </div>
            </Paper>
        </Grid>
      </Grid>
             {/* Modal for displaying vaccination details */}
             <VaccinationDetailsModal 
                open={modalOpen} 
                handleClose={handleCloseModal}
                vaccination={selectedVaccine} 
            />
    </div>
  );
}
export default Dashboard;