import setuptools

setuptools.setup(
    name="CodeGarden",
    version="2.0.1",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["garden=code_garden.cli:cli"]},
)
