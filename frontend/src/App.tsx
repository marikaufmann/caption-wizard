import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./hooks/use-app-context";
import Subscription from "./pages/Subscription";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import ScrollToTop from "./components/ScrollToTop";
import { loadFFmpeg } from "./utils";
import { useEffect } from "react";

function App() {
  const { setLoaded, ffmpegRef, isLoggedIn } = useAppContext();
  useEffect(() => {
    loadFFmpeg(ffmpegRef, setLoaded);
  }, []);
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          {isLoggedIn && (
            <>
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/profile/account" element={<Profile />} />
              <Route path="/subscription" element={<Subscription />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
          <Route />
        </Route>
      </Routes>
    </ScrollToTop>
  );
}

export default App;
