import setuptools

setuptools.setup(
    name="CodeGarden",
    version="2026.01.05",
    py_modules=["code_garden"],
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["garden=code_garden.__main__:main"]},
)
