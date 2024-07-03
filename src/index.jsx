import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import App from "./app/App";

// third party style
import "perfect-scrollbar/css/perfect-scrollbar.css";
import 'draft-js/dist/Draft.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// for IE-11 support un-comment cssVars() and it's import in this file

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
