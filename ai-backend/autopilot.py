from app.autopilot.workflow import WorkflowEngine
from app.autopilot.executor import Executor

class AutoPilot:
 def __init__(self):
 self.workflow = WorkflowEngine()
 self.executor = Executor()

 async def run(self, goal: str, context: dict) -> dict:
 pass
