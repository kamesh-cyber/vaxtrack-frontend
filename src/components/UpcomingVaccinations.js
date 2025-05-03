import React from "react";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {NotificationsActive as NotificationsActiveIcon} from '@mui/icons-material';
import { formatDate } from "../utils/common";

const UpcomingVaccinations = ({upcomingDrives=[]}) => {
    const [vaccinations, setVaccinations] = React.useState(upcomingDrives);
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {vaccinations.length ? vaccinations.map((vaccination, index) => (
                <ListItem key={index}>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#f0bd3a' }}>
                            <NotificationsActiveIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={vaccination.name} secondary={formatDate(vaccination?.scheduled_date || "")} />
                </ListItem>
            ))        
            : 
            <ListItem sx={{ width: '100%', justifyContent: 'center' }}>
                <ListItemText primary="No upcoming vaccinations" sx={{".MuiTypography-root ": {textAlign: 'center'}}} />
            </ListItem>
            }
        </List>
    );
}
export default UpcomingVaccinations;
