# import speech_recognition as sr

# def transcribe_audio(audio_filename):

#     # Initialize the recognizer
#     recognizer = sr.Recognizer()

# # Specify the audio file you want to convert to text
#     audio_file = audio_filename  # Replace with your audio file path

#     # Load the audio file
#     with sr.AudioFile(audio_file) as source:
#         # Adjust for ambient noise, if necessary
#         recognizer.adjust_for_ambient_noise(source)
        
#         try:
#             # Perform speech recognition on the audio
#             audio_data = recognizer.record(source)
#             text = recognizer.recognize_google(audio_data)  # You can choose other recognition engines as well
#             print("Transcribed Text:")
#             print(text)
#             return text
#         except sr.UnknownValueError:
#             print("Google Speech Recognition could not understand audio.")
#         except sr.RequestError as e:
#             print(f"Could not request results from Google Speech Recognition service; {e}")