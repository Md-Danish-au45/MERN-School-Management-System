import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Box,
  Checkbox,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { getAllComplains } from "../../../redux/complainRelated/complainHandle";
import TableTemplate from "../../../components/TableTemplate";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  marginTop: theme.spacing(4),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "0.75rem",
  padding: theme.spacing(0.5),
}));

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector(
    (state) => state.complain
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  const complainColumns = [
    {
      id: "user",
      label: "User",
      minWidth: 170,
      align: "left",
      style: { fontWeight: "bold" },
    },
    {
      id: "complaint",
      label: "Complaint Details",
      minWidth: 200,
      align: "left",
    },
    {
      id: "date",
      label: "Date Submitted",
      minWidth: 150,
      align: "center",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      align: "center",
    },
  ];

  const complainRows =
    complainsList?.map((complain) => {
      const date = new Date(complain.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Invalid Date";

      return {
        user: complain.user.name,
        complaint: complain.complaint,
        date: dateString,
        status: (
          <StatusChip
            label={complain.status || "Pending"}
            color={complain.status === "Resolved" ? "success" : "warning"}
            variant="outlined"
          />
        ),
        id: complain._id,
      };
    }) || [];

  const ComplainButtonHaver = ({ row }) => {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": `Select complaint from ${row.user}` }}
        />
      </Stack>
    );
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
          Error loading complaints: {error.message || error}
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
        Complaint Management
      </Typography>

      {response ? (
        <StyledPaper elevation={0}>
          <Typography
            variant="h6"
            color="textSecondary"
            align="center"
            sx={{ py: 4 }}
          >
            No complaints have been submitted yet.
          </Typography>
        </StyledPaper>
      ) : (
        <StyledPaper>
          {complainsList?.length > 0 ? (
            <Box sx={{ overflow: "auto" }}>
              <TableTemplate
                buttonHaver={ComplainButtonHaver}
                columns={complainColumns}
                rows={complainRows}
                sx={{
                  "& .MuiTableCell-root": {
                    py: 2,
                  },
                }}
              />
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              sx={{ py: 4 }}
            >
              No complaints found matching your criteria.
            </Typography>
          )}
        </StyledPaper>
      )}
    </Container>
  );
};

export default SeeComplains;
