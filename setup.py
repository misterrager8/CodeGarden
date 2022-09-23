import setuptools

setuptools.setup(
    name="CodeGarden",
    entry_points={"console_scripts": ["garden=code_garden.cli:cli"]},
)
