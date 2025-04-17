import React, { useEffect } from "react";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography, CircularProgress } from "@mui/material";
import styled from "styled-components";

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector(
    (state) => state.teacher
  );

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  if (error) {
    console.log(error);
  }

  const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

  const handleAddSubject = () => {
    navigate(
      `/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`
    );
  };

  return (
    <PageWrapper>
      {loading ? (
        <Loader>
          <CircularProgress size={60} thickness={5} />
        </Loader>
      ) : (
        <Card>
          <Header>👨‍🏫 Teacher Details</Header>
          <DetailsGrid>
            <Detail>
              <Label>Name:</Label>
              <Value>{teacherDetails?.name}</Value>
            </Detail>
            <Detail>
              <Label>Class:</Label>
              <Value>{teacherDetails?.teachSclass?.sclassName}</Value>
            </Detail>
            {isSubjectNamePresent ? (
              <>
                <Detail>
                  <Label>Subject:</Label>
                  <Value>{teacherDetails?.teachSubject?.subName}</Value>
                </Detail>
                <Detail>
                  <Label>Sessions:</Label>
                  <Value>{teacherDetails?.teachSubject?.sessions}</Value>
                </Detail>
              </>
            ) : (
              <ButtonArea>
                <StyledButton onClick={handleAddSubject}>
                  ➕ Add Subject
                </StyledButton>
              </ButtonArea>
            )}
          </DetailsGrid>
        </Card>
      )}
    </PageWrapper>
  );
};

export default TeacherDetails;

// Styled Components

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fceabb, #f8b500);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 35px 45px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.25);
  }
`;

const Header = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
`;

const DetailsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #666;
`;

const Value = styled.span`
  font-weight: 500;
  color: #222;
`;

const ButtonArea = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  && {
    background: #6a1b9a;
    color: #fff;
    font-weight: 600;
    text-transform: none;
    padding: 12px 24px;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(106, 27, 154, 0.4);

    &:hover {
      background: #4a148c;
    }
  }
`;

const Loader = styled.div`
  display: flex;
  height: 80vh;
  justify-content: center;
  align-items: center;
`;
