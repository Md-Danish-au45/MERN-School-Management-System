import React, { useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import SeeNotice from "../../components/SeeNotice";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import { PolarArea } from "react-chartjs-2";
import { RadialLinearScale, ArcElement, Filler } from "chart.js";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser?._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList?.length;
  const numberOfClasses = sclassesList?.length;
  const numberOfTeachers = teachersList?.length;

  // Gender Distribution (Fake Data)
  const genderData = {
    labels: ["Boys", "Girls"],
    datasets: [
      {
        label: "Gender Ratio",
        data: [120, 100],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
      },
    ],
  };

  // Weekly Attendance Data (Fake)
  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Attendance",
        data: [85, 90, 80, 88, 92, 75, 89],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(153, 102, 255, 0.5)");
          gradient.addColorStop(1, "rgba(255, 159, 64, 0.3)");
          return gradient;
        },
        borderColor: "rgba(153,102,255,1)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(153,102,255,1)",
      },
    ],
  };

  // Fake Data for Users Table
  const fakeUsers = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "User" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "Admin" },
    {
      id: 3,
      name: "Charlie Davis",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 4, name: "Daisy Miller", email: "daisy@example.com", role: "Editor" },
    { id: 5, name: "Edward Wilson", email: "edward@example.com", role: "User" },
  ];

  return (
    <MainContainer maxWidth="lg">
      <Grid container spacing={3}>
        {/* Cards Section */}
        {/* Card 1: Students */}
        <Grid item xs={12} sm={6} md={3}>
          <CardPaper>
            <IconContainer>
              <img src={Students} alt="Students" />
            </IconContainer>
            <CardTitle variant="h6">Total Students</CardTitle>
            <CardData
              start={0}
              end={numberOfStudents}
              duration={2.5}
              separator=","
            />
          </CardPaper>
        </Grid>

        {/* Card 2: Classes */}
        <Grid item xs={12} sm={6} md={3}>
          <CardPaper>
            <IconContainer>
              <img src={Classes} alt="Classes" />
            </IconContainer>
            <CardTitle variant="h6">Total Classes</CardTitle>
            <CardData
              start={0}
              end={numberOfClasses}
              duration={5}
              separator=","
            />
          </CardPaper>
        </Grid>

        {/* Card 3: Teachers */}
        <Grid item xs={12} sm={6} md={3}>
          <CardPaper>
            <IconContainer>
              <img src={Teachers} alt="Teachers" />
            </IconContainer>
            <CardTitle variant="h6">Total Teachers</CardTitle>
            <CardData
              start={0}
              end={numberOfTeachers}
              duration={2.5}
              separator=","
            />
          </CardPaper>
        </Grid>

        {/* Card 4: Fees */}
        <Grid item xs={12} sm={6} md={3}>
          <CardPaper>
            <IconContainer>
              <img src={Fees} alt="Fees" />
            </IconContainer>
            <CardTitle variant="h6">Fees Collection</CardTitle>
            <CardData
              start={0}
              end={23000}
              duration={2.5}
              prefix="$"
              separator=","
            />
          </CardPaper>
        </Grid>

        {/* Notice Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
            }}
          >
            <SeeNotice />
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12}>
          <ChartsContainer>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Gender Distribution (Polar Area)
                  </Typography>
                  <PolarArea data={genderData} options={{ responsive: true }} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Weekly Attendance (Line)
                  </Typography>
                  <Line data={attendanceData} options={{ responsive: true }} />
                </ChartCard>
              </Grid>
            </Grid>
          </ChartsContainer>
        </Grid>

        {/* Users Table Section */}
        <Grid item xs={12}>
          <TableContainer component={MuiPaper} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Users Data
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fakeUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </MainContainer>
  );
};

/* Styled Components */

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(0),
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  padding: theme.spacing(4),
}));

const CardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: 200,
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRadius: "1rem",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 10px 15px rgba(0,0,0,0.2)",
  },
}));

const IconContainer = styled("div")(({ theme }) => ({
  width: 60,
  height: 60,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& img": {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.white,
  marginBottom: theme.spacing(1),
}));

const CardData = styled(CountUp)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: theme.palette.success.main,
}));

const ChartsContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "1rem",
  background: theme.palette.background.paper,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
  },
}));

export default AdminHomePage;
