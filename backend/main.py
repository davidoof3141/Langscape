from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize FastAPI app
app = FastAPI(debug=True)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    organization='org-3eaZRIv4Lal1ZR6bvlHiHM06',
    project='proj_pdV3gUVLbjwkVNI9x77NJgu5',)

# Request body model


class ChatRequest(BaseModel):
    message: str


# Conversation history to maintain context
conversation_history = []

# Maximum number of messages to keep in context
MAX_CONTEXT_MESSAGES = 5


@app.post("/chat")
async def chat_with_spanish_tutor(request: ChatRequest):
    try:
        # Add user message to conversation history
        conversation_history.append({
            "role": "user",
            "content": request.message
        })

        # Truncate conversation history if it gets too long
        if len(conversation_history) > MAX_CONTEXT_MESSAGES:
            conversation_history.pop(0)

        # Prepare messages for OpenAI API
        messages = [
            {
                "role": "system",
                "content": """You are a friendly Spanish language tutor. 
                Your goal is to help the user learn and practice Spanish. 
                Respond in a way that:
                1. Provides clear, educational responses
                2. Corrects grammar and language usage
                3. Offers translations and explanations
                4. Maintains an encouraging and patient tone
                5. Adapts to the user's current Spanish language level
                6. Include occasional cultural insights about Spanish-speaking countries"""
            }
        ] + conversation_history

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )

        # Extract AI's response
        ai_message = response.choices[0].message.content

        # Add AI message to conversation history
        conversation_history.append({
            "role": "assistant",
            "content": ai_message
        })
        print(ai_message)

        return {"response": ai_message}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

# Run the app with:
# uvicorn main:app --reload
