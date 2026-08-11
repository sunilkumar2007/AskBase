from app.agent.context import AgentContext

class ContextManager:
 def __init__(self):
 self.contexts: dict = {}

 def create_context(self, session_id: str) -> AgentContext:
 pass

 def get_context(self, session_id: str) -> AgentContext | None:
 pass

 def update_context(self, session_id: str, data: dict):
 pass
