# Code Garden
![GitHub](https://img.shields.io/github/license/misterrager8/CodeGarden)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
![GitHub language count](https://img.shields.io/github/languages/count/misterrager8/CodeGarden)
![GitHub last commit](https://img.shields.io/github/last-commit/misterrager8/CodeGarden)

---
CodeGarden is an open source Python-based web and command-line app. Made to simplify your coding and development workflow and manage your Git repositories. Originally developed to be a lightweight GitHub Desktop alternative (with a few more features added.)

CodeGarden can make it easier to perform common Git operations such as cloning, committing, and pushing changes to a repository. It also allows developers to integrate Git functionality into their applications without having to interact with Git directly, which can be helpful for automating tasks and reducing errors.


### Features
- Add your local repositories just by putting it in the home directory.
- View git information about your repo, such as status, diff, branches, etc all on the dashboard.
- Manage **TODOs** (tasks) for your repo. You can also commit your changes to the repo straight from your TODO list
- Minimalist and responsive interface
- Command-line Git wrapper module that makes Git commands easier

### Usage
Clone this **[GitHub repository](https://github.com/misterrager8/CodeGarden).** Set up an `.env` with the only environment variable you need: `home_dir`. This is the directory where all your Git repositories are. Then, run the `python3 setup.py install`, then execute `garden web` command.

For the command-line interface, run the `garden` command for the help message

### Configuration
`home_dir`[Required] - home direcotry where all git repositories qwoll be stored.
`port`[Optional] - port number to launch web interface.

### Author

[C.N. Joseph (misterrager8)](https://github.com/misterrager8)

### License

MIT License
