import './App.css';
import Main from './main';
import Home from './home';
import Error from './error';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from './create';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <div>
              <Home></Home>
            </div>
          } />
          <Route path="/:firstsegment" element={
            <div>
              <Main></Main>
            </div>
          } />
          <Route path="/create" element={
            <div>
              <Create></Create>
            </div>
          } />
          <Route path="/error" element={
            <div>
              <Error></Error>
            </div>
          } />
          <Route path="/:firstsegement/*" element={
            <div>
              <Error></Error>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
