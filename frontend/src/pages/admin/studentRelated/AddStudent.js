import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  maxWidth: "600px",
  margin: "auto",
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: "100%",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "bold",
  marginTop: theme.spacing(2),
}));

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "") {
      setClassName("");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      setClassName(selectedClass.sclassName);
      setSclassName(selectedClass._id);
    }
  };

  const fields = {
    name,
    rollNum,
    password,
    sclassName,
    adminID,
    role,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (sclassName === "") {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 4,
            textAlign: "center",
          }}
        >
          Add New Student
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message || error}
          </Alert>
        )}

        <form onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledFormControl>
                <TextField
                  fullWidth
                  label="Student Name"
                  variant="outlined"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </StyledFormControl>
            </Grid>

            {situation === "Student" && (
              <Grid item xs={12}>
                <StyledFormControl>
                  <InputLabel id="class-select-label">Class</InputLabel>
                  <Select
                    labelId="class-select-label"
                    label="Class"
                    value={className}
                    onChange={changeHandler}
                    required
                  >
                    <MenuItem value="">
                      <em>Select Class</em>
                    </MenuItem>
                    {sclassesList.map((classItem, index) => (
                      <MenuItem key={index} value={classItem.sclassName}>
                        {classItem.sclassName}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <StyledFormControl>
                <TextField
                  fullWidth
                  label="Roll Number"
                  variant="outlined"
                  type="number"
                  value={rollNum}
                  onChange={(event) => setRollNum(event.target.value)}
                  required
                />
              </StyledFormControl>
            </Grid>

            <Grid item xs={12}>
              <StyledFormControl>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </StyledFormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loader}
                  sx={{ width: "200px" }}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Add Student"
                  )}
                </SubmitButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default AddStudent;
