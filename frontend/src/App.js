import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import Display from "./components/Display";
import MultiProvider from "./Context";

function App() {
  return (
    <MultiProvider>
      <Display />
    </MultiProvider>
  );
}

export default App;
