import React from "react";
import { useDragContextState } from "./hooks/useDragContextState";
import { useSocket } from "./SocketContext";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";

export const TrashCan = () => {
  const { item, setItem } = useDragContextState();
  const socket = useSocket();

  return (
    <TrashCanDiv
      onMouseUp={() => {
        console.log("TRASH THE CRAP", item);
        if (item) {
          socket.emit("delete", { id: item.id });
          setItem(null);
        }
      }}
    >
      <FaTrash className="trash" />
    </TrashCanDiv>
  );
};

const TrashCanDiv = styled.div`
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  .trash {
    width: 72px;
    height: 72px;
    position: relative;
    transition: transform 100ms ease-in-out;
  }

  :hover {
    .trash {
      transform: scale(1.2) translateY(-30px);
    }
  }
`;
