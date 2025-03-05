import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import Nav from "./components/organisms/Nav";
import MultiProvider, { MultiContext } from "./MultiContext";
import { useContext } from "react";
import Display from "./components/templates/Display";

function App() {
  const multiCtx = useContext(MultiContext);

  return (
    <MultiProvider>
      <div className="p-4">
        <Display />
      </div>
    </MultiProvider>
  );
}

export default App;
