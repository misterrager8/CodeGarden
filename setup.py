import setuptools

setuptools.setup(
    name="CodeGarden",
    version="2.7.5",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["garden=code_garden.__main__:cli"]},
)
