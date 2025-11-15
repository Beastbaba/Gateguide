from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TranscriptionRequest(BaseModel):
    audio_data: str  # base64 encoded audio
    source_language: str = "en"
    target_language: str = "es"

class TranscriptionResponse(BaseModel):
    transcription: str
    translation: str
    language_detected: str

class TranslationRequest(BaseModel):
    text: str
    source_language: str = "auto"
    target_language: str = "es"

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str

class OCRRequest(BaseModel):
    image_data: str  # base64 encoded image
    target_language: str = "es"

class OCRResponse(BaseModel):
    extracted_text: str
    translated_text: str
    language_detected: str

class GateLocation(BaseModel):
    gate_id: str
    latitude: float
    longitude: float
    name: str
    terminal: Optional[str] = None

class Flight(BaseModel):
    id: str
    flight_number: str
    destination: str
    gate: str
    departure_time: str
    status: str  # "On Time", "Delayed", "Boarding", "Gate Changed"
    terminal: Optional[str] = None

class Notification(BaseModel):
    id: str
    type: str  # "gate_change", "delay", "boarding", "info"
    title: str
    message: str
    flight_number: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
