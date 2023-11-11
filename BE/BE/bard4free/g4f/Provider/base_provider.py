from abc import ABC, abstractmethod

from ..typing import Any, CreateResult, AsyncGenerator, Union

import browser_cookie3
import asyncio
from time import time
import math


class BaseProvider(ABC):
    url: str
    working = False
    needs_auth = False
    supports_stream = False
    supports_gpt_35_turbo = False
    supports_gpt_4 = False

    @staticmethod
    @abstractmethod
    def create_completion(
        message: str,
        **kwargs: Any,
    ) -> CreateResult:
        raise NotImplementedError()
    
    @staticmethod
    @abstractmethod
    def get_completion(
        conversation_id: str,
        **kwargs: Any,
    ) -> CreateResult:
        raise NotImplementedError()
    
    @staticmethod
    @abstractmethod
    def delete_completion(
        conversation_id: str,
        **kwargs: Any,
    ) -> str:
        raise NotImplementedError()


    @classmethod
    @property
    def params(cls):
        params = [
            ("model", "str"),
            ("message", "list[dict[str, str]]"),
            ("stream", "bool"),
        ]
        param = ", ".join([": ".join(p) for p in params])
        return f"g4f.provider.{cls.__name__} supports: ({param})"


_cookies = {}

def get_cookies(cookie_domain: str) -> dict:
    if cookie_domain not in _cookies:
        _cookies[cookie_domain] = {}
        for cookie in browser_cookie3.chrome(domain_name=cookie_domain):
            if cookie.name.startswith("__Secure-"):
                _cookies[cookie_domain][cookie.name] = cookie.value
    return _cookies[cookie_domain]


class AsyncProvider(BaseProvider):
    @classmethod
    def create_completion(
        cls,
        message: str,
        conversation_id: str = '',
        response_id: str = '',
        choice_id: str = '',
        **kwargs: Any,
    ) -> CreateResult:
        yield asyncio.run(cls.create_async(
            message = message,
            conversation_id = conversation_id,
            response_id = response_id,
            choice_id = choice_id,
            **kwargs,
        ))

    @staticmethod
    @abstractmethod
    async def create_async(
        message: str,
        conversation_id: str,
        response_id: str,
        choice_id: str,
        **kwargs: Any,
    ) -> str:
        raise NotImplementedError()


    @classmethod
    def get_completion(
        cls,
        conversation_id: str,
        **kwargs: Any,
    ) -> CreateResult:
        yield asyncio.run(cls.get_async(
            conversation_id=conversation_id,
            **kwargs
        ))

    @staticmethod
    @abstractmethod
    async def get_async(
        conversation_id: str,
        **kwargs: Any,
    ) -> str:
        raise NotImplementedError()
    
    @classmethod
    @abstractmethod
    def delete_async(
        cls,
        conversation_id: str = '',
        **kwargs: Any,
    ) -> str:
       raise NotImplementedError()
    
    @classmethod
    def delete_completion(
        cls,
        conversation_id: str,
        **kwargs: Any,
    ) -> CreateResult:
        yield asyncio.run(cls.delete_async(
            conversation_id=conversation_id,
            **kwargs
        ))
