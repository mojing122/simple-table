import "./App.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import HomePage from "./pages/HomePage";
import { ConfigProvider } from "antd";

function App() {
  /*** 
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    let greetMsg:any = "";
    invoke("greet", { name }).then((message)=>{ 
      greetMsg = message;
      setGreetMsg(greetMsg);
    })
    
  }

  */

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: "#00b96b",
              borderRadius: 5,
            },
          }}
        >
          <HomePage></HomePage>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
