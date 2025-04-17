import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tab,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Card,
  CardContent,
  TextField,
  Divider,
  Avatar,
  Grid,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person,
  School,
  Numbers,
  BarChart,
  PieChart,
  TableChart,
  TableChartOutlined,
  InsertChart,
  InsertChartOutlined,
  EventAvailable as EventAvailableIcon,
  InsertChart as InsertChartIcon,
} from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { purple, green, blue, red } from "@mui/material/colors";

import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
  removeStuff,
  updateStudentFields,
} from "../../../redux/studentRelated/studentHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import Popup from "../../../components/Popup";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const ViewStudent = () => {
  const [showTab, setShowTab] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const studentID = params.id;
  const address = "Student";

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclassName &&
      userDetails.sclassName._id !== undefined
    ) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("1");
  const [selectedSection, setSelectedSection] = useState("table");

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const fields =
    password === "" ? { name, rollNum } : { name, rollNum, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setRollNum(userDetails.rollNum || "");
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || "");
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser(fields, studentID, address))
      .then(() => {
        dispatch(getUserDetails(studentID, address));
        setMessage("Student details updated successfully!");
        setShowPopup(true);
      })
      .catch((error) => {
        setMessage("Error updating student details");
        setShowPopup(true);
        console.error(error);
      });
  };

  const deleteHandler = () => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const removeSubAttendance = (subId) => {
    dispatch(
      updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")
    ).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const subjectData = Object.entries(
    groupAttendanceBySubject(subjectAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
      present,
      sessions
    );
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: sessions,
      attendedClasses: present,
    };
  });

  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: blue[700] }}
            >
              Attendance Records
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: blue[50] }}>
                    <StyledTableCell>Subject</StyledTableCell>
                    <StyledTableCell>Present</StyledTableCell>
                    <StyledTableCell>Total Sessions</StyledTableCell>
                    <StyledTableCell>Attendance %</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                {Object.entries(
                  groupAttendanceBySubject(subjectAttendance)
                ).map(
                  ([subName, { present, allData, subId, sessions }], index) => {
                    const subjectAttendancePercentage =
                      calculateSubjectAttendancePercentage(present, sessions);
                    return (
                      <TableBody key={index}>
                        <StyledTableRow>
                          <StyledTableCell>{subName}</StyledTableCell>
                          <StyledTableCell>{present}</StyledTableCell>
                          <StyledTableCell>{sessions}</StyledTableCell>
                          <StyledTableCell>
                            {subjectAttendancePercentage}%
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              variant="outlined"
                              startIcon={
                                openStates[subId] ? (
                                  <KeyboardArrowUp />
                                ) : (
                                  <KeyboardArrowDown />
                                )
                              }
                              onClick={() => handleOpen(subId)}
                              sx={{ mr: 1 }}
                            >
                              Details
                            </Button>
                            <IconButton
                              onClick={() => removeSubAttendance(subId)}
                              sx={{ color: red[500] }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ ml: 1 }}
                              onClick={() =>
                                navigate(
                                  `/Admin/subject/student/attendance/${studentID}/${subId}`
                                )
                              }
                            >
                              Change
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={openStates[subId]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Attendance Details
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Date</TableCell>
                                      <TableCell align="right">
                                        Status
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {allData.map((data, index) => {
                                      const date = new Date(data.date);
                                      const dateString =
                                        date.toString() !== "Invalid Date"
                                          ? date.toISOString().substring(0, 10)
                                          : "Invalid Date";
                                      return (
                                        <TableRow key={index}>
                                          <TableCell>{dateString}</TableCell>
                                          <TableCell align="right">
                                            <Typography
                                              color={
                                                data.status === "Present"
                                                  ? green[600]
                                                  : red[600]
                                              }
                                              fontWeight="bold"
                                            >
                                              {data.status}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </StyledTableRow>
                      </TableBody>
                    );
                  }
                )}
              </Table>
            </TableContainer>
            <Typography variant="h6" gutterBottom>
              Overall Attendance:{" "}
              <strong>{overallAttendancePercentage.toFixed(2)}%</strong>
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
              >
                Delete All
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate("/Admin/students/student/attendance/" + studentID)
                }
              >
                Add Attendance
              </Button>
            </Box>
          </CardContent>
        </Card>
      );
    };

    const renderChartSection = () => {
      return (
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: blue[700] }}
            >
              Attendance Analytics
            </Typography>
            <CustomBarChart
              chartData={subjectData}
              dataKey="attendancePercentage"
            />
          </CardContent>
        </Card>
      );
    };

    return (
      <>
        {subjectAttendance &&
        Array.isArray(subjectAttendance) &&
        subjectAttendance.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Table View"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChart />
                    ) : (
                      <TableChartOutlined />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart View"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? <BarChart /> : <BarChart />
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No attendance records found
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() =>
                  navigate("/Admin/students/student/attendance/" + studentID)
                }
                sx={{ mt: 2 }}
              >
                Add Attendance
              </Button>
            </CardContent>
          </Card>
        )}
      </>
    );
  };

  const StudentMarksSection = () => {
    const renderTableSection = () => {
      return (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: purple[700] }}
            >
              Exam Results
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: purple[50] }}>
                    <StyledTableCell>Subject</StyledTableCell>
                    <StyledTableCell>Marks Obtained</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjectMarks.map((result, index) => {
                    if (!result.subName || !result.marksObtained) return null;
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          {result.subName.subName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {result.marksObtained}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate("/Admin/students/student/marks/" + studentID)
                }
              >
                Add Marks
              </Button>
            </Box>
          </CardContent>
        </Card>
      );
    };

    const renderChartSection = () => {
      return (
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: purple[700] }}
            >
              Performance Analysis
            </Typography>
            <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
          </CardContent>
        </Card>
      );
    };

    return (
      <>
        {subjectMarks &&
        Array.isArray(subjectMarks) &&
        subjectMarks.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Table View"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChart />
                    ) : (
                      <TableChartOutlined />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart View"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? <BarChart /> : <BarChart />
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No marks records found
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() =>
                  navigate("/Admin/students/student/marks/" + studentID)
                }
                sx={{ mt: 2 }}
              >
                Add Marks
              </Button>
            </CardContent>
          </Card>
        )}
      </>
    );
  };

  const StudentDetailsSection = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto 20px",
                  backgroundColor: purple[500],
                  fontSize: "3rem",
                }}
              >
                <Person fontSize="inherit" />
              </Avatar>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                {userDetails.name}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "left", mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>
                    <Numbers
                      color="primary"
                      sx={{ verticalAlign: "middle", mr: 1 }}
                    />{" "}
                    Roll Number:
                  </strong>{" "}
                  {userDetails.rollNum}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>
                    <School
                      color="primary"
                      sx={{ verticalAlign: "middle", mr: 1 }}
                    />{" "}
                    Class:
                  </strong>{" "}
                  {sclassName.sclassName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>
                    <School
                      color="primary"
                      sx={{ verticalAlign: "middle", mr: 1 }}
                    />{" "}
                    School:
                  </strong>{" "}
                  {studentSchool.schoolName}
                </Typography>
              </Box>

              {subjectAttendance &&
                Array.isArray(subjectAttendance) &&
                subjectAttendance.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Overall Attendance
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <CustomPieChart data={chartData} />
                    </Box>
                  </>
                )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                Edit Student Details
              </Typography>

              <Box component="form" onSubmit={submitHandler}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      variant="outlined"
                      type="number"
                      value={rollNum}
                      onChange={(e) => setRollNum(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password (leave blank to keep current)"
                      variant="outlined"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<EditIcon />}
                    >
                      Update Details
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={deleteHandler}
                    >
                      Delete Student
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Paper
              elevation={3}
              sx={{ position: "sticky", top: 64, zIndex: 2 }}
            >
              <TabList onChange={handleChange} centered>
                <Tab label="Student Details" icon={<Person />} value="1" />
                <Tab
                  label="Attendance"
                  icon={<EventAvailableIcon />}
                  value="2"
                />
                <Tab label="Exam Marks" icon={<InsertChartIcon />} value="3" />
              </TabList>
            </Paper>

            <Box sx={{ pt: 3 }}>
              <TabPanel value="1">
                <StudentDetailsSection />
              </TabPanel>
              <TabPanel value="2">
                <StudentAttendanceSection />
              </TabPanel>
              <TabPanel value="3">
                <StudentMarksSection />
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      )}

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ViewStudent;
