# backend

A project created with FastAPI CLI.

## Quick Start

### Running with docker

```bash
docker compose up -d
```

### Start the development server

```bash
uv run fastapi dev
```

Visit http://localhost:8000

View API docs at http://localhost:8000/docs

### Deploy to FastAPI Cloud

> FastAPI Cloud is currently in private beta. Join the waitlist at https://fastapicloud.com

```bash
uv run fastapi login
uv run fastapi deploy
```

## Contributing

### Pre-commit formatting

For changes made in the backend, a pre-commit hook is triggered that automatically formats files using the linter/formatter [ruff](https://github.com/astral-sh/ruff). The hook is defined in [.pre-commit-config.yaml](../.pre-commit-config.yaml) in the project root.

### Testing

The backend has a suite of unit and integration tests that have fairly good coverage of expected interations. Tests can be ran with `uv run pytest`.

## Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [FastAPI Cloud](https://fastapicloud.com)
