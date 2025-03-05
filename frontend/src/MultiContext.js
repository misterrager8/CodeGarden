import { createContext, useEffect, useState } from "react";
import { api } from "./util";
import { getRepo } from "./hooks";

export const MultiContext = createContext();

export default function MultiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);

  const getRepos = () => {
    setLoading(true);
    api("repositories", {}, (data) => {
      setRepos(data.repositories_);
      setLoading(false);
    });
  };

  useEffect(() => {
    getRepo(localStorage.getItem("code-garden-last-opened"), (data) =>
      setCurrentRepo(data)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("code-garden-last-opened", currentRepo?.name || null);
  }, [currentRepo]);

  const contextValue = {
    repos: repos,
    setRepos: setRepos,
    currentRepo: currentRepo,
    setCurrentRepo: setCurrentRepo,
    getRepos: getRepos,

    loading: loading,
    setLoading: setLoading,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
