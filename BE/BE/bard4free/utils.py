import re

from .g4f.typing import ChatResponse
from .serializers import ResponseSerializer


def idCheck(*args):
    for arg in args:
        if not arg or not re.match(r"(c|r|rc)_[a-z0-9]{12,18}", arg):
            return False
    return True


def saveResponse(conversation_key, message: str, chatData: ChatResponse):
    # Prepare the data to be saved
    data = {
        **chatData,
        "message": message,
    }

    serializer = ResponseSerializer(data=data)
    if serializer.is_valid():
        # Saved by passing the conversation instance to the save()
        serializer.save(conversation=conversation_key)
        return True
    return False
