from typing import Any, AsyncGenerator, Generator, NewType, Tuple, TypedDict, Union, Optional

SHA256 = NewType("sha_256_hash", str)
CreateResult = Generator[str, None, None]

ChatResponse = TypedDict(
    "ChatResponse",
    {
        "conversation_id": str,
        "response_id": str,
        "choice_id": str,
        "title": Optional[str],
        "log": str,
    },
)


__all__ = [
    "Any",
    "AsyncGenerator",
    "Generator",
    "Tuple",
    "TypedDict",
    "SHA256",
    "CreateResult",
    "ChatResponse",
]
