import Home from "./components/Home";
import Login from "./components/Login";
import LoginCreate from "./components/LoginCreate";
import LoginPolice from "./components/LoginPolice";
import LoginAdmin from "./components/LoginAdmin";

function App() {
  return (
    <section>
      <Home/>
      <Login/>
      <LoginCreate/>
      <LoginPolice/>
      <LoginAdmin/>
    </section>
  );
}

export default App;
