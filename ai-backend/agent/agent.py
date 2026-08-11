from app.agent.context import AgentContext
from app.agent.skills import SkillManager
from app.agent.prompts import PromptBuilder

class Agent:
 def __init__(self, context: AgentContext):
 self.context = context
 self.skills = SkillManager()
 self.prompts = PromptBuilder()

 async def process(self, user_input: str) -> dict:
 pass

 async def execute_skill(self, skill_name: str, params: dict) -> dict:
 pass
