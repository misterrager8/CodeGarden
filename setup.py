import setuptools

setuptools.setup(
    name="GitSome", entry_points={"console_scripts": ["gitsome=GitSome.cli:cli"]}
)
