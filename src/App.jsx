import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "../Context/userContext";
import NavBar from "./components/Header/Navbar";
import Footer from "./components/Header/footer";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Notifications from "./components/Dashboard/Notifications";
import Articles from "./components/Main/Articles/Articles";
import CreateArticle from "./components/Main/Articles/CreateArticle";
import EditArticle from "./components/Main/Articles/EditArticle";
import FollowingFeed from "./components/Main/Articles/FollowingFeed";
import ListArticlesByTopic from "./components/Main/Articles/ArticlesListedByTopic";
import SingleArticle from "./components/Main/SingleArticle/singleArticle";
import Login from "./components/Main/Users/login";
import SignUp from "./components/Main/Users/signup";
import Users from "./components/Main/Users/Users";
import PublicUserProfile from "./components/Main/Users/PublicUserProfile";
import UserProfile from "./components/User Profile/UserProfile";
import AccountSettings from "./components/User Profile/AccountSettings";
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/following" element={<FollowingFeed />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/new" element={<CreateArticle />} />
              <Route
                path="/articles/topics/:topic"
                element={<ListArticlesByTopic />}
              />
              <Route path="/articles/:article_id/edit" element={<EditArticle />} />
              <Route path="/articles/:article_id" element={<SingleArticle />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:username" element={<PublicUserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="/settings" element={<AccountSettings />} />
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
