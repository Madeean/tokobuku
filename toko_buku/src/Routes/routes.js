import Book from "../Book/Book";
import { Switch, Route } from "react-router-dom";
import ShowBook from "../Book/ShowBook";
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Book />
      </Route>
      <Route exact path="/show-book/:id">
        <ShowBook />
      </Route>
    </Switch>
  );
}

export default Routes;
