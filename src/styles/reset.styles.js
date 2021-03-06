import { createGlobalStyle } from "styled-components";

const ResetStyles = createGlobalStyle`
    html,
    body {
      height: 100%;
    }
    html {
      font-size: 10px;
    }
    body {
      font-size: 1.6rem;
      font-family:sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      background: papayawhip;
     
      /* background: linear-gradient(
        to bottom,
        #f5f5dc 0%,
        #d2b48c 100%
      );  */
      background: linear-gradient(
        170deg, 
        #123 40%,
        black 100% 
      );
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      /* border:aqua dashed 3px; */
      /*color:papayawhip*/
    }
    li {
      list-style-type: none;
    }
`;

export default ResetStyles;
