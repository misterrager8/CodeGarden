import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import Nav from "./components/organisms/Nav";
import MultiProvider, { MultiContext } from "./MultiContext";
import { useContext } from "react";
import Display from "./components/templates/Display";
import ButtonGroup from "./components/molecules/ButtonGroup";
import Button from "./components/atoms/Button";

function App() {
  const multiCtx = useContext(MultiContext);

  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

  return (
    <MultiProvider>
      <div className="p-4">
        {/* <ButtonGroup>
          {colors.map((x) => (
            <Button className={x} text={x} />
          ))}
        </ButtonGroup> */}
        <Display />
      </div>
    </MultiProvider>
  );
}

export default App;
