import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const AddTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectID = params.id;

  const { status, response, error } = useSelector((state) => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const role = "Teacher";
  const school = subjectDetails && subjectDetails.school;
  const teachSubject = subjectDetails && subjectDetails._id;
  const teachSclass =
    subjectDetails &&
    subjectDetails.sclassName &&
    subjectDetails.sclassName._id;

  const fields = {
    name,
    email,
    password,
    role,
    school,
    teachSubject,
    teachSclass,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate("/Admin/teachers");
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.contrastText",
              color: "primary.main",
              mr: 2,
            }}
          >
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h4" component="h1">
            Add New Teacher
          </Typography>
        </Box>

        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 2, height: "100%" }}
              >
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Subject Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Subject
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <MenuBookIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {subjectDetails?.subName || "Loading..."}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Class
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <SchoolIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {subjectDetails?.sclassName?.sclassName || "Loading..."}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" color="textSecondary">
                  This teacher will be automatically assigned to teach this
                  subject in the specified class.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <form onSubmit={submitHandler}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Teacher Details
                </Typography>

                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="name"
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="email"
                />

                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="new-password"
                />

                <Box sx={{ mt: 4 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loader}
                    size="large"
                    startIcon={
                      loader ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <PersonAddIcon />
                      )
                    }
                  >
                    {loader ? "Registering..." : "Register Teacher"}
                  </Button>
                </Box>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default AddTeacher;
