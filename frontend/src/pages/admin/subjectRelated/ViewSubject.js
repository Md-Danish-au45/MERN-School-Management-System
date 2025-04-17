import React, { useEffect, useState } from "react";
import {
  getClassStudents,
  getSubjectDetails,
} from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tab,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  styled,
} from "@mui/material";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.12)",
  },
}));

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } =
    useSelector((state) => state.sclass);

  const { classID, subjectID } = params;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");
  const [selectedSection, setSelectedSection] = useState("attendance");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSectionChange = (newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: "rollNum", label: "Roll No.", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  });

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
          startIcon={<PersonIcon />}
          size="small"
        >
          Profile
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
          startIcon={<EventAvailableIcon />}
          size="small"
        >
          Attendance
        </PurpleButton>
      </Box>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
          startIcon={<PersonIcon />}
          size="small"
        >
          Profile
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)
          }
          startIcon={<AssignmentIcon />}
          size="small"
        >
          Marks
        </PurpleButton>
      </Box>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              startIcon={<PeopleIcon />}
            >
              Add Students
            </GreenButton>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="h2">
                Students
              </Typography>
              <Chip
                label={`${sclassStudents.length} Students`}
                color="primary"
                variant="outlined"
                sx={{ ml: 2, fontSize: "0.9rem" }}
              />
            </Box>

            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 10 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <PurpleButton
                    variant={
                      selectedSection === "attendance"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleSectionChange("attendance")}
                    startIcon={<EventAvailableIcon />}
                  >
                    Attendance
                  </PurpleButton>
                  <PurpleButton
                    variant={
                      selectedSection === "marks" ? "contained" : "outlined"
                    }
                    onClick={() => handleSectionChange("marks")}
                    startIcon={<AssignmentIcon />}
                  >
                    Marks
                  </PurpleButton>
                </Box>
              </Box>

              {selectedSection === "attendance" && (
                <TableTemplate
                  buttonHaver={StudentsAttendanceButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
              {selectedSection === "marks" && (
                <TableTemplate
                  buttonHaver={StudentsMarksButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
            </Paper>
          </>
        )}
      </>
    );
  };

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <MenuBookIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h2">
                  Subject Details
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Subject Name
                  </Typography>
                  <Typography variant="h6">
                    {subjectDetails?.subName || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Subject Code
                  </Typography>
                  <Typography variant="h6">
                    {subjectDetails?.subCode || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Sessions
                  </Typography>
                  <Typography variant="h6">
                    {subjectDetails?.sessions || "0"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Students
                  </Typography>
                  <Typography variant="h6">{numberOfStudents}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" color="textSecondary">
                Class
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {subjectDetails?.sclassName?.sclassName || "N/A"}
              </Typography>

              <Typography variant="subtitle1" color="textSecondary">
                Teacher
              </Typography>
              {subjectDetails?.teacher ? (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                  <Typography variant="h6">
                    {subjectDetails.teacher.name}
                  </Typography>
                </Box>
              ) : (
                <GreenButton
                  variant="contained"
                  onClick={() =>
                    navigate(
                      "/Admin/teachers/addteacher/" + subjectDetails?._id
                    )
                  }
                  startIcon={<PersonIcon />}
                  sx={{ mt: 1 }}
                >
                  Assign Teacher
                </GreenButton>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Quick Actions
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <BlueButton
                    fullWidth
                    variant="contained"
                    onClick={() => setValue("2")}
                    startIcon={<PeopleIcon />}
                  >
                    Manage Students
                  </BlueButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PurpleButton
                    fullWidth
                    variant="contained"
                    onClick={() => handleSectionChange("attendance")}
                    startIcon={<EventAvailableIcon />}
                  >
                    Take Attendance
                  </PurpleButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PurpleButton
                    fullWidth
                    variant="contained"
                    onClick={() => handleSectionChange("marks")}
                    startIcon={<AssignmentIcon />}
                  >
                    Enter Marks
                  </PurpleButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <GreenButton
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/Admin/class/subject/${classID}/${subjectID}/reports`
                      )
                    }
                    startIcon={<InsertChartIcon />}
                  >
                    View Reports
                  </GreenButton>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      {subloading ? (
        <Box sx={{ width: "100%", p: 4 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Paper elevation={3} sx={{ position: "sticky", top: 0, zIndex: 1 }}>
              <TabList
                onChange={handleChange}
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": {
                    height: 4,
                  },
                  "& .MuiTab-root": {
                    fontSize: "1rem",
                    fontWeight: 600,
                    py: 2,
                  },
                }}
              >
                <Tab label="Details" icon={<MenuBookIcon />} value="1" />
                <Tab label="Students" icon={<PeopleIcon />} value="2" />
              </TabList>
            </Paper>

            <Container maxWidth="lg" sx={{ py: 4 }}>
              <TabPanel value="1">
                <SubjectDetailsSection />
              </TabPanel>
              <TabPanel value="2">
                <SubjectStudentsSection />
              </TabPanel>
            </Container>
          </TabContext>
        </Box>
      )}
    </>
  );
};

export default ViewSubject;
