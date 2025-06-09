import base64
from google.cloud import speech_v1p1beta1 as speech # Using v1p1beta1 for better language support if available
from google.cloud import texttospeech

@https_fn.on_request()
def transcribeSetswanaAudio(req: https_fn.Request) -> https_fn.Response:
    """
    Firebase Cloud Function to transcribe Setswana audio using Google Cloud Speech-to-Text.
    Receives audio as a base64 string.
    """
    if req.method != "POST":
        return https_fn.Response("Only POST requests are accepted.", status=405)

    try:
        request_data = req.get_json()
        audio_base64 = request_data.get("audio", "")
        # Ensure proper audio encoding and format (e.g., LINEAR16, sampleRateHertz)
        audio_encoding = request_data.get("encoding", "LINEAR16")
        sample_rate_hertz = request_data.get("sampleRateHertz", 16000)

        if not audio_base64:
            return https_fn.Response("Missing 'audio' in request body.", status=400)

        # Decode base64 audio
        audio_content = base64.b64decode(audio_base64)

        client = speech.SpeechClient()

        audio = speech.RecognitionAudio(content=audio_content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16, # Or your chosen encoding
            sample_rate_hertz=sample_rate_hertz,
            language_code="tn-ZA", # Setswana (South Africa) - Check for exact code
            # Enable for better short phrase recognition, but increases cost
            # enable_automatic_punctuation=True,
            # model="default", # Or "enhanced" for better accuracy (higher cost)
        )

        # Perform the transcription
        operation = client.long_running_recognize(config=config, audio=audio)
        # For shorter audio, you can use `recognize` instead of `long_running_recognize`
        # response = client.recognize(config=config, audio=audio)

        print("Waiting for transcription to complete...")
        response = operation.result(timeout=300) # Adjust timeout as needed

        transcribed_text = ""
        for result in response.results:
            # The first alternative is generally the most accurate
            transcribed_text += result.alternatives[0].transcript

        return https_fn.Response({"transcribedText": transcribed_text}, status=200)

    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return https_fn.Response(f"Internal Server Error during STT: {e}", status=500)

@https_fn.on_request()
def synthesizeSetswanaSpeech(req: https_fn.Request) -> https_fn.Response:
    """
    Firebase Cloud Function to synthesize Setswana text into speech using Google Cloud Text-to-Speech.
    Returns audio as a base64 string.
    """
    if req.method != "POST":
        return https_fn.Response("Only POST requests are accepted.", status=405)

    try:
        request_data = req.get_json()
        text_to_synthesize = request_data.get("text", "")

        if not text_to_synthesize:
            return https_fn.Response("Missing 'text' in request body.", status=400)

        client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=text_to_synthesize)

        # Select the language code and the voice (Setswana specific voice if available)
        # You will need to check Google Cloud TTS documentation for available Setswana voices.
        # Example: 'tn-ZA-Wavenet-A' (Wavenet voices are often more natural)
        # If no Setswana specific voice, use a generic one or a similar language.
        voice = texttospeech.VoiceSelectionParams(
            language_code="tn-ZA", # Setswana (South Africa) - Verify this code
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL # Or MALE/FEMALE
        )

        # Select the type of audio file you want returned
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.LINEAR16, # Or MP3, OGG_OPUS
            sample_rate_hertz=16000 # Ensure consistency with STT or playback requirements
        )

        # Perform the text-to-speech request
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        # The audio content is in base64. Encode it to a string for JSON response.
        audio_base64 = base64.b64encode(response.audio_content).decode("utf-8")

        return https_fn.Response({"audioBase64": audio_base64}, status=200)

    except Exception as e:
        print(f"Error synthesizing speech: {e}")
        return https_fn.Response(f"Internal Server Error during TTS: {e}", status=500)
