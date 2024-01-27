import './App.css';
import Main from './main';
import MainReroute from './mainReroute';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
        <Route index element={
            <div>
            <MainReroute></MainReroute>
          </div>
          } />
          <Route path="/*" element={
            <div>
            <Main></Main>
          </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
