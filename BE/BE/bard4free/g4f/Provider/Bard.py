import json
import random
import re

from aiohttp import ClientSession
import asyncio

from ..typing import Any, CreateResult
from .base_provider import AsyncProvider, get_cookies


class Bard(AsyncProvider):        
    needs_auth = False
    working = True

    @staticmethod
    async def request_async(
        freq: str,
        intents: str,
        **kwargs: Any,
    ) -> str:
        url = "https://bard.google.com"
        cookies = get_cookies(".google.com")

        headers = {
            'authority': 'bard.google.com',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'origin': 'https://bard.google.com',
            'referer': 'https://bard.google.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        }

        async with ClientSession(
            headers=headers,
            cookies=cookies
        ) as session:
            async with session.get(url) as response:
                text = await response.text()
            
            match = re.search(r'SNlM0e\":\"(.*?)\"', text)
            if match:
                snlm0e = match.group(1)

            params = {
                'bl': 'boq_assistant-bard-web-server_20230326.21_p0',
                '_reqid': random.randint(1111, 9999),
                'rt': 'c'
            }

            data = {
                'at': snlm0e,
                'f.req': freq
            }

            async with session.post(
                f'{url}/_/BardChatUi/data/{intents}',
                data=data,
                params=params,
            ) as response:
                return await response.text()
            

    @classmethod
    async def create_async(
        cls,
        message: str,
        conversation_id: str = '',
        response_id: str = '',
        choice_id: str = '',
        **kwargs: Any,
    ) -> str:
        freq = json.dumps([None, json.dumps([[message], None, [conversation_id, response_id, choice_id]])])

        intents = '.'.join([
            'assistant',
            'lamda',
            'BardFrontendService',
            
        ]) + '/StreamGenerate'

        data = await cls.request_async(
            freq = freq,
            intents = intents,
            **kwargs,
        )

        try:
            answer = {}

            # Obtain response_id, choice_id, log
            response = json.loads(data.splitlines()[3])[0][2]
            chat = json.loads(response)

            answer['conversation_id'], answer['response_id'] = chat[1]
            answer['choice_id'] = chat[4][0][0]
            answer['log'] = chat[4][0][1][0]

            # Obtain title if exists
            if not conversation_id:
                response = json.loads(data.splitlines()[5])[0][2]
                answer['title'] = json.loads(response)[10][0]

            return json.dumps(answer)
        except:
            return 'error'


    @classmethod
    async def get_async(
        cls,
        conversation_id: str,
        **kwargs: Any,
    ) -> str:
        freq = json.dumps([[['hNvQHb', json.dumps([conversation_id, 10]), None, "generic"]]])

        intents = 'batchexecute'

        data = await cls.request_async(
            freq = freq,
            intents = intents,
            **kwargs,
        )

        try:
            data = json.loads(data.splitlines()[3])
            chats = json.loads(data[0][2])[0]
        except:
            return 'error'

        conversation = []

        for chat in chats:     
            try:
                response_id = chat[1][1]
            except:
                response_id = chat[0][1]       
            title : str = chat[2][0][0]
            log : str = chat[3][0][0][1][0]

            conversation.append({
                'response_id': response_id,
                'title': title,
                'log': log
                })

        return json.dumps(conversation)
    
    @classmethod
    async def delete_async(
        cls,
        conversation_id: str,
        **kwargs: Any,
    ) -> str:
        freq = json.dumps([[['GzXR5e', json.dumps([conversation_id]), None, 'generic']]])

        intents = 'batchexecute'

        return await cls.request_async(
            freq = freq,
            intents = intents,
            **kwargs,
        )


    @classmethod
    @property
    def params(cls):
        params = [
            ("model", "str"),
            ("message", "str"),
            ("stream", "bool"),
            ("proxy", "str"),
        ]
        param = ", ".join([": ".join(p) for p in params])
        return f"g4f.provider.{cls.__name__} supports: ({param})"
