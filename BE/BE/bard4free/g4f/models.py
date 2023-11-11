from dataclasses import dataclass

from .Provider import Bard, BaseProvider


@dataclass
class Model:
    name: str
    base_provider: str
    best_provider: type[BaseProvider]

# Bard
palm = Model(
    name="palm",
    base_provider="google",
    best_provider=Bard,
)


class ModelUtils:
    convert: dict[str, Model] = {
        # Bard
        "palm2": palm,
        "palm": palm,
        "google": palm,
        "google-bard": palm,
        "google-palm": palm,
        "bard": palm,
    }
