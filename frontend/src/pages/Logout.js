import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../redux/userRelated/userSlice";
import styled from "styled-components";

const Logout = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Wrapper>
      <Card>
        <Title>Hi, {currentUser.name}</Title>
        <Message>Are you sure you want to log out?</Message>
        <ButtonGroup>
          <Button danger onClick={handleLogout}>
            Yes, Log Out
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </ButtonGroup>
      </Card>
    </Wrapper>
  );
};

export default Logout;

// Styled Components

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #ece9f1, #d3cce3);
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ danger }) => (danger ? "#e53935" : "#7e57c2")};
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: ${({ danger }) => (danger ? "#c62828" : "#5e35b1")};
  }
`;
