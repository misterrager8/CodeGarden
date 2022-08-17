import setuptools

setuptools.setup(
    name="GitSome",
    version="1.0.2",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["gitsome=GitSome.cli:cli"]},
)
