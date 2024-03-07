import requests
from openai import OpenAI

client = OpenAI()
# import re

# def get_name_stress(name):
#     # Rule 1: Common Prefixes
#     common_prefix_stress_rules = [
#         (r'^Mc', 1),   # Prefix "Mc", stress on the second syllable
#         # Add more common prefix rules as needed
#     ]

#     for prefix_pattern, stress_position in common_prefix_stress_rules:
#         if re.search(prefix_pattern, name):
#             return stress_position

#     # Rule 2: Compound Names
#     if ' ' in name:
#         return name.index(' ') + 1

#     # Rule 3: Two-Syllable Names
#     if len(name.split()) == 2:
#         return 1  # Stress on the first syllable

#     return None  # No matching rule

# # Test the rules
# name = "supriya"
# stress = get_name_stress(name)
# if stress is None:
#     stress = get_name_stress(name)

# print(f"The name '{name}' has stress on syllable {stress}")




# import speech_recognition as sr

# def transcribe_audio(audio_file):
#     recognizer = sr.Recognizer()

#     with sr.AudioFile(audio_file) as source:
#         audio_data = recognizer.record(source)

#     try:
#         # Using the Google Web Speech API (requires an internet connection)
#         text = recognizer.recognize_google(audio_data)
#         print("Transcript: {}".format(text))
#     except sr.UnknownValueError:
#         print("Google Web Speech API could not understand the audio")
#     except sr.RequestError as e:
#         print("Could not request results from Google Web Speech API; {0}".format(e))

# if __name__ == "__main__":
#     audio_file_path = "C:\\Users\\minat\\OneDrive\\Desktop\\backend\\supriya nair2004930417.wav"
#     transcribe_audio(audio_file_path)

# import wave

# def convert_to_pcm_wav(input_file, output_file):
#     with wave.open(input_file, 'rb') as wav_file:
#         # Get the parameters of the input WAV file
#         params = wav_file.getparams()

#         # Set parameters for PCM WAV (16-bit PCM, 1 channel, 44100 Hz)
#         pcm_params = (1, 2, 44100, params.nframes, 'NONE', 'not compressed')

#         # Create a new WAV file for writing with PCM parameters
#         with wave.open(output_file, 'wb') as pcm_wav_file:
#             pcm_wav_file.setparams(pcm_params)

#             # Read and write frames from the input to output
#             pcm_wav_file.writeframes(wav_file.readframes(params.nframes))

# if __name__ == "__main__":
#     input_file_path = "C:\\Users\\minat\\OneDrive\\Desktop\\backend\\abhinav nair.mp3"
#     output_file_path = "C:\\Users\\minat\\OneDrive\\Desktop\\backend\\abhinav nair_pcm.wav"
#     convert_to_pcm_wav(input_file_path, output_file_path)

# from pydub import AudioSegment
# audio = AudioSegment.from_mp3("abhinav nair.mp3")
# audio.export("output.wav", format="wav")
# with open(input_file_path, 'rb') as f:
#     print(f.read(12))
# import os
# from pydub import AudioSegment

# def convert_to_pcm_wav(input_file, output_file):
#     # Load the WAV file
#     audio = AudioSegment.from_wav(input_file)

#     # Convert to PCM format
#     audio = audio.set_sample_width(2)  # Set sample width to 16 bits (2 bytes)
#     audio = audio.set_frame_rate(44100)  # Set the frame rate to 44.1 kHz (common sample rate)
    
#     # Export as PCM WAV
#     audio.export(output_file, format="wav")

# # if __name__ == "__main__":
# input_file_path = "supriya nair2004930417.mp3"
# if os.path.exists(input_file_path):
#     print("Exists")
# output_file_path = "supriya nair2004930417_pcm.wav"
# convert_to_pcm_wav(input_file_path, output_file_path)

# import nltk

# # Download the CMU Pronouncing Dictionary (if not already downloaded)
# nltk.download('cmudict')

# # Function to convert a name to syllables
# def name_to_syllables(name):
#     # Convert the name to lowercase since the CMU Pronouncing Dictionary is in lowercase
#     name = name.lower()
    
#     # Get the pronunciation from the CMU Pronouncing Dictionary
#     pronunciation = nltk.corpus.cmudict.dict().get(name)
    
#     # If pronunciation is found, count syllables and format with hyphens
#     if pronunciation:
#         syllables = [len(list(y for y in x if y[-1].isdigit())) for x in pronunciation]
#         syllables_with_hyphens = "-".join(map(str, syllables))
#         return syllables_with_hyphens, pronunciation
    
#     # If the name is not found in the dictionary, return None
#     return None

# # Example usage
# name = "VIHJHIY"
# result = name_to_syllables(name)
# if result:
#     print(f"The syllables for {name} are: {result}")
# else:
#     print(f"Syllables for {name} not found.")


# import pronouncing

# def name_to_syllables(name):
#     # Get a list of possible pronunciations for the name
#     pronunciations = pronouncing.phones_for_word(name)
#     print(pronunciations)
    
#     # If there are multiple pronunciations, choose the first one
#     if pronunciations:
#         pronunciation = pronunciations[0]
        
#         # Convert the pronunciation to syllables
#         syllables = pronouncing.syllable_count(pronunciation)
        
#         # Join syllables with hyphens
#         syllables_with_hyphens = "-".join(pronouncing.split())
        
#         return syllables_with_hyphens

#     # If the name is not found in the dictionary, return None
#     return None

# # Example usage
# name = "VIHJHIY"
# result = name_to_syllables(name)
# if result:
#     print(f"The syllables for {name} are: {result}")
# else:
#     print(f"Syllables for {name} not found.")
