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
  bottom: 100px;
  left: 50%;
  width: 200px;
  height: 200px;

  .trash {
    width: 72px;
    height: 72px;
    position: relative;
    transition: transform 100ms ease-in-out;
  }

  :hover {
    bottom: 110px;

    .trash {
      transform: scale(1.2) translateY(-30px);
    }
  }
`;
