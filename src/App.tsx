import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatScreen } from "./screens/ChatScreen";
import { Header } from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<ChatScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
