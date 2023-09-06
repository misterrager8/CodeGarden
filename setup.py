import setuptools

setuptools.setup(
    name="CodeGarden",
    version="2023.09.06",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["garden=code_garden.__main__:main"]},
)
