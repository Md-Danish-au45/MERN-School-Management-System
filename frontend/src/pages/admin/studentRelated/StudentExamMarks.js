import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle";

import Popup from "../../../components/Popup";
import { BlueButton } from "../../../components/buttonStyles";
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
  Card,
  CardContent,
  Divider,
  Avatar,
} from "@mui/material";
import { School, Assignment, Grading, Person } from "@mui/icons-material";
import { blue, purple } from "@mui/material/colors";

const StudentExamMarks = ({ situation }) => {
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
  const [marksObtained, setMarksObtained] = useState("");

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

  const fields = { subName: chosenSubName, marksObtained };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"));
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
      setMessage("Done Successfully");
    }
  }, [response, statestatus, error]);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            p: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: "100%",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                background: `linear-gradient(135deg, ${blue[700]} 0%, ${purple[500]} 100%)`,
                color: "white",
                p: 3,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: blue[700],
                  width: 60,
                  height: 60,
                  margin: "0 auto",
                  mb: 2,
                }}
              >
                <Grading fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                Exam Marks Entry
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} sx={{ mb: 4 }}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, backgroundColor: blue[50], borderRadius: 2 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <Person />
                    </Avatar>
                    <Typography variant="h6">
                      Student: <strong>{userDetails.name}</strong>
                    </Typography>
                  </Stack>
                </Paper>

                {currentUser.teachSubject && (
                  <Paper
                    elevation={0}
                    sx={{ p: 2, backgroundColor: purple[50], borderRadius: 2 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: purple[100], color: purple[600] }}>
                        <School />
                      </Avatar>
                      <Typography variant="h6">
                        Subject:{" "}
                        <strong>{currentUser.teachSubject?.subName}</strong>
                      </Typography>
                    </Stack>
                  </Paper>
                )}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <form onSubmit={submitHandler}>
                <Stack spacing={3}>
                  {situation === "Student" && (
                    <FormControl fullWidth>
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {subjectsList ? (
                          subjectsList.map((subject, index) => (
                            <MenuItem key={index} value={subject.subName}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Assignment color="action" />
                                <Typography>{subject.subName}</Typography>
                              </Stack>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="Select Subject">
                            No Subjects Available
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}

                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      label="Enter marks"
                      value={marksObtained}
                      onChange={(e) => setMarksObtained(e.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </FormControl>

                  <BlueButton
                    fullWidth
                    size="large"
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                    variant="contained"
                    type="submit"
                    disabled={loader}
                    startIcon={loader ? null : <Grading />}
                  >
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit Marks"
                    )}
                  </BlueButton>
                </Stack>
              </form>
            </CardContent>
          </Card>

          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </Box>
      )}
    </>
  );
};

export default StudentExamMarks;
