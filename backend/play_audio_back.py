
from pydub import AudioSegment
from pydub.playback import play
 
def play_audio(file_name):
    # for playing wav file
    song = AudioSegment.from_wav(file_name)
    print('playing sound using  pydub')
    play(song)

# import os
 
# # play sound
# file = "testing"
# print('playing sound using native player')
# os.startfile(file)