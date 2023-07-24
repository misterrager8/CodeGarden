import pathlib

import click


class Readme:
    def __init__(
        self,
        name,
        description,
        features=None,
        installation=None,
        usage=None,
        authors=None,
        contribute=None,
        license=None,
    ):
        self.name = name
        self.description = description
        self.features = (
            "\n".join([f"- {i.strip()}" for i in features.split(",")])
            if features
            else ""
        )
        self.installation = f"## Installation\n{installation}\n" if installation else ""
        self.usage = f"## Usage\n{usage}\n" if usage else ""
        self.authors = f"## Authors\n{authors}\n" if authors else ""
        self.contribute = f"## Contribute\n{contribute}\n" if contribute else ""
        self.license = (
            f"## License\n{name} is under the {license} license. See LICENSE.md for details.\n"
            if license
            else ""
        )

    def write(self, path=None):
        path_ = (pathlib.Path.cwd() if not path else path) / "README.md"
        template_ = """# {name}

{description}

{features}

{installation}

{usage}

{authors}

{contribute}

{license}

""".format(
            name=self.name,
            description=self.description,
            features=self.features,
            installation=self.installation,
            usage=self.usage,
            authors=self.authors,
            contribute=self.contribute,
            license=self.license,
        )
        open(path_, "w").write(template_)


@click.group()
def readme_cli():
    pass


@readme_cli.command()
@click.argument("name")
@click.argument("description")
def new_readme(name, description):
    """Generate a new README in the current directory."""
    features = click.prompt("features", default="")
    installation = click.prompt("installation", default="")
    usage = click.prompt("usage", default="")
    authors = click.prompt("authors", default="")
    contribute = click.prompt("contribute", default="")
    license = click.prompt("license", default="MIT", type=click.Choice(["MIT", "GNU"]))

    Readme(
        name,
        description,
        features=features,
        installation=installation,
        usage=usage,
        authors=authors,
        contribute=contribute,
        license=license,
    ).write()
