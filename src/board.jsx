import React from "react";
import styled from "styled-components";
// import { lighten, darken } from "polished";

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
const cells = []; // ["", ...letters.map((label) => ({ label }))];
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
        const data = { axis, size: parseInt(ship.size) };
        if (axis === "x") {
          if (ship.size !== 1 && count === ship.size - 1) data.edge = "left";
          else if (ship.size !== 1 && count === 0) data.edge = "right";
        } else {
          if (ship.size !== 1 && count === ship.size - 1) data.edge = "top";
          else if (ship.size !== 1 && count === 0) data.edge = "bottom";
        }
        // data.label = "x" + ship.size;
        axis === "y"
          ? (grid[origin - count][p.x] = data)
          : (grid[p.y][origin - count] = data);
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
  // cells.push({ label: numbers[i] });
  for (let j = 0; j < grid_size; j++) {
    cells.push({ data: grid[i][j], row: i, col: j });
  }
}

const Board = () => {
  return (
    <>
      <Box>
        <Empty />
        <Chars>
          {letters.map((char) => (
            <Label key={"n" + char}>{char}</Label>
          ))}
        </Chars>
        <Nums>
          {numbers.map((n) => (
            <Label key={"n" + n}>{n}</Label>
          ))}
        </Nums>
        <Container size={grid_size}>
          {cells.map(({ data, row, col }) => {
            return data === 0 ? (
              <Cell key={`${row}${col}`} row={row} col={col} />
            ) : (
              <Sub
                key={`${row}${col}`}
                row={row}
                col={col}
                axis={data.axis}
                edge={data.edge}
                size={data.size}
              />
            );
          })}
        </Container>
      </Box>
    </>
  );
};
export default Board;
const Box = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr;
  grid-template-rows: 1fr 10fr;
`;
const Empty = styled.div``;
const Chars = styled.div`
  display: flex;
`;
const Nums = styled.div`
  display: flex;
  flex-direction: column;
`;
const Container = styled.div.attrs(({ size }) => ({
  style: {
    "--size": size,
    "--width": size * 4,
    "--height": size * 4
  }
}))`
  width: var(--width) rem;
  height: var(--height) rem;
  border: #00cc88 1px solid;
  display: grid;
  grid-template-columns: repeat(var(--size), 1fr);
`;
const bgMixin = ({ row, col }) => {
  let bg;
  if (row % 2 === 0) {
    bg = col % 2 === 0 ? "#111f2f" : "#0f1d2b";
  } else {
    bg = col % 2 === 0 ? "#0f1d2b" : "#0c1824";
  }
  return {
    style: {
      "--bg": bg
    }
  };
};
const Cell = styled.div.attrs(bgMixin)`
  width: 3.5rem;
  height: 3.5rem;
  /* border: lightgray 1px solid; */
  background: var(--bg);
`;
const Sub = styled.div.attrs((props) => {
  const attr = bgMixin(props);
  attr.style["--border-left-color"] = "mediumvioletred";
  attr.style["--border-right-color"] = "mediumvioletred";
  attr.style["--border-top-color"] = "mediumvioletred";
  attr.style["--border-bottom-color"] = "mediumvioletred";
  attr.style["--border-left-width"] = "1px";
  attr.style["--border-right-width"] = "1px";
  attr.style["--border-top-width"] = "1px";
  attr.style["--border-bottom-width"] = "1px";

  let { axis, edge, size } = props;
  if (axis === "x" && size !== 1) {
    if (edge === "left") {
      attr.style["--border-right-color"] = "transparent";
      attr.style["--border-right-width"] = 0;
    } else if (edge === "right") {
      attr.style["--border-left-color"] = "transparent";
      attr.style["--border-left-width"] = 0;
    } else {
      attr.style["--border-right-color"] = "transparent";
      attr.style["--border-right-width"] = 0;
      attr.style["--border-left-color"] = "transparent";
      attr.style["--border-left-width"] = 0;
    }
  } else if (axis === "y" && size !== 1) {
    if (edge === "top") {
      attr.style["--border-bottom-color"] = "transparent";
      attr.style["--border-bottom-width"] = 0;
    } else if (edge === "bottom") {
      attr.style["--border-top-color"] = "transparent";
      attr.style["--border-top-width"] = 0;
    } else {
      attr.style["--border-bottom-color"] = "transparent";
      attr.style["--border-bottom-width"] = 0;
      attr.style["--border-top-color"] = "transparent";
      attr.style["--border-top-width"] = 0;
    }
  }
  return attr;
})`
  width: 3.5rem;
  height: 3.5rem;
  border: mediumvioletred 2px solid;
  border-top-color: var(--border-top-color);
  border-bottom-color: var(--border-bottom-color);
  border-right-color: var(--border-right-color);
  border-left-color: var(--border-left-color);

  border-top-width: var(--border-top-width);
  border-bottom-width: var(--border-bottom-width);
  border-right-width: var(--border-right-width);
  border-left-width: var(--border-left-width);
  /* border-radius:20%; */
  /* background: pink; */
  background: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* :before,
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
  } */
  span {
    position: absolute;
    z-index: 1;
    color: mediumvioletred;
    /* background: white; */
    border-radius: 50%;
    width: 2rem;
  }
`;
const Label = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  color: #2f4d59;
  /* border: lime 1px solid; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
