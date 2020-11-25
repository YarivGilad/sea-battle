import React from "react";
import Board from "./board";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <h1>
        Sea battle{" "}
        <span role="img" aria-label="confetti">
          🎉
        </span>
      </h1>
      <Board />
    </Container>
  );
}
export default App;
const Container = styled.div`
  text-align: center;
  h1 {
    padding-bottom: 2rem;
  }
`;
