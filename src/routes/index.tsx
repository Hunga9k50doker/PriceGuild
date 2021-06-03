import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "pages/home";
import LoginPage from "pages/login";

const AppRoutes: FC = () => {
  return (
    <Switch>
      <Route path="/" exact={true} component={HomePage} />
      <Route path="/login" exact={true} component={LoginPage} />
    </Switch>
  );
};
export default AppRoutes;
