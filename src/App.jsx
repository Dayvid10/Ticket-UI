import { useEffect } from "react";
import { api } from "./services/api";
import TicketSearch from "./pages/TicketSearch";


function App() {
  useEffect(() => {
    api.get("/health")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

   return <TicketSearch />;
}

export default App;