import { RouterProvider } from "react-router-dom";
import routes from "config/routes";
import "./App.css";
import RequiredAuth from "components/RequiredAuth";

function App() {
  return (
    <div className="App">
      <RequiredAuth>
        <RouterProvider router={routes} />
      </RequiredAuth>
    </div>
  );
}

export default App;
