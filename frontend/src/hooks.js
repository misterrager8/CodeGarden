import { api } from "./util";

export const getRepo = (name, callback) => {
  api(
    "repository",
    {
      name: name,
    },
    (data) => callback(data)
  );
};

export const addTodo = (e, name, tag, repository, callback) => {
  e.preventDefault();
  api("create_todo", { name: name, tag: tag, repository: repository }, (data) =>
    callback(data)
  );
};

export const editTodo = (
  e,
  id,
  new_name,
  new_tag,
  new_status,
  new_desc,
  repository,
  callback
) => {
  e && e.preventDefault();
  api(
    "edit_todo",
    {
      id: id,
      new_name: new_name,
      new_tag: new_tag,
      new_status: new_status,
      new_desc: new_desc,
      repository: repository,
    },
    (data) => callback(data)
  );
};

export const deleteTodo = (id, repository, callback) => {
  api("delete_todo", { id: id, repository: repository }, (data) =>
    callback(data)
  );
};

export const toggleTodo = (id, repository, callback) => {
  api("toggle_todo", { id: id, repository: repository }, (data) =>
    callback(data)
  );
};

export const commitTodo = (id, callback) => {
  api("commit_todo", { id: id }, (data) => callback(data));
};

export const clearCompleted = (repository, callback) => {
  api("clear_completed", { repo: repository }, (data) => callback(data));
};

export const commit = (e, name, msg, callback) => {
  e.preventDefault();
  api("commit", { name: name, msg: msg }, (data) => callback(data));
};

export const undoCommit = (repository, callback) => {
  api(
    "run_command",
    {
      repository: repository,
      cmd: "git reset --soft HEAD~1",
    },
    (data) => callback(data)
  );
};

export const amendCommit = (repository, callback) => {
  api(
    "run_command",
    {
      repository: repository,
      cmd: "git commit -a --amend --no-edit",
    },
    (data) => callback(data)
  );
};

export const addBranch = (e, name, repository, callback) => {
  e.preventDefault();
  api(
    "create_branch",
    {
      name: name,
      repository: repository,
    },
    (data) => callback(data)
  );
};

export const deleteBranch = (repository, name, callback) => {
  api(
    "delete_branch",
    {
      name: name,
      repository: repository,
    },
    (data) => callback(data)
  );
};

export const checkout = (name, repository, callback) => {
  api(
    "checkout_branch",
    {
      name: name,
      repository: repository,
    },
    (data) => callback(data)
  );
};

export const resetFile = (name, repository, callback) => {
  api(
    "reset_file",
    {
      name: name,
      repository: repository,
    },
    (data) => callback(data)
  );
};

export const resetAll = (name, callback) => {
  api(
    "reset_all",
    {
      name: name,
    },
    (data) => callback(data)
  );
};

export const addRepo = (e, name, callback) => {
  e.preventDefault();
  api(
    "create_repository",
    {
      name: name,
    },
    (data) => callback(data)
  );
};

export const deleteRepo = (name, callback) => {
  api("delete_repository", { name: name }, (data) => callback(data));
};

export const exportRepo = (name, callback) => {
  api("export_repository", { name: name }, (data) => callback(data));
};

export const addIgnore = (e, name, repository, callback) => {
  e.preventDefault();
  api("create_ignore", { name: name, repository: repository }, (data) =>
    callback(data)
  );
};

export const deleteIgnore = (repository, id, callback) => {
  api("delete_ignore", { id: id, repository: repository }, (data) =>
    callback(data)
  );
};

export const editReadme = (name, content, callback) => {
  api("edit_readme", { name: name, content: content }, (data) =>
    callback(data)
  );
};
