import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([
    { subName: "", subCode: "", sessions: "" },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;

  const sclassName = params.id;
  const adminID = currentUser._id;
  const address = "Subject";

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubjectNameChange = (index) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index].subName = event.target.value;
    setSubjects(newSubjects);
  };

  const handleSubjectCodeChange = (index) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index].subCode = event.target.value;
    setSubjects(newSubjects);
  };

  const handleSessionsChange = (index) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index].sessions = event.target.value || 0;
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
  };

  const handleRemoveSubject = (index) => () => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const fields = {
    sclassName,
    subjects: subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
    })),
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/subjects");
      dispatch(underControl());
      setLoader(false);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              p: 2,
              borderRadius: 2,
            }}
          >
            <MenuBookIcon sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h5" component="h1">
              Add New Subjects
            </Typography>
          </Box>

          <form onSubmit={submitHandler}>
            {subjects.map((subject, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Subject #{index + 1}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Subject Name"
                      variant="outlined"
                      value={subject.subName}
                      onChange={handleSubjectNameChange(index)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Subject Code"
                      variant="outlined"
                      value={subject.subCode}
                      onChange={handleSubjectCodeChange(index)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Sessions"
                      variant="outlined"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={subject.sessions}
                      onChange={handleSessionsChange(index)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={1}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {index === 0 ? (
                      <IconButton
                        color="primary"
                        onClick={handleAddSubject}
                        aria-label="Add subject"
                      >
                        <AddCircleOutlineIcon fontSize="medium" />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="error"
                        onClick={handleRemoveSubject(index)}
                        aria-label="Remove subject"
                      >
                        <RemoveCircleOutlineIcon fontSize="medium" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loader}
                startIcon={
                  loader ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{ px: 4, py: 1 }}
              >
                {loader ? "Saving..." : "Save Subjects"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Box>
  );
};

export default SubjectForm;
