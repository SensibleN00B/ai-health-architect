import re
from typing import Any, cast, Literal

from google import genai

from app.core.ai_base import AIProvider
from app.core.ai_types import (
    ClassificationResult,
    FoodAnalysisResult,
    HealthAnalysisResult,
    WorkoutAnalysisResult,
)
from app.core.config import settings


class GeminiAI(AIProvider):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured")
        
        self.client: Any = genai.Client(api_key=settings.GEMINI_API_KEY.get_secret_value())
        self.model_name = "gemini-2.0-flash-exp"
    
    async def classify_photo(self, image_bytes: bytes) -> ClassificationResult:
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
        
        response_text = response.text or ""
        return self._parse_classification_response(response_text)
    
    async def analyze_food_image(self, image_bytes: bytes) -> FoodAnalysisResult:
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
        
        response_text = response.text or ""
        return self._parse_food_response(response_text)
    
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
        
        return response.text or ""
    
    def _parse_classification_response(self, response_text: str) -> ClassificationResult:
        """Parse classification response"""
        result: ClassificationResult = {
            "type": "other",
            "confidence": "low",
            "reasoning": ""
        }
        
        for line in response_text.strip().split("\n"):
            line = line.strip()
            if line.startswith("Type:"):
                type_value = line.replace("Type:", "").strip().lower()
                if type_value in ["food", "workout", "health", "other"]:
                    result["type"] = cast(
                        Literal["food", "workout", "health", "other"],
                        type_value,
                    )
            elif line.startswith("Confidence:"):
                conf_value = line.replace("Confidence:", "").strip().lower()
                if conf_value in ["high", "medium", "low"]:
                    result["confidence"] = cast(
                        Literal["high", "medium", "low"],
                        conf_value,
                    )
            elif line.startswith("Reasoning:"):
                result["reasoning"] = line.replace("Reasoning:", "").strip()
        
        return result
    
    def _parse_food_response(self, response_text: str) -> FoodAnalysisResult:
        """Parse Gemini response into structured data"""
        result: FoodAnalysisResult = {
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
    
    async def analyze_workout_image(self, image_bytes: bytes) -> WorkoutAnalysisResult:
        prompt = """
        Analyze this workout-related image:
        1. Activity type (running, cycling, gym, yoga, etc.)
        2. Duration (in minutes)
        3. Distance (in km)
        4. Calories burned
        5. Other metrics (pace, heart rate, etc.)
        
        Return ONLY in this exact format:
        Activity: [type]
        Duration: [minutes (integer)]
        Distance: [km (float)]
        Calories: [number (float)]
        Metrics: [json dict of other data]
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[
                prompt,
                {"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}}
            ]
        )
        
        response_text = response.text or ""
        return self._parse_workout_response(response_text)

    async def analyze_health_image(self, image_bytes: bytes) -> HealthAnalysisResult:
        prompt = """
        Analyze this health/progress image:
        1. Category (weight, body measurements, progress photo, etc.)
        2. Extract any visible numbers/metrics
        3. Provide description
        
        Return ONLY in this exact format:
        Category: [type]
        Data: [json dict of extracted numbers]
        Description: [brief summary]
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[
                prompt,
                {"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}}
            ]
        )
        
        response_text = response.text or ""
        return self._parse_health_response(response_text)

    def _parse_workout_response(self, response_text: str) -> WorkoutAnalysisResult:
        result: WorkoutAnalysisResult = {
            "activity": "unknown",
            "duration_minutes": 0,
            "distance_km": 0.0,
            "calories": 0.0,
            "metrics": {}
        }
        
        lines = response_text.strip().split("\n")
        for line in lines:
            line = line.strip()
            if line.startswith("Activity:"):
                result["activity"] = line.replace("Activity:", "").strip()
            elif line.startswith("Duration:"):
                try:
                    nums = re.findall(r'\d+', line)
                    if nums: result["duration_minutes"] = int(nums[0])
                except: pass
            elif line.startswith("Distance:"):
                try:
                    nums = re.findall(r'\d+\.?\d*', line)
                    if nums: result["distance_km"] = float(nums[0])
                except: pass
            elif line.startswith("Calories:"):
                try:
                    nums = re.findall(r'\d+\.?\d*', line)
                    if nums: result["calories"] = float(nums[0])
                except: pass
            elif line.startswith("Metrics:"):
                 try:
                     metrics_str = line.replace("Metrics:", "").strip()
                     if metrics_str.startswith("{") and metrics_str.endswith("}"):
                         import json
                         result["metrics"].update(json.loads(metrics_str))
                 except: pass
                 
        if "pace" in response_text.lower() and "pace" not in result["metrics"]:
            pace_match = re.search(r'pace[\"\'\s:]+([\d:min/km]+)', response_text, re.IGNORECASE)
            if pace_match:
                 result["metrics"]["pace"] = pace_match.group(1).strip('"\'')
        
        return result

    def _parse_health_response(self, response_text: str) -> HealthAnalysisResult:
        result: HealthAnalysisResult = {
            "category": "unknown",
            "data": {},
            "description": ""
        }
        
        lines = response_text.strip().split("\n")
        for line in lines:
            line = line.strip()
            if line.startswith("Category:"):
                result["category"] = line.replace("Category:", "").strip()
            elif line.startswith("Description:"):
                result["description"] = line.replace("Description:", "").strip()
                
        if "weight" in response_text.lower():
             weight_match = re.search(r'weight[:\s]+([\d.]+)', response_text, re.IGNORECASE)
             if weight_match:
                 result["data"]["weight"] = float(weight_match.group(1))

        return result
