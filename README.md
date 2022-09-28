## Code Garden
![GitHub](https://img.shields.io/github/license/misterrager8/CodeGarden)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
![GitHub language count](https://img.shields.io/github/languages/count/misterrager8/CodeGarden)
![GitHub last commit](https://img.shields.io/github/last-commit/misterrager8/CodeGarden)

---
CodeGarden is an open source Python-based web and command-line app. Made to simplify your coding and development workflow and manage your Git repositories. 


#### Features
- Add your local repositories just by putting it in the home directory.
- Edit your repo's README.md file
- View git information about your repo, such as status, diff, branches, etc.
- Manage **TODOs** (tasks) for your repo. You can also commit your changes to the repo straight from your TODO list
- Export your TODOs to a `todo.txt` file
- Pin favorites for easy access on the navbar
- Minimalist and responsive interface
- Command-line Git wrapper module that makes Git commands easier

#### Usage
Clone this **[GitHub repository](https://github.com/misterrager8/CodeGarden).** Set up an `.env` with the only environment variable you need: `home_dir`. This is the directory where all your Git repositories are. Then, run the `python3 setup.py install`, then execute `garden web` command.

For the command-line interface, run the `garden` command for the help message:

    Usage: garden [OPTIONS] COMMAND [ARGS]...

    Options:
      --help  Show this message and exit.

    Commands:
      add-todo     Add a todo.
      branch       Git current branch.
      branches     Git branches.
      checkout     Checkout a branch.
      commit       Make a commit.
      commit-todo  Commit a todo.
      delete-todo  Delete a todo.
      edit-todo    Edit a todo.
      list-todos   List todos.
      log          Git log.
      merge        Merge a branch.
      new-branch   Create a branch.
      status       Git status.

#### Configuration
`cli_color`[Optional] - color of the output from the command-line interface.
`port`[Optional] - port number to launch web interface.
`env`[default=production] - Flask environment.
`debug`[default=0] - Debug mode (development purposes)
