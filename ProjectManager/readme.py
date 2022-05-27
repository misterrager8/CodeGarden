# readme should contain:
#
# - name
# - one-liner description of the project
# - features
# - usage (if necessary)
# - contribution guidelines
# - tags
#
# calculate completion based on how many of these things are present.
#
# return either md file or copyable text.
import pyperclip
import click


class Readme:
    def __init__(
        self,
        name: str,
        one_liner: str,
        features: list = [],
        usage: str = None,
        contrib: str = None,
        tags: list = [],
    ):
        self.name = name
        self.one_liner = one_liner
        self.features = features
        self.usage = usage
        self.contrib = contrib
        self.tags = tags

    def format_features(self):
        """Format features list for README"""
        return "\n".join(["- %s" % i for i in self.features])

    def format_tags(self):
        """Format tags list for README"""
        return ", ".join(self.tags)

    def to_file(self):
        """Write contents of README to an .md file"""
        with open("README.md", "w") as f:
            f.write("### %s\n\n" % self.name)
            f.write("%s\n\n" % self.one_liner)
            if self.features:
                f.write("##### Features\n%s\n\n" % self.format_features())
            if self.usage:
                f.write("##### Usage\n%s\n\n" % self.usage)
            if self.contrib:
                f.write("##### Contributing\n%s\n\n" % self.contrib)
            if self.tags:
                f.write("##### Tags\n%s\n\n" % self.format_tags())
        click.secho("README.md generated.", fg="green")

    def to_string(self):
        """Return contents of README to a string"""
        f = []
        f.append("### %s\n\n" % self.name)
        f.append("%s\n\n" % self.one_liner)
        if self.features:
            f.append("##### Features\n%s\n\n" % self.format_features())
        if self.usage:
            f.append("##### Usage\n%s\n\n" % self.usage)
        if self.contrib:
            f.append("##### Contributing\n%s\n\n" % self.contrib)
        if self.tags:
            f.append("##### Tags\n%s\n\n" % self.format_tags())

        return "".join(f)

    def to_clipboard(self):
        """Copy contents of README to clipboard"""
        print(self.to_string())
        pyperclip.copy(self.to_string())
        click.secho("copied to clipboard.", fg="green")

    def get_progress(self):
        """Calculates completion of a README based on how much info is provided"""
        _ = 2
        if self.features:
            _ += 1
        if self.usage:
            _ += 1
        if self.contrib:
            _ += 1
        if self.tags:
            _ += 1
        return (_ / 6) * 100
