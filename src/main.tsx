import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import SubstackApp from "./SubstackApp.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

if (window.location.pathname.startsWith('/substack')) {
  root.render(<SubstackApp />);
} else {
  root.render(<App />);
}
