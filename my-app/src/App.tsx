import { RouterProvider } from "react-router-dom";
import routes from "config/routes";
import "./App.css";
import RequiredAuth from "components/RequiredAuth";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "DM Sans",
          fontSize: 17,
        },
      }}
    >
      <div className="App">
        <RequiredAuth>
          <RouterProvider router={routes} />
        </RequiredAuth>
      </div>
    </ConfigProvider>
  );
}

export default App;
