import json

from . import models
from .Provider import BaseProvider
from .typing import Any, CreateResult, Union, ChatResponse

logging = False


class ChatCompletion:
    @staticmethod
    def __json_response(response: CreateResult) -> ChatResponse:
        return (
            json.loads("".join(response))
            if response != "error"
            else ValueError("Invalid inputs")
        )

    @classmethod
    def create(
        cls,
        message: str,
        provider: type[BaseProvider],
        conversation_id: str = "",
        response_id: str = "",
        choice_id: str = "",
        **kwargs: Any,
    ) -> ChatResponse:
        result = provider.create_completion(
            message=message,
            conversation_id=conversation_id,
            response_id=response_id,
            choice_id=choice_id,
            **kwargs,
        )
        return cls.__json_response(result)

    @classmethod
    def get(
        cls,
        conversation_id: str,
        provider: type[BaseProvider],
        **kwargs: Any,
    ) -> ChatResponse:
        result = provider.get_completion(conversation_id, **kwargs)
        return cls.__json_response(result)

    @classmethod
    def delete(
        cls,
        conversation_id: str,
        provider: type[BaseProvider],
        **kwargs: Any,
    ) -> str:
        result = provider.delete_completion(conversation_id, **kwargs)
        result = "".join(result)
        return result
