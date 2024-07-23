import Dashboard from "./components/Dashboard";
import { useState } from "react";
import ThemeContext from "./context/ThemeContext";
import StockContext from "./context/StockContext";


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [stockSymbol, setStockSymbol] = useState("MSFT");
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <StockContext.Provider value={{stockSymbol, setStockSymbol}}>
        <Dashboard />
      </StockContext.Provider>
    </ThemeContext.Provider>
  );

}

export default App;
