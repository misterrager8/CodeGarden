import pytest

from code_garden import config, create_app
from code_garden.models import Repository


@pytest.fixture()
def app():
    app = create_app(config)
    return app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_repository():
    repository_ = Repository("test-project")
    repository_.delete()
    repository_.init("This is just a test.")

    assert repository_.path.exists()
    assert repository_.current_branch == "master"
    assert len(repository_.log) != 0
    assert len(repository_.branches) != 0
    assert len(repository_.todos) == 0
    assert len(repository_.ignored) == 1
    assert len(Repository.all()) > 1
    assert repository_.to_dict()
    assert "This is just a test." in repository_.readme["txt"]


def test_create_app(app):
    assert app


def test_api(client):
    assert client.get("/").status_code == 404
