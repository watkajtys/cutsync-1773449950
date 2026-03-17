import os
from google import genai
from google.genai import types

def main():
    try:
        api_key = os.environ.get("GEMINI_API_KEY", "dummy")
        client = genai.Client(api_key=api_key)
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
