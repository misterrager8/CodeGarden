import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.scss";
import Display from "./components/Display";
import MultiProvider from "./Context";
import Button from "./components/atoms/Button";
import Dropdown from "./components/atoms/Dropdown";

function App() {
  return (
    <MultiProvider>
      <Display />
    </MultiProvider>
  );
}

export default App;
