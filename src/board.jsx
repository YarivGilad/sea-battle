import React from "react";
import styled from "styled-components";

const grid_size = 10;
// Array.from({ length: grid_size }, (_, i) => i + 1);
// A - J
const letters = Array.from({ length: grid_size }, (_, i) =>
  (i + 10).toString(36).toUpperCase()
);
// 1 - 10
// const numbers = Array.from({ length: grid_size }, (_, i) => 0);
const numbers = Array.from({ length: grid_size }, (_, i) => i + 1);
const ships = [
  { size: "4", count: 1 },
  { size: "3", count: 2 },
  { size: "2", count: 3 },
  { size: "1", count: 4 }
];
const cells = ["", ...letters];
const random = (max, min = 0) => min + Math.round(Math.random() * (max - min));
const grid = [];
let count = grid_size;
while (count--) {
  grid.push(Array.from({ length: grid_size }, (_, i) => 0));
}
// const grid = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

//4 directions
// const directions = ["up", "down", "left", "right"];
const positions = ["horizontal", "vertical"];
function position(ship) {
  //random point
  const p = { x: random(grid_size - 1), y: random(grid_size - 1) };
  //pick random direction
  // const dir = directions[random(directions.length - 1)];
  const pos = positions[random(positions.length - 1)];
  const top_edge = 0;
  const bottom_edge = grid_size - 1;
  const right_edge = grid_size - 1;
  const left_edge = 0;
  const left = p.x > left_edge ? p.x - 1 : left_edge;
  const right = p.x < right_edge ? p.x + 1 : right_edge;
  const above = p.y - 1 < top_edge ? top_edge : p.y - 1;
  const below = p.y + 1 > bottom_edge ? bottom_edge : p.y + 1;
  let dist;
  let origin;
  let clear = true;
  let count = ship.size;
  const setup = (axis) => {
    dist = p[axis] - ship.size; //num of cells till the top edge
    origin = dist < 0 ? ship.size : p[axis]; //if not enough cells exist set the origin point to the size of the ship
  };
  const conclude = (axis) => {
    if (clear) {
      //if the cells are clear -> draw the ship
      count = ship.size;
      while (count--) {
        const txt = "x" + ship.size;
        axis === "y"
          ? (grid[origin - count][p.x] = txt)
          : (grid[p.y][origin - count] = txt);
      }
    } else {
      //if not -> choose another point and start over
      return position(ship);
    }
  };
  if (pos === "vertical") {
    setup("y");
    while (count--) {
      const y = origin - count;
      //check the cells are clear
      let line = grid[y];
      let before = grid[y - 1];
      let after = grid[y + 1];
      if (
        line[left] ||
        line[p.x] ||
        line[right] ||
        (y > top_edge && (before[left] || before[p.x] || before[right])) ||
        (y < bottom_edge && (after[left] || after[p.x] || after[right]))
      )
        clear = false;
    }
    conclude("y");
  } else if (pos === "horizontal") {
    setup("x");
    while (count--) {
      const x = origin - count;
      //check the cells are clear
      if (
        grid[above][x] ||
        grid[p.y][x] ||
        grid[below][x] ||
        (x < right_edge &&
          (grid[above][x + 1] || grid[p.y][x + 1] || grid[below][x + 1])) ||
        (x > left_edge &&
          (grid[above][x - 1] || grid[p.y][x - 1] || grid[below][x - 1]))
      )
        clear = false;
      //#region
      // if (grid[above][x] !== 0) clear = false;
      // if (grid[p.y][x] !== 0) clear = false;
      // if (grid[below][x] !== 0) clear = false;
      // if (x < right_edge) {
      //   if (grid[above][x + 1] !== 0) clear = false;
      //   if (grid[p.y][x + 1] !== 0) clear = false;
      //   if (grid[below][x + 1] !== 0) clear = false;
      // }
      // if (x > left_edge) {
      //   if (grid[above][x - 1] !== 0) clear = false;
      //   if (grid[p.y][x - 1] !== 0) clear = false;
      //   if (grid[below][x - 1] !== 0) clear = false;
      // }
      //#endregion
    }
    conclude("x");
  }
}
for (const ship of ships) {
  for (let i = 0; i < ship.count; i++) {
    position(ship);
  }
}

for (let i = 0; i < grid_size; i++) {
  cells.push(numbers[i]);
  for (let j = 0; j < grid_size; j++) {
    cells.push(grid[i][j]);
  }
}

const Board = () => {
  return (
    <Container size={grid_size + 1}>
      {cells.map((l, i) => {
        return l === 0 ? (
          <Cell key={i} />
        ) : typeof l === "string" && l.slice(0, 1) === "x" ? (
          <Sub key={i}>
            <span>{l.slice(1)}</span>
          </Sub>
        ) : (
          <Label key={i}>{l}</Label>
        );
      })}
    </Container>
  );
};
export default Board;

const Container = styled.div.attrs(({ size }) => ({
  style: {
    "--size": size,
    "--width": size * 4,
    "--height": size * 4
  }
}))`
  width: var(--width) rem;
  height: var(--height) rem;
  /* border: deeppink 1px solid; */
  display: grid;
  grid-template-columns: repeat(var(--size), 1fr);
`;
const Cell = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border: lightgray 1px solid;
`;
const Sub = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border: mediumvioletred 1px solid;
  background: pink;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  :before,
  :after {
    content: "";
    position: absolute;
    width: 4.5rem;
    height: 0.1rem;
    background: mediumvioletred;
    transform: rotate(45deg);
  }
  :after {
    transform: rotate(-45deg);
  }
  span {
    position: absolute;
    z-index: 1;
    color: mediumvioletred;
    background: white;
    border-radius: 50%;
    width: 2rem;
  }
`;
const Label = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  /* border: lime 1px solid; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
