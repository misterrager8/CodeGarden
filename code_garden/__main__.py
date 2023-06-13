import webbrowser

import click

from . import config, create_app


@click.group()
def cli():
    pass


@cli.command()
@click.option("--debug", "-d", is_flag=True)
@click.option("--port", "-p", default="5000")
def web(debug: bool, port):
    """Launch web interface for CodeGarden.

    Args:
        debug (bool): Debug mode
    """
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{port}/")
    app.config["ENV"] = "development" if debug else "production"
    app.run(port=port, debug=debug)
