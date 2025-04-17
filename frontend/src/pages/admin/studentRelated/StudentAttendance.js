import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle";

import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  TextField,
  CircularProgress,
  FormControl,
  Paper,
  Container,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PurpleButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/Subject";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: theme.palette.background.paper,
}));

const FormContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "80vh",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: "12px",
  width: "100%",
}));

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector(
    (state) => state.user
  );
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector(
    (state) => state.student
  );
  const params = useParams();

  const [studentID, setStudentID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSubName, setChosenSubName] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.id);
      const stdID = params.id;
      dispatch(getUserDetails(stdID, "Student"));
    } else if (situation === "Subject") {
      const { studentID, subjectID } = params;
      setStudentID(studentID);
      dispatch(getUserDetails(studentID, "Student"));
      setChosenSubName(subjectID);
    }
  }, [situation]);

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  const changeHandler = (event) => {
    const selectedSubject = subjectsList.find(
      (subject) => subject.subName === event.target.value
    );
    setSubjectName(selectedSubject.subName);
    setChosenSubName(selectedSubject._id);
  };

  const fields = { subName: chosenSubName, status, date };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
  };

  useEffect(() => {
    if (response) {
      setLoader(false);
      setShowPopup(true);
      setMessage(response);
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("error");
    } else if (statestatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Attendance marked successfully!");
    }
  }, [response, statestatus, error]);

  return (
    <FormContainer maxWidth="md">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <StyledPaper elevation={3}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 4,
            }}
          >
            <EventAvailableIcon
              sx={{ verticalAlign: "middle", mr: 2, fontSize: "2rem" }}
            />
            Student Attendance
          </Typography>

          <Stack spacing={3} mb={4}>
            <InfoRow>
              <PersonIcon color="primary" />
              <Typography variant="h6">
                <strong>Student:</strong> {userDetails.name}
              </Typography>
            </InfoRow>

            {currentUser.teachSubject && (
              <InfoRow>
                <SubjectIcon color="primary" />
                <Typography variant="h6">
                  <strong>Subject:</strong> {currentUser.teachSubject?.subName}
                </Typography>
              </InfoRow>
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
            <Stack spacing={4}>
              {situation === "Student" && (
                <FormControl fullWidth size="medium">
                  <InputLabel id="subject-select-label">
                    Select Subject
                  </InputLabel>
                  <Select
                    labelId="subject-select-label"
                    id="subject-select"
                    value={subjectName}
                    label="Select Subject"
                    onChange={changeHandler}
                    required
                    sx={{ borderRadius: "12px" }}
                  >
                    {subjectsList ? (
                      subjectsList.map((subject, index) => (
                        <MenuItem key={index} value={subject.subName}>
                          {subject.subName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="Select Subject">
                        No subjects available
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth size="medium">
                <InputLabel id="status-select-label">
                  Attendance Status
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={status}
                  label="Attendance Status"
                  onChange={(event) => setStatus(event.target.value)}
                  required
                  sx={{ borderRadius: "12px" }}
                >
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="Select Date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: { borderRadius: "12px" },
                  }}
                  fullWidth
                />
              </FormControl>

              <PurpleButton
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  py: 2,
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
                variant="contained"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Mark Attendance"
                )}
              </PurpleButton>
            </Stack>
          </Box>
        </StyledPaper>
      )}

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </FormContainer>
  );
};

export default StudentAttendance;
