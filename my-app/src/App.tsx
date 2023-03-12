import { RouterProvider } from "react-router-dom";
import routes from "config/routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
