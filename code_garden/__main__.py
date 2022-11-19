import webbrowser

import click

from code_garden import config, create_app


@click.group()
def cli():
    pass


@cli.command()
@click.option("-s", "--switch", is_flag=True)
def web(switch):
    app = create_app(config)
    if switch:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(port=config.PORT)
