## Project Manager

I wanted an easy way to easily manage local coding projects on my desktop, so I made my own app to do this. It uses Flask to locally manage your projects and all the info is stored in a MySQL database. It lets you see at a glance all your projects and the todos (tasks) assigned to them.

## Usage

Set up an `.env` with the only environment variable you need:

`db_url` - the url for the MySQL db needed

Then, run the `flask run` command.