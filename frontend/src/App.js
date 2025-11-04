import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/App.css";
import MultiProvider from "./MultiContext";
import Display from "./components/templates/Display";
import Button from "./components/atoms/Button";

function App() {
  return (
    <MultiProvider>
      <Display />
    </MultiProvider>
  );
}

export default App;
