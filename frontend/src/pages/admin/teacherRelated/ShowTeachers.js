import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  Button,
  Box,
  IconButton,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const ShowTeachers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachersList, loading, error, response } = useSelector(
    (state) => state.teacher
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllTeachers(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const columns = [
    { id: "name", label: "Teacher Name", minWidth: 170 },
    { id: "teachSubject", label: "Subject", minWidth: 120 },
    { id: "teachSclass", label: "Class", minWidth: 150 },
  ];

  const rows =
    teachersList?.map((teacher) => {
      return {
        name: teacher.name,
        teachSubject: teacher.teachSubject?.subName || null,
        teachSclass: teacher.teachSclass.sclassName,
        teachSclassID: teacher.teachSclass._id,
        id: teacher._id,
      };
    }) || [];

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Teacher",
      action: () => navigate("/Admin/teachers/chooseclass"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Teachers",
      action: () => deleteHandler(currentUser._id, "Teachers"),
    },
  ];

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
          Error loading teachers: {error.message || error}
        </Alert>
      </Container>
    );
  }

  if (response) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Teacher Management
            </Typography>
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/teachers/chooseclass")}
              startIcon={<PersonAddAlt1Icon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Add Teacher
            </GreenButton>
          </Box>
          <Typography variant="body1" color="text.secondary">
            No teachers found. Add your first teacher to get started.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Teacher Management
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/teachers/chooseclass")}
            startIcon={<PersonAddAlt1Icon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Add Teacher
          </GreenButton>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Table stickyHeader aria-label="teachers table">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <StyledTableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align="left"
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
                <StyledTableCell align="center" style={{ fontWeight: "bold" }}>
                  Actions
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === "teachSubject") {
                          return (
                            <StyledTableCell key={column.id} align="left">
                              {value ? (
                                <Chip
                                  label={value}
                                  color="primary"
                                  variant="outlined"
                                  sx={{ fontWeight: "500" }}
                                />
                              ) : (
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  startIcon={<AddCircleOutlineIcon />}
                                  onClick={() => {
                                    navigate(
                                      `/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`
                                    );
                                  }}
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: "20px",
                                  }}
                                >
                                  Assign Subject
                                </Button>
                              )}
                            </StyledTableCell>
                          );
                        }
                        return (
                          <StyledTableCell key={column.id} align="left">
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </StyledTableCell>
                        );
                      })}
                      <StyledTableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => deleteHandler(row.id, "Teacher")}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(255, 0, 0, 0.08)",
                              },
                            }}
                          >
                            <PersonRemoveIcon color="error" />
                          </IconButton>
                          <BlueButton
                            variant="contained"
                            onClick={() =>
                              navigate("/Admin/teachers/teacher/" + row.id)
                            }
                            startIcon={<VisibilityIcon />}
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: "20px",
                              textTransform: "none",
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                            }}
                          >
                            Details
                          </BlueButton>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{ mt: 2 }}
        />

        <SpeedDialTemplate actions={actions} />
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </Paper>
    </Container>
  );
};

export default ShowTeachers;
