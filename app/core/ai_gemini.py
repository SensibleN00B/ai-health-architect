from google import genai
from app.core.ai_base import AIProvider
from app.core.config import settings
from typing import Dict
import re


class GeminiAI(AIProvider):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured")
        
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY.get_secret_value())
        self.model_name = "gemini-2.0-flash-exp"
    
    async def classify_photo(self, image_bytes: bytes) -> Dict:
        prompt = """
        Classify this image into ONE of these categories:
        1. FOOD - any meal, snack, beverage, or food item
        2. WORKOUT - workout results, exercise screenshots (from apps like Strava, Nike Run Club, etc), gym equipment, exercise demonstration
        3. HEALTH - body measurements, progress photos, weight scale, health metrics
        4. OTHER - anything else
        
        Return ONLY in this exact format:
        Type: [FOOD/WORKOUT/HEALTH/OTHER]
        Confidence: [HIGH/MEDIUM/LOW]
        Reasoning: [brief explanation]
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[
                prompt,
                {"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}}
            ]
        )
        
        return self._parse_classification_response(response.text)
    
    async def analyze_food_image(self, image_bytes: bytes) -> Dict:
        prompt = """
        Analyze this food image and provide:
        1. Description of the food items
        2. Estimated total calories
        3. Macronutrients breakdown (protein, carbs, fat in grams)
        
        Return ONLY in this exact format (no extra text):
        Description: [food description]
        Calories: [number]
        Protein: [grams]
        Carbs: [grams]
        Fat: [grams]
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[
                prompt,
                {"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}}
            ]
        )
        
        return self._parse_food_response(response.text)
    
    async def chat(self, user_message: str, context: str | None = None) -> str:
        system_instruction = """
        You are a professional fitness and nutrition advisor.
        Provide helpful, evidence-based advice about health, nutrition, and fitness.
        Be encouraging and supportive. Keep responses concise (2-3 sentences).
        """
        
        full_prompt = user_message
        if context:
            full_prompt = f"User context: {context}\n\n{user_message}"
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=full_prompt,
            config={
                "system_instruction": system_instruction
            }
        )
        
        return response.text
    
    def _parse_classification_response(self, response_text: str) -> Dict:
        """Parse classification response"""
        result = {
            "type": "other",
            "confidence": "low",
            "reasoning": ""
        }
        
        for line in response_text.strip().split("\n"):
            line = line.strip()
            if line.startswith("Type:"):
                type_value = line.replace("Type:", "").strip().lower()
                if type_value in ["food", "workout", "health", "other"]:
                    result["type"] = type_value
            elif line.startswith("Confidence:"):
                conf_value = line.replace("Confidence:", "").strip().lower()
                if conf_value in ["high", "medium", "low"]:
                    result["confidence"] = conf_value
            elif line.startswith("Reasoning:"):
                result["reasoning"] = line.replace("Reasoning:", "").strip()
        
        return result
    
    def _parse_food_response(self, response_text: str) -> Dict:
        """Parse Gemini response into structured data"""
        result = {
            "description": "",
            "calories": 0.0,
            "macros": {"protein": 0, "carbs": 0, "fat": 0}
        }
        
        for line in response_text.strip().split("\n"):
            line = line.strip()
            if line.startswith("Description:"):
                result["description"] = line.replace("Description:", "").strip()
            elif line.startswith("Calories:"):
                try:
                    cal_match = re.search(r'\d+\.?\d*', line)
                    if cal_match:
                        result["calories"] = float(cal_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Protein:"):
                try:
                    prot_match = re.search(r'\d+', line)
                    if prot_match:
                        result["macros"]["protein"] = int(prot_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Carbs:"):
                try:
                    carb_match = re.search(r'\d+', line)
                    if carb_match:
                        result["macros"]["carbs"] = int(carb_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Fat:"):
                try:
                    fat_match = re.search(r'\d+', line)
                    if fat_match:
                        result["macros"]["fat"] = int(fat_match.group())
                except (ValueError, AttributeError):
                    pass
        
        return result
