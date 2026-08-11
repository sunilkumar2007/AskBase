from abc import ABC, abstractmethod

class BaseSkill(ABC):
 @abstractmethod
 async def execute(self, params: dict) -> dict:
 pass
