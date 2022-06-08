import Dashboard from "./pages/Dashboard";
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Result from "./pages/Result";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/:id" element={<Result/>}/>
      
    </Routes>
    </BrowserRouter> 
  );
}

export default App;
