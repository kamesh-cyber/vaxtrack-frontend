import React from "react";
import "./Students.css";
import TableComp from "../components/TableComp";
import {
    EditDocument as EditIcon, 
    AddBox as AddIcon, 
    DriveFolderUpload as UploadIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { 
    Button, 
    Grid, 
    Paper, 
    Typography, 
    CircularProgress, 
    TextField, 
    InputAdornment, 
    FormControl, 
    Select, 
    MenuItem, 
    InputLabel, 
    Box 
} from "@mui/material";
import AddStudentModal from "../components/AddStudentModal";
import UploadStudentModal from "../components/UploadStudentModal";
import { _get } from "../api/client";
import UpdateStudentModal from "../components/UpdateStudentModal";

const Students = () => {
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState({show: false, studentId: null, class: 0});
    
    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalStudents, setTotalStudents] = React.useState(0);
    
    // Search states
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchType, setSearchType] = React.useState('name');
    const [isSearching, setIsSearching] = React.useState(false);
    
    // Get students with optional search and pagination
    const getStudents = async (pageNum = page, rowsCount = rowsPerPage, search = isSearching ? { type: searchType, value: searchTerm } : null) => {
        setLoading(true);
        try {
            const offset = pageNum * rowsCount;
            const params = {
                limit: rowsCount,
                offset: offset
            };
            
            console.log("search", search);
            if (search && search.value) {
                switch (search.type) {
                    case 'name':
                        params.name = search.value;
                        break;
                    case 'class':
                        params.class = search.value;
                        break;
                    case 'id':
                        params.id = search.value;
                        break;
                    case 'vaccinationStatus':
                        params.vaccinationStatus = search.value;
                        break;
                    default:
                        break;
                }
            }
            
            const res = await _get("/students", { params });
            
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            
            const resp = res.data;
            if (resp.success === true) {
                const studentData = Array.isArray(resp.data) ? resp.data : [resp.data];
                setStudents(studentData || []);
                if (resp.totalCount !== undefined) {
                    setTotalStudents(resp.totalCount);
                }
                else {
                    setTotalStudents(studentData.length);
                }
            }
        } catch (err) {
            console.error("Error fetching students:", err);
            setStudents([]);
            setTotalStudents(0);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSearch = () => {
        setIsSearching(!!searchTerm);
        setPage(0); 
        getStudents(0, rowsPerPage, { type: searchType, value: searchTerm });
    };
    
    const clearSearch = () => {
        setSearchTerm('');
        setSearchType('name');
        setIsSearching(false);
        setPage(0);
        getStudents(0, rowsPerPage,null);
    };
    
    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getStudents(newPage, rowsPerPage, isSearching ? { type: searchType, value: searchTerm } : null);
    };
    
    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        getStudents(0, newRowsPerPage, isSearching ? { type: searchType, value: searchTerm } : null);
    };
    
    // Handle search input change
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    // Handle search type change
    const handleSearchTypeChange = (event) => {
        const newSearchType = event.target.value;
        setSearchType(newSearchType);
        
        // Reset search term when changing to/from vaccination status
        if (newSearchType === "vaccinationStatus") {
            setSearchTerm("true"); // Default to "Vaccinated"
        } else if (searchType === "vaccinationStatus") {
            setSearchTerm(""); // Clear when switching from vaccination status
        }    };
    
    // Handle Enter key press in search input
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    
    React.useEffect(() => {
        getStudents();
    }, []);

    return (
        <>
        <Paper sx={{ padding: 2 }}>
            <Typography className="page-title" sx={{ fontWeight: "bold" }}>
                Students List
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{ mb: 3, mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Search By</InputLabel>
                            <Select
                                value={searchType}
                                label="Search By"
                                onChange={handleSearchTypeChange}
                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="id">ID</MenuItem>
                                <MenuItem value="class">Class</MenuItem>
                                <MenuItem value="vaccinationStatus">Vaccination Status</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    {searchType === "vaccinationStatus" ? (
        <FormControl fullWidth size="small">
            <InputLabel>Vaccination Status</InputLabel>
            <Select
                value={searchTerm}
                label="Vaccination Status"
                onChange={(e) => setSearchTerm(e.target.value)}
            >
                <MenuItem value="true">Vaccinated</MenuItem>
                <MenuItem value="false">Not Vaccinated</MenuItem>
            </Select>
        </FormControl>
    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={`Search by ${searchType}...`}
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
    )}
                    </Grid>
                    <Grid item xs={6} sm={1.5}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={handleSearch}
                            disabled={searchType === "vaccinationStatus" ? searchTerm === "" : !searchTerm}
                        >
                            Search
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={1.5}>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            fullWidth
                            onClick={clearSearch}
                            disabled={!isSearching}
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            
            {/* Actions Bar */}
            <Grid container direction="row" spacing={1} sx={{ marginBottom: 2, alignItems: "baseline" }}>
                <Typography className="student-count" sx={{ fontWeight: "bold", color: "gray" }}>
                    Total Students: {totalStudents || students.length}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<UploadIcon />}
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                        setShowUploadModal(true);
                    }}
                >Bulk Upload</Button>
                <Button 
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >Add Student</Button>
            </Grid>
            
            {/* Students Table */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {loading ? (
                    <Grid container justifyContent="center" sx={{ padding: 4 }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <>
                        {isSearching && (
                            <Grid container sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Search results for: {searchType === 'vaccinationStatus' ? 
                                        (searchTerm === 'true' ? 'Vaccinated' : 'Not Vaccinated') : 
                                        searchTerm}
                                </Typography>
                            </Grid>
                        )}
                        <TableComp
                            title="Students"
                            columns={[
                                { id: "_id", label: "ID", align: "center" },
                                { id: "name", label: "Name", align: "center" },
                                { id: "age", label: "Age", align: "center" },
                                { id: "class", label: "Class", align: "center" },
                                { id: "gender", label: "Gender", align: "center" },
                                { id: "dateOfBirth", label: "Date of Birth", align: "center" },
                                { id: "action", label: "Action", align: "center" }
                            ]}
                            rows={students}
                            actions={[
                                {
                                    name: "Edit",
                                    color: "rgb(40, 40, 206)",
                                    icon: <EditIcon fontSize="small"/>,
                                    onClick: (row) => {
                                        console.log("Edit", row);
                                        setUpdateModal({show: true, studentId: row._id, class: row.class});
                                    },
                                }
                            ]}
                            pagination={true}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalCount={totalStudents}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Grid>
        </Paper>

        {/* Modals */}
        {showAddModal && <AddStudentModal
            open={showAddModal}
            handleClose={() => {
                setShowAddModal(false);
            }}
            refreshStudents={getStudents}
        />}
        {updateModal.show && <UpdateStudentModal
            updateData={updateModal}
            handleClose={() => {
                setUpdateModal({show: false, studentId: null, class: 0});
            }}
            refreshStudents={getStudents}
        />}
        {showUploadModal && <UploadStudentModal
            open={showUploadModal}
            handleClose={() => {
                setShowUploadModal(false);
            }}
            refreshStudents={getStudents}
        />}
        </>     
    );
};

export default Students;