import { BrowserRouter } from "react-router-dom";

import {QueryProvider} from "./providers/QueryProvider";

import { AuthProvider } from "./providers/AuthProvider";
import ToastContainer from "../components/common/ToastContainer";
import {ToastProvider} from "./providers/toast-context";
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <ToastContainer />
          <AppRouter />
        </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}