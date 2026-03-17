import sys
import os
import json
from unittest.mock import MagicMock

# Fully mock the google and google.genai namespaces before importing extractor_agent
mock_google = MagicMock()
mock_genai = MagicMock()
mock_types = MagicMock()

mock_google.genai = mock_genai
mock_genai.types = mock_types

sys.modules['google'] = mock_google
sys.modules['google.genai'] = mock_genai
sys.modules['google.genai.types'] = mock_types

sys.path.insert(0, os.path.abspath('backend'))
import extractor_agent
print("Successfully imported extractor_agent")
