import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import {
  Paper,
  Box,
  IconButton,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  BlackButton,
  BlueButton,
  GreenButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popup from "../../../components/Popup";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  marginTop: theme.spacing(3),
}));

const ActionButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  "& .MuiButton-root": {
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "0.75rem",
  },
}));

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector(
    (state) => state.student
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const studentColumns = [
    {
      id: "name",
      label: "Student Name",
      minWidth: 200,
      align: "left",
      style: { fontWeight: "bold" },
    },
    {
      id: "rollNum",
      label: "Roll Number",
      minWidth: 120,
      align: "center",
    },
    {
      id: "sclassName",
      label: "Class",
      minWidth: 150,
      align: "center",
    },
  ];

  const studentRows =
    studentsList?.map((student) => {
      return {
        name: student.name,
        rollNum: (
          <Chip
            label={student.rollNum}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />
        ),
        sclassName: student.sclassName.sclassName,
        id: student._id,
      };
    }) || [];

  const StudentButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];
    const [open, setOpen] = useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      if (selectedIndex === 0) {
        navigate("/Admin/students/student/attendance/" + row.id);
      } else if (selectedIndex === 1) {
        navigate("/Admin/students/student/marks/" + row.id);
      }
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Delete Student">
          <IconButton
            onClick={() => deleteHandler(row.id, "Student")}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.08)",
              },
            }}
          >
            <PersonRemoveIcon color="error" />
          </IconButton>
        </Tooltip>

        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
          sx={{
            px: 2,
            py: 1,
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          View Details
        </BlueButton>

        <ActionButtonGroup variant="contained" ref={anchorRef}>
          <Button
            onClick={handleClick}
            sx={{
              backgroundColor: "#424242",
              "&:hover": {
                backgroundColor: "#616161",
              },
            }}
          >
            {options[selectedIndex]}
          </Button>
          <BlackButton
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            onClick={handleToggle}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </BlackButton>
        </ActionButtonGroup>

        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper elevation={3}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
    );
  };

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Student",
      action: () => navigate("/Admin/addstudents"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Students",
      action: () => deleteHandler(currentUser._id, "Students"),
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
          Error loading students: {error.message || error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 2,
        }}
      >
        Student Management
      </Typography>

      {response ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No students found.
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/addstudents")}
            startIcon={<PersonAddAlt1Icon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Add Students
          </GreenButton>
        </Box>
      ) : (
        <StyledPaper elevation={0}>
          {studentsList?.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                }}
              >
                <GreenButton
                  variant="contained"
                  onClick={() => navigate("/Admin/addstudents")}
                  startIcon={<PersonAddAlt1Icon />}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Add New Student
                </GreenButton>
              </Box>
              <TableTemplate
                buttonHaver={StudentButtonHaver}
                columns={studentColumns}
                rows={studentRows}
                sx={{
                  "& .MuiTableCell-root": {
                    py: 2,
                  },
                }}
              />
            </>
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              sx={{ py: 4 }}
            >
              No students found matching your criteria.
            </Typography>
          )}
        </StyledPaper>
      )}

      <SpeedDialTemplate actions={actions} />
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ShowStudents;
