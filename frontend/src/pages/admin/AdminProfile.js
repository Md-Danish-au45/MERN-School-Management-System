// // import React, { useState } from 'react';
// // import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
// // import { useDispatch, useSelector } from 'react-redux';
// // import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
// // import { useNavigate } from 'react-router-dom'
// // import { authLogout } from '../../redux/userRelated/userSlice';
// // import { Button, Collapse } from '@mui/material';

// import { useSelector } from "react-redux";

// const AdminProfile = () => {
//   // const [showTab, setShowTab] = useState(false);
//   // const buttonText = showTab ? 'Cancel' : 'Edit profile';

//   // const navigate = useNavigate()
//   // const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user);
//   // const { currentUser, response, error } = useSelector((state) => state.user);
//   // const address = "Admin"

//   // if (response) { console.log(response) }
//   // else if (error) { console.log(error) }

//   // const [name, setName] = useState(currentUser.name);
//   // const [email, setEmail] = useState(currentUser.email);
//   // const [password, setPassword] = useState("");
//   // const [schoolName, setSchoolName] = useState(currentUser.schoolName);

//   // const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName }

//   // const submitHandler = (event) => {
//   //     event.preventDefault()
//   //     dispatch(updateUser(fields, currentUser._id, address))
//   // }

//   // const deleteHandler = () => {
//   //     try {
//   //         dispatch(deleteUser(currentUser._id, "Students"));
//   //         dispatch(deleteUser(currentUser._id, address));
//   //         dispatch(authLogout());
//   //         navigate('/');
//   //     } catch (error) {
//   //         console.error(error);
//   //     }
//   // }

//   return (
//     <div>
//       Name: {currentUser.name}
//       <br />
//       Email: {currentUser.email}
//       <br />
//       School: {currentUser.schoolName}
//       <br />
//       {/* <Button variant="contained" color="error" onClick={deleteHandler}>Delete</Button> */}
//       {/* <Button variant="contained" sx={styles.showButton}
//                 onClick={() => setShowTab(!showTab)}>
//                 {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
//             </Button>
//             <Collapse in={showTab} timeout="auto" unmountOnExit>
//                 <div className="register">
//                     <form className="registerForm" onSubmit={submitHandler}>
//                         <span className="registerTitle">Edit Details</span>
//                         <label>Name</label>
//                         <input className="registerInput" type="text" placeholder="Enter your name..."
//                             value={name}
//                             onChange={(event) => setName(event.target.value)}
//                             autoComplete="name" required />

//                         <label>School</label>
//                         <input className="registerInput" type="text" placeholder="Enter your school name..."
//                             value={schoolName}
//                             onChange={(event) => setSchoolName(event.target.value)}
//                             autoComplete="name" required />

//                         <label>Email</label>
//                         <input className="registerInput" type="email" placeholder="Enter your email..."
//                             value={email}
//                             onChange={(event) => setEmail(event.target.value)}
//                             autoComplete="email" required />

//                         <label>Password</label>
//                         <input className="registerInput" type="password" placeholder="Enter your password..."
//                             value={password}
//                             onChange={(event) => setPassword(event.target.value)}
//                             autoComplete="new-password" />

//                         <button className="registerButton" type="submit" >Update</button>
//                     </form>
//                 </div>
//             </Collapse> */}
//     </div>
//   );
// };

// export default AdminProfile;

// // const styles = {
// //     attendanceButton: {
// //         backgroundColor: "#270843",
// //         "&:hover": {
// //             backgroundColor: "#3f1068",
// //         }
// //     }
// // }
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Collapse,
  TextField,
  Divider,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useSelector } from "react-redux";

const AdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [schoolName, setSchoolName] = useState(currentUser.schoolName);
  const [password, setPassword] = useState("");

  const handleEditToggle = () => {
    setShowEdit(!showEdit);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Dispatch your update logic here
    console.log({ name, email, schoolName, password });
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 3,
      }}
    >
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Admin Profile
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body1">
            <strong>Name:</strong> {currentUser.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {currentUser.email}
          </Typography>
          <Typography variant="body1" mb={2}>
            <strong>School:</strong> {currentUser.schoolName}
          </Typography>

          <Button
            variant="contained"
            onClick={handleEditToggle}
            endIcon={showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            sx={{
              backgroundColor: "#270843",
              "&:hover": { backgroundColor: "#3f1068" },
              mb: 2,
            }}
          >
            {showEdit ? "Cancel Edit" : "Edit Profile"}
          </Button>

          <Collapse in={showEdit} timeout="auto" unmountOnExit>
            <Box
              component="form"
              onSubmit={handleUpdate}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="School"
                variant="outlined"
                fullWidth
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password (optional)"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" color="success">
                Update Profile
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminProfile;
