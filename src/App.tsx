import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./router";

const App: React.FC = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;
