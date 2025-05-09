import React from "react";
import { Button, Grid, Paper, TextField } from "@mui/material";
import { setLocalStorage } from "../utils/local.js";

const LoginPage = () => {
    const handleLogin = () => {
        const token = "sampleToken"; 
        setLocalStorage("token", token);
        window.location.pathname = "/dashboard";
    };
    return (
        <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid>
                    <Paper elevation={3} style={{ padding: 20 }}>
                        <h2 style={{textAlign: "center"}}>VAX-TRACK</h2>
                        <form>
                            <TextField label="Username" fullWidth margin="normal" />
                            <TextField label="Password" type="password" fullWidth margin="normal" />
                            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                                Login
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
export default LoginPage;