import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import MultiProvider from "./MultiContext";
import Display from "./components/templates/Display";

function App() {
  return (
    <MultiProvider>
      <div className="p-4">
        <Display />
      </div>
    </MultiProvider>
  );
}

export default App;
