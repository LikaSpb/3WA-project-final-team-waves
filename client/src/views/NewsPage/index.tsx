import React from "react";
import useAuth from "../../hooks/auth.hooks";
import Sidebar from "../../components/News/Sidebar";
import { Posts } from "../../components/News/Posts";

const NewsPage = () => {
  useAuth();

  return (
    <div className="news-container">
      <Sidebar />
      <Posts />
    </div>
  );
};

export default NewsPage;
