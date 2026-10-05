import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "../Context/userContext";
import NavBar from "./components/Header/Navbar";
import Footer from "./components/Header/footer";
import Home from "./components/Home";
import Articles from "./components/Main/Articles/Articles";
import ListArticlesByTopic from "./components/Main/Articles/ArticlesListedByTopic";
import SingleArticle from "./components/Main/SingleArticle/singleArticle";
import Login from "./components/Main/Users/login";
import SignUp from "./components/Main/Users/signup";
import UserProfile from "./components/User Profile/UserProfile";
import NotFound from "./components/UI/NotFound";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
          <NavBar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route
                path="/articles/topics/:topic"
                element={<ListArticlesByTopic />}
              />
              <Route path="/articles/:article_id" element={<SingleArticle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
