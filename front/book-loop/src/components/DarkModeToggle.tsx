import type { FunctionComponent } from "react";
import { useEffect } from "react";
import { useLocalStorage } from "../helpers/useLocalStorage";
import { PiSunLight } from "react-icons/pi";
import { BsMoon } from "react-icons/bs";
import "../style/dark-mode.css";

interface DarkModeToggleProps {}

const DarkModeToggle: FunctionComponent<DarkModeToggleProps> = () => {

  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  useEffect(() => {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(v => (v === "dark" ? "light" : "dark"));
  };

  const isChecked = theme === "dark";

  return (
    <label htmlFor="switch" className="toggle">
      <input
        id="switch"
        type="checkbox"
        className="input"
        checked={isChecked}
        onChange={toggleDarkMode}
      />

      {/* по умолчанию видна ЛУНА */}
      <div className="icon icon--sun">
        <PiSunLight />
      </div>

      {/* при checked появляется СОЛНЦЕ */}
      <div className="icon icon--moon">
        <BsMoon />
      </div>
    </label>
  );
};

export default DarkModeToggle;
