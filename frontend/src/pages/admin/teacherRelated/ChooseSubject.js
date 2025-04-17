import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle";
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle";
import { GreenButton, PurpleButton } from "../../../components/buttonStyles";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

const ChooseSubject = ({ situation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [classID, setClassID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [loader, setLoader] = useState(false);

  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );

  useEffect(() => {
    if (situation === "Norm") {
      setClassID(params.id);
      const classID = params.id;
      dispatch(getTeacherFreeClassSubjects(classID));
    } else if (situation === "Teacher") {
      const { classID, teacherID } = params;
      setClassID(classID);
      setTeacherID(teacherID);
      dispatch(getTeacherFreeClassSubjects(classID));
    }
  }, [situation, params, dispatch]);

  const updateSubjectHandler = (teacherId, teachSubject) => {
    setLoader(true);
    dispatch(updateTeachSubject(teacherId, teachSubject));
    navigate("/Admin/teachers");
  };

  const getHeaderText = () => {
    switch (situation) {
      case "Norm":
        return "Assign Teacher to Subject";
      case "Teacher":
        return "Assign Subject to Teacher";
      default:
        return "Choose a Subject";
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", my: 10 }}
      >
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading subjects: {error.message || error}
        </Alert>
      </Container>
    );
  }

  if (response) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: "12px", textAlign: "center" }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            All subjects already have teachers assigned
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You can add new subjects to this class if needed.
          </Typography>
          <PurpleButton
            variant="contained"
            onClick={() => navigate("/Admin/addsubject/" + classID)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Add New Subjects
          </PurpleButton>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 3,
          }}
        >
          {getHeaderText()}
        </Typography>

        {subjectsList?.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Table aria-label="subjects table" sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <StyledTableRow>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    #
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    Subject Name
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    Subject Code
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {subjectsList.map((subject, index) => (
                  <StyledTableRow key={subject._id} hover>
                    <StyledTableCell align="center" component="th" scope="row">
                      <Chip
                        label={index + 1}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ fontWeight: "500" }}>
                      {subject.subName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        label={subject.subCode}
                        color="secondary"
                        variant="outlined"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {situation === "Norm" ? (
                        <GreenButton
                          variant="contained"
                          onClick={() =>
                            navigate(
                              "/Admin/teachers/addteacher/" + subject._id
                            )
                          }
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: "20px",
                            textTransform: "none",
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            "&:hover": {
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            },
                          }}
                        >
                          Assign Teacher
                        </GreenButton>
                      ) : (
                        <GreenButton
                          variant="contained"
                          disabled={loader}
                          onClick={() =>
                            updateSubjectHandler(teacherID, subject._id)
                          }
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: "20px",
                            textTransform: "none",
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            minWidth: "120px",
                          }}
                        >
                          {loader ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Assign Subject"
                          )}
                        </GreenButton>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 6,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No subjects available for this class
            </Typography>
            <PurpleButton
              variant="contained"
              onClick={() => navigate("/Admin/addsubject/" + classID)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Add Subjects
            </PurpleButton>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChooseSubject;
