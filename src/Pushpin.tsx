import React from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

interface Props {
  className?: string;
  color: string;
}

interface StyledProps {
  color: string;
}

const getGradient = (topColor: string, bottomColor: string) => {
  return `linear-gradient(180deg, ${topColor}, ${bottomColor})`;
};

const PushpinHead = styled.div<StyledProps>`
  background-color: ${(props) => props.color};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
`;

const PushpinContainer = styled.div<StyledProps>`
  position: relative;
  background: ${(props) => props.color};
  height: 30px;
  width: 30px;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: move;
  }
  :active {
    cursor: grab;
  }
`;

export const Pushpin = ({ className, color }: Props) => {
  const colorInstance = tinycolor(color);
  const pinColor = colorInstance.isLight()
    ? colorInstance.darken(10).toHexString()
    : colorInstance.lighten(20).toHexString();
  const pinShadeColor = colorInstance.darken(10).toHexString();
  return (
    <PushpinContainer
      className={className}
      color={getGradient(pinColor, pinShadeColor)}
    >
      <PushpinHead color={pinColor} />
    </PushpinContainer>
  );
};
