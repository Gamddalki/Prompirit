import styled from "styled-components";
import mic from "../img/mic.png";
import { Link } from "react-router-dom";
import Popup from "../Components/Popup";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

type EnterProps = {
  color: string;
  width: number;
  top: number;
  enterPromptWidth: number;
  enterButtonWidth: number;
  enterMicWidth: number;
  enterPromptPadding: number;
};

const EnterBox = styled.div<{ enterBoxWidth: number; enterBoxTop: number }>`
  position: absolute;
  width: ${(props) => props.enterBoxWidth}%;
  height: 8.5%;
  top: ${(props) => props.enterBoxTop}%;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const EnterPrompt = styled.input<{
  enterPromptWidth: number;
  enterPromptPadding: number;
}>`
  height: 100%;
  width: ${(props) => props.enterPromptWidth}%;
  border: 1px solid;
  border-color: ${(props) => props.theme.lightGray};
  border-radius: 90px;
  padding: 15px 15px 15px ${(props) => props.enterPromptPadding}%;
  @media (min-width: 500px) {
    font-size: 10px;
  }
  @media (min-width: 900px) {
    font-size: 13px;
  }
  @media (min-width: 1200px) {
    font-size: 16px;
  }
  position: relative;
`;

const EnterMic = styled.button<{ enterMicWidth: number }>`
  position: absolute;
  left: ${(props) => props.enterMicWidth}%;
  width: ${(props) => props.enterMicWidth}%;
  height: 40%;
  z-index: 1;
  img {
    height: 100%;
    object-fit: cover;
  }
`;

const EnterButton = styled.div<{
  enterButtonWidth: number;
  backgroundColor: string;
}>`
  height: 100%;
  width: ${(props) => props.enterButtonWidth}%;
  border-radius: 90px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${(props) => props.backgroundColor};
  cursor: pointer;
  span {
    color: white;
    @media (min-width: 500px) {
      font-size: 10px;
    }
    @media (min-width: 900px) {
      font-size: 13px;
    }
    @media (min-width: 1200px) {
      font-size: 16px;
    }
  }
`;

function Enter({
  color,
  width,
  top,
  enterPromptWidth,
  enterButtonWidth,
  enterMicWidth,
  enterPromptPadding,
}: EnterProps) {
  const { user } = useParams();
  let generatingPath: string;

  if (user) {
    generatingPath = `/generating/${user}`;
  } else {
    generatingPath = "/generating";
  }

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [promptText, setPromptText] = useState<string>("");
  useEffect(() => {
    const storedText = localStorage.getItem("promptText");
    if (storedText) {
      setPromptText(storedText);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromptText(event.target.value);
  };

  const increaseGeneration = () => {
    const generation = localStorage.getItem("generation");
    const newGeneration = generation ? parseInt(generation) + 1 : 1;
    localStorage.setItem("generation", newGeneration.toString());
    navigate(generatingPath);
  };

  const navigate = useNavigate();

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      localStorage.setItem("promptText", promptText.toString());
      increaseGeneration();
      navigate(generatingPath);
    }
  };

  return (
    <>
      <EnterBox enterBoxWidth={width} enterBoxTop={top}>
        <EnterMic onClick={togglePopup} enterMicWidth={enterMicWidth}>
          <img src={mic}></img>
        </EnterMic>
        <EnterPrompt
          enterPromptWidth={enterPromptWidth}
          enterPromptPadding={enterPromptPadding}
          type="text"
          placeholder="Enter Your Prompt"
          value={promptText}
          onChange={handleInputChange}
          onKeyDown={handleEnterKeyPress}
        ></EnterPrompt>
        <EnterButton
          backgroundColor={color}
          enterButtonWidth={enterButtonWidth}
          onClick={increaseGeneration}
        >
          <span>Generate</span>
        </EnterButton>
      </EnterBox>
      {showPopup && <Popup onClose={togglePopup} />}
    </>
  );
}

export default Enter;
