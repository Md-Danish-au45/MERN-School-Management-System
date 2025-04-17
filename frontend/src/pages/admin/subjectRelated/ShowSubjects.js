import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Container,
  LinearProgress,
  Chip,
  Avatar,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  marginBottom: theme.spacing(4),
}));

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const subjectColumns = [
    { id: "subName", label: "Subject Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 100 },
    { id: "sclassName", label: "Class", minWidth: 170 },
    { id: "actions", label: "Actions", minWidth: 170, align: "right" },
  ];

  const subjectRows = subjectsList.map((subject) => {
    return {
      subName: subject.subName,
      sessions: subject.sessions,
      sclassName: subject.sclassName.sclassName,
      sclassID: subject.sclassName._id,
      id: subject._id,
    };
  });

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => deleteHandler(row.id, "Subject")}
          size="small"
          aria-label="delete"
        >
          <DeleteIcon color="error" fontSize="small" />
        </IconButton>
        <BlueButton
          variant="contained"
          size="small"
          onClick={() =>
            navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)
          }
        >
          View Details
        </BlueButton>
      </Box>
    );
  };

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {loading ? (
        <Box sx={{ width: "100%", p: 4 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <StyledCard>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <MenuBookIcon />
                </Avatar>
              }
              title={
                <Typography variant="h5" component="h1">
                  Subjects Management
                </Typography>
              }
              subheader={
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <SchoolIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    {subjectsList.length} Subjects across all classes
                  </Typography>
                </Box>
              }
              action={
                response ? (
                  <GreenButton
                    variant="contained"
                    onClick={() => navigate("/Admin/subjects/chooseclass")}
                    startIcon={<PostAddIcon />}
                  >
                    Add Subjects
                  </GreenButton>
                ) : (
                  <Chip
                    label="All Subjects"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 2 }}
                  />
                )
              }
            />

            <CardContent>
              {response ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <MenuBookIcon
                    sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No subjects found
                  </Typography>
                  <GreenButton
                    variant="contained"
                    onClick={() => navigate("/Admin/subjects/chooseclass")}
                    startIcon={<PostAddIcon />}
                    sx={{ mt: 3 }}
                  >
                    Add Your First Subject
                  </GreenButton>
                </Box>
              ) : (
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                  {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                    <TableTemplate
                      buttonHaver={SubjectsButtonHaver}
                      columns={subjectColumns}
                      rows={subjectRows}
                    />
                  )}
                </Paper>
              )}
            </CardContent>
          </StyledCard>

          {!response && <SpeedDialTemplate actions={actions} />}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ShowSubjects;
