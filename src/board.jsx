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
const random = (max, min = 0) => min + Math.floor(Math.random() * (max - min));
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
const directions = ["up", "down", "left", "right"];
function position(ship) {
  //random point
  const p = { x: random(grid_size - 1), y: random(grid_size - 1) };
  //pick random direction
  const dir = directions[random(directions.length - 1)];
  let dist, origin, clear, count;
  switch (dir) {
    case "up":
      //check how many cells exist till the edge in the chosen direction
      dist = p.y - ship.size;
      //if not enough cells exist set the origin point to the size of the ship
      origin = dist < 0 ? ship.size : p.y;
      //loop ship-size times to the direction
      //check if all the cells are clear
      clear = true;
      count = ship.size;
      while (count--) {
        if (grid[origin - count][p.x] !== 0) clear = false;
      }
      //if they are -> occupy the cells and move to the next ship
      if (clear) {
        count = ship.size;
        while (count--) {
          grid[origin - count][p.x] = "x" + ship.size;
        }
      } else {
        //if not -> choose another point and start over
        position(ship);
      }
      break;
    case "down":
      //check how many cells exist till the edge in the chosen direction
      dist = p.y + ship.size;
      //if not enough cells exist set the origin point to the size of the ship
      origin = dist > grid_size - 1 ? grid_size - 1 : dist;
      //loop ship-size times to the direction
      //check if all the cells are clear
      clear = true;
      count = ship.size;
      while (count--) {
        if (grid[origin - count][p.x] !== 0) clear = false;
      }
      //if they are -> occupy the cells and move to the next ship
      if (clear) {
        count = ship.size;
        while (count--) {
          grid[origin - count][p.x] = "x" + ship.size;
        }
      } else {
        //if not -> choose another point and start over
        position(ship);
      }
      break;
    case "left":
      dist = p.x - ship.size;
      origin = dist < 0 ? ship.size - 1 : p.x;
      clear = true;
      count = ship.size;
      while (count--) {
        if (grid[p.y][origin - count] !== 0) clear = false;
      }
      if (clear) {
        count = ship.size;
        while (count--) {
          grid[p.y][origin - count] = "x" + ship.size;
        }
      } else {
        position(ship);
      }
      break;
    case "right":
      dist = p.y + ship.size;
      origin = dist > grid_size - 1 ? grid_size - 1 : dist;
      clear = true;
      count = ship.size;
      while (count--) {
        if (grid[origin - count][p.x] !== 0) clear = false;
      }
      if (clear) {
        count = ship.size;
        while (count--) {
          grid[origin - count][p.x] = "x" + ship.size;
        }
      } else {
        position(ship);
      }
      break;
    default:
      console.log(dir);
  }
}
for (const ship of ships) {
  // ship.count++;
  console.log(ship);
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

const Container = styled.div`
  width: ${({ size }) => 4 * size}rem;
  height: ${({ size }) => 4 * size}rem;
  /* border: deeppink 1px solid; */
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, 1fr);
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
