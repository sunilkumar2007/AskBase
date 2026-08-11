from app.agent.context import AgentContext

PROMPTS = {
 "default": "You are AskBase, a data analytics assistant.",
 "sql_generation": "Generate SQL for the following question:",
 "data_explanation": "Explain the following data in plain English:",
 "chart_recommendation": "Recommend a chart type for this data:",
}

class PromptBuilder:
 def __init__(self):
 self.prompts = PROMPTS

 def build(self, template_name: str, **kwargs) -> str:
 pass
