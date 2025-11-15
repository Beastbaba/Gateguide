from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
import uuid
from datetime import datetime
import json
import base64
from io import BytesIO
from PIL import Image

from models import (
    TranscriptionRequest,
    TranscriptionResponse,
    TranslationRequest,
    TranslationResponse,
    OCRRequest,
    OCRResponse,
    GateLocation,
    Flight,
    Notification,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="GateGuide API", version="1.0.0")

api_router = APIRouter(prefix="/api")


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass


manager = ConnectionManager()


@api_router.get("/")
async def root():
    return {
        "message": "GateGuide API",
        "version": "1.0.0",
        "endpoints": [
            "/api/stt/transcribe",
            "/api/translate",
            "/api/ocr",
            "/api/gates",
            "/api/flights",
            "/api/notifications",
        ],
    }


#eleven labs api key integration
@api_router.post("/stt/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(request: TranscriptionRequest):

    mock_transcriptions = {
        "en": "Where is gate B14?",
        "es": "¿Dónde está la puerta B14?",
        "fr": "Où est la porte B14?",
    }
    
    transcription = mock_transcriptions.get(request.source_language, "Where is gate B14?")
    translation = mock_transcriptions.get(request.target_language, "¿Dónde está la puerta B14?")
    
    return TranscriptionResponse(
        transcription=transcription,
        translation=translation,
        language_detected=request.source_language,
    )


@api_router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):

    mock_translations = {
        "Where is gate B14?": "¿Dónde está la puerta B14?",
        "When does my flight depart?": "¿Cuándo sale mi vuelo?",
        "Where is the bathroom?": "¿Dónde está el baño?",
    }
    
    translated = mock_translations.get(request.text, f"[Translated: {request.text}]")
    
    return TranslationResponse(
        original_text=request.text,
        translated_text=translated,
        source_language=request.source_language,
        target_language=request.target_language,
    )


@api_router.post("/ocr", response_model=OCRResponse)
async def extract_text_from_image(request: OCRRequest):

    return OCRResponse(
        extracted_text="Gate B14\nDepartures\nBaggage Claim",
        translated_text="Puerta B14\nSalidas\nRecogida de Equipaje",
        language_detected="en",
    )



@api_router.get("/gates", response_model=List[GateLocation])
async def get_gates():
    gates = [
        GateLocation(
            gate_id="B14",
            latitude=28.5572,
            longitude=77.1010,
            name="Gate B14",
            terminal="Terminal 2",
        ),
        GateLocation(
            gate_id="C5",
            latitude=28.5552,
            longitude=77.0990,
            name="Gate C5",
            terminal="Terminal 2",
        ),
        GateLocation(
            gate_id="A1",
            latitude=28.5582,
            longitude=77.1020,
            name="Gate A1",
            terminal="Terminal 1",
        ),
    ]
    return gates

#flights
@api_router.get("/flights", response_model=List[Flight])
async def get_flights():
    flights = [
        Flight(
            id="1",
            flight_number="AI 202",
            destination="New York JFK",
            gate="B14",
            departure_time="14:30",
            status="On Time",
            terminal="Terminal 2",
        ),
        Flight(
            id="2",
            flight_number="BA 142",
            destination="London Heathrow",
            gate="C5",
            departure_time="16:45",
            status="Boarding",
            terminal="Terminal 2",
        ),
        Flight(
            id="3",
            flight_number="EK 505",
            destination="Dubai",
            gate="A1",
            departure_time="18:00",
            status="Delayed",
            terminal="Terminal 1",
        ),
    ]
    return flights


@api_router.get("/flights/{flight_number}", response_model=Flight)
async def get_flight(flight_number: str):
    return Flight(
        id="1",
        flight_number=flight_number,
        destination="New York JFK",
        gate="B14",
        departure_time="14:30",
        status="On Time",
        terminal="Terminal 2",
    )


# Notifications
@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications():
    """Get all notifications."""
    notifications = [
        Notification(
            id="1",
            type="info",
            title="Welcome to GateGuide",
            message="Your smart airport assistant is ready!",
            timestamp=datetime.utcnow(),
        ),
        Notification(
            id="2",
            type="gate_change",
            title="Gate Change",
            message="Flight AI 202 gate changed from B14 to C5",
            flight_number="AI 202",
            timestamp=datetime.utcnow(),
        ),
    ]
    return notifications


# WebSocket for real-time notifications
@api_router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket):
    """WebSocket endpoint for real-time notifications."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or process
            await manager.broadcast(
                {
                    "type": "info",
                    "message": f"Received: {data}",
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
