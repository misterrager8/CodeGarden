import webbrowser

import click

from . import config, create_app


@click.group()
def cli():
    pass


@cli.command()
@click.option("--debug", "-d", is_flag=True)
def web(debug: bool):
    """Launch web interface for CodeGarden.

    Args:
        debug (bool): Debug mode
    """
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}/")
    app.config["ENV"] = "development" if debug else "production"
    app.run(port=config.PORT, debug=debug)
