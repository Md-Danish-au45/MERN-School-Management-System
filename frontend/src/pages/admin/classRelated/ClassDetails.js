import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  Box,
  Container,
  Typography,
  Tab,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.12)",
  },
}));

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    loading,
    error,
    response,
    getresponse,
  } = useSelector((state) => state.sclass);

  const classID = params.id;

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const subjectColumns = [
    { id: "name", label: "Subject Name", minWidth: 170 },
    { id: "code", label: "Subject Code", minWidth: 100 },
  ];

  const subjectRows =
    subjectsList &&
    subjectsList.length > 0 &&
    subjectsList.map((subject) => {
      return {
        name: subject.subName,
        code: subject.subCode,
        id: subject._id,
      };
    });

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => {
            navigate(`/Admin/class/subject/${classID}/${row.id}`);
          }}
        >
          View
        </BlueButton>
      </>
    );
  };

  const subjectActions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/addsubject/" + classID),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(classID, "SubjectsClass"),
    },
  ];

  const ClassSubjectsSection = () => {
    return (
      <>
        {response ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/addsubject/" + classID)}
              startIcon={<PostAddIcon />}
            >
              Add Subjects
            </GreenButton>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <MenuBookIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="h2">
                Subjects
              </Typography>
              <Chip
                label={`${subjectsList.length} Subjects`}
                color="primary"
                variant="outlined"
                sx={{ ml: 2, fontSize: "0.9rem" }}
              />
            </Box>

            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <TableTemplate
                buttonHaver={SubjectsButtonHaver}
                columns={subjectColumns}
                rows={subjectRows}
              />
            </Paper>
            <SpeedDialTemplate actions={subjectActions} />
          </>
        )}
      </>
    );
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  });

  const StudentsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
          startIcon={<PersonIcon />}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate("/Admin/students/student/attendance/" + row.id)
          }
          startIcon={<PeopleIcon />}
        >
          Attendance
        </PurpleButton>
      </>
    );
  };

  const studentActions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Student",
      action: () => navigate("/Admin/class/addstudents/" + classID),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Students",
      action: () => deleteHandler(classID, "StudentsClass"),
    },
  ];

  const ClassStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              startIcon={<PersonAddAlt1Icon />}
            >
              Add Students
            </GreenButton>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
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

            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <TableTemplate
                buttonHaver={StudentsButtonHaver}
                columns={studentColumns}
                rows={studentRows}
              />
            </Paper>
            <SpeedDialTemplate actions={studentActions} />
          </>
        )}
      </>
    );
  };

  const ClassTeachersSection = () => {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="textSecondary">
          Teachers section coming soon
        </Typography>
      </Box>
    );
  };

  const ClassDetailsSection = () => {
    const numberOfSubjects = subjectsList.length;
    const numberOfStudents = sclassStudents.length;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ClassIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h2">
                  Class Information
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <strong>Class Name:</strong>{" "}
                {sclassDetails && sclassDetails.sclassName}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{ p: 2, textAlign: "center", borderRadius: 2 }}
                    >
                      <Typography variant="h6" color="textSecondary">
                        Subjects
                      </Typography>
                      <Typography variant="h3" color="primary">
                        {numberOfSubjects}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{ p: 2, textAlign: "center", borderRadius: 2 }}
                    >
                      <Typography variant="h6" color="textSecondary">
                        Students
                      </Typography>
                      <Typography variant="h3" color="primary">
                        {numberOfStudents}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                {getresponse && (
                  <GreenButton
                    variant="contained"
                    onClick={() =>
                      navigate("/Admin/class/addstudents/" + classID)
                    }
                    startIcon={<PersonAddAlt1Icon />}
                  >
                    Add Students
                  </GreenButton>
                )}
                {response && (
                  <GreenButton
                    variant="contained"
                    onClick={() => navigate("/Admin/addsubject/" + classID)}
                    startIcon={<PostAddIcon />}
                  >
                    Add Subjects
                  </GreenButton>
                )}
              </Box>
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
                <Grid item xs={6}>
                  <BlueButton
                    fullWidth
                    variant="contained"
                    onClick={() => setValue("2")}
                    startIcon={<MenuBookIcon />}
                  >
                    Manage Subjects
                  </BlueButton>
                </Grid>
                <Grid item xs={6}>
                  <PurpleButton
                    fullWidth
                    variant="contained"
                    onClick={() => setValue("3")}
                    startIcon={<PeopleIcon />}
                  >
                    Manage Students
                  </PurpleButton>
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
      {loading ? (
        <Box sx={{ width: "100%", p: 4 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Paper
                elevation={3}
                sx={{ position: "sticky", top: 0, zIndex: 1 }}
              >
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
                  <Tab label="Class Details" icon={<ClassIcon />} value="1" />
                  <Tab label="Subjects" icon={<MenuBookIcon />} value="2" />
                  <Tab label="Students" icon={<PeopleIcon />} value="3" />
                  <Tab label="Teachers" icon={<PersonIcon />} value="4" />
                </TabList>
              </Paper>
              <Container
                maxWidth="lg"
                sx={{ marginTop: "2rem", marginBottom: "4rem" }}
              >
                <TabPanel value="1">
                  <ClassDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <ClassSubjectsSection />
                </TabPanel>
                <TabPanel value="3">
                  <ClassStudentsSection />
                </TabPanel>
                <TabPanel value="4">
                  <ClassTeachersSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ClassDetails;
