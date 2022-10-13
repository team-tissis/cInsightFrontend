import { BrowserRouter, Route } from "react-router-dom";
import AppRoutes from "./routes/app";
import GlobalStateContainer from "containers/global_state_container";
import "./App.css";
import "./App.scss";
import ThemeContainer from "containers/theme_container";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import "rc-time-picker/assets/index.css";

const App = (): JSX.Element => {
  return (
    <ThemeContainer>
      <GlobalStateContainer>
        <BrowserRouter>
          <Route component={AppRoutes} />
        </BrowserRouter>
      </GlobalStateContainer>
    </ThemeContainer>
  );
};

export default App;
