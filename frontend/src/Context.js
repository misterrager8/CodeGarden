import { createContext, useEffect, useState } from "react";
import { api } from "./util";
import { v4 as uuidv4 } from "uuid";

export const MultiContext = createContext();

export default function MultiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("code-garden-section") || "changes"
  );

  const [tags, setTags] = useState(
    JSON.parse(localStorage.getItem("code-garden-tags")) ||
      [
        "misc",
        "bugfix",
        "refactor",
        "documentation",
        "feature",
        "tweak",
        "ui",
      ].map((x) => ({ label: x, id: uuidv4() }))
  );

  const getRepos = () => {
    setLoading(true);
    api("repositories", {}, (data) => {
      setRepos(data.repositories_);
      setLoading(false);
    });
  };

  const push = () => {
    setLoading(true);
    api("push", { name: currentRepo.name }, (data) => {
      alert(data.output);
      setLoading(false);
    });
  };

  const pull = () => {
    setLoading(true);
    api("pull", { name: currentRepo.name }, (data) => {
      alert(data.output);
      setLoading(false);
    });
  };

  const getRepo = (name) => {
    setLoading(true);
    api(
      "repository",
      {
        name: name,
      },
      (data) => {
        setCurrentRepo(data);
        setLoading(false);
      }
    );
  };

  const addTodo = (e, name, tag) => {
    e.preventDefault();
    setLoading(true);
    api(
      "create_todo",
      { name: name, tag: tag, repository: currentRepo.name },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const editTodo = (e, id, new_name, new_tag, new_status, new_desc) => {
    e && e.preventDefault();
    setLoading(true);
    api(
      "edit_todo",
      {
        id: id,
        new_name: new_name,
        new_tag: new_tag,
        new_status: new_status,
        new_desc: new_desc,
        repository: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const deleteTodo = (id) => {
    setLoading(true);
    api("delete_todo", { id: id, repository: currentRepo.name }, (data) => {
      setCurrentRepo(data.repo);
      setRepos(data.repos);
      setLoading(false);
    });
  };

  const toggleTodo = (id) => {
    setLoading(true);
    api("toggle_todo", { id: id, repository: currentRepo.name }, (data) => {
      setCurrentRepo(data.repo);
      setRepos(data.repos);
      setLoading(false);
    });
  };

  const commitTodo = (id, inProgress) => {
    setLoading(true);
    api("commit_todo", { id: id, inProgress: inProgress }, (data) => {
      setCurrentRepo(data.repo);
      setRepos(data.repos);
      setLoading(false);
    });
  };

  const clearCompleted = () => {
    setLoading(true);
    api("clear_completed", { repo: currentRepo.name }, (data) => {
      setCurrentRepo(data.repo);
      setRepos(data.repos);
      setLoading(false);
    });
  };

  const commit = (e, msg, addAll, msgDetails) => {
    e.preventDefault();
    setLoading(true);
    api(
      "commit",
      {
        name: currentRepo.name,
        msg: msg,
        addAll: addAll,
        msgDetails: msgDetails,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const undoCommit = () => {
    setLoading(true);
    api(
      "run_command",
      {
        repository: currentRepo.name,
        cmd: "git reset --soft HEAD~1",
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const amendCommit = () => {
    setLoading(true);
    api(
      "run_command",
      {
        repository: currentRepo.name,
        cmd: "git commit -a --amend --no-edit",
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const addBranch = (e, name) => {
    e.preventDefault();
    setLoading(true);
    api(
      "create_branch",
      {
        name: name,
        repository: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const deleteBranch = (name) => {
    setLoading(true);
    api(
      "delete_branch",
      {
        name: name,
        repository: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const checkout = (name) => {
    setLoading(true);
    api(
      "checkout_branch",
      {
        name: name,
        repository: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const resetFile = (path) => {
    setLoading(true);
    api(
      "reset_file",
      {
        path: path,
        repository: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const toggleStage = (path, type_, staged) => {
    setLoading(true);
    api(
      "toggle_stage",
      {
        path: path,
        type_: type_,
        staged: staged,
        repository: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const resetAll = () => {
    setLoading(true);
    api(
      "reset_all",
      {
        name: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const stageAll = () => {
    setLoading(true);
    api(
      "stage_all",
      {
        name: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const unstageAll = () => {
    setLoading(true);
    api(
      "unstage_all",
      {
        name: currentRepo.name,
      },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const addRepo = (e, name, description) => {
    e.preventDefault();
    setLoading(true);
    api(
      "create_repository",
      {
        name: name,
        description: description,
      },
      (data) => {
        setCurrentRepo(data);
        setLoading(false);
      }
    );
  };

  const deleteRepo = () => {
    setLoading(true);
    api("delete_repository", { name: currentRepo.name }, (data) => {
      setRepos(data.repos);
      setCurrentRepo(null);
      setLoading(false);
    });
  };

  const exportRepo = () => {
    setLoading(true);
    api("export_repository", { name: currentRepo.name }, (data) => {
      setLoading(false);
    });
  };

  const addIgnore = (e, name) => {
    e && e.preventDefault();
    setLoading(true);
    api(
      "create_ignore",
      { name: name, repository: currentRepo.name },
      (data) => {
        setCurrentRepo(data.repo);
        setRepos(data.repos);
        setLoading(false);
      }
    );
  };

  const deleteIgnore = (id) => {
    setLoading(true);
    api("delete_ignore", { id: id, repository: currentRepo.name }, (data) => {
      setCurrentRepo(data.repo);
      setRepos(data.repos);
      setLoading(false);
    });
  };

  const editReadme = (content) => {
    setLoading(true);
    api("edit_readme", { name: currentRepo.name, content: content }, (data) => {
      setCurrentRepo(data.repo);
      setRepos(data.repos);
      setLoading(false);
    });
  };

  useEffect(() => {
    getRepo(localStorage.getItem("code-garden-last-opened"), (data) =>
      setCurrentRepo(data)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("code-garden-last-opened", currentRepo?.name);
    localStorage.setItem("code-garden-last-opened", currentRepo?.name);
  }, [currentRepo]);

  useEffect(() => {
    localStorage.setItem("code-garden-tags", JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem("code-garden-section", currentPage);
  }, [currentPage]);

  const contextValue = {
    repos: repos,
    setRepos: setRepos,
    currentRepo: currentRepo,
    setCurrentRepo: setCurrentRepo,
    getRepos: getRepos,

    loading: loading,
    setLoading: setLoading,

    getRepo: getRepo,
    addTodo: addTodo,
    editTodo: editTodo,
    deleteTodo: deleteTodo,
    toggleTodo: toggleTodo,
    commitTodo: commitTodo,
    clearCompleted: clearCompleted,
    commit: commit,
    undoCommit: undoCommit,
    amendCommit: amendCommit,
    addBranch: addBranch,
    deleteBranch: deleteBranch,
    checkout: checkout,
    resetFile: resetFile,
    resetAll: resetAll,
    addRepo: addRepo,
    deleteRepo: deleteRepo,
    exportRepo: exportRepo,
    addIgnore: addIgnore,
    deleteIgnore: deleteIgnore,
    editReadme: editReadme,

    tags: tags,
    setTags: setTags,

    push: push,
    pull: pull,

    toggleStage: toggleStage,
    unstageAll: unstageAll,
    stageAll: stageAll,

    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
