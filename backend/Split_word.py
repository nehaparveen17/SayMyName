from g2p_en import G2p
from functools import reduce
import eng_to_ipa as ipa
import pyphen

class Splitword():
    # def split_word(self,word:str):
    #     list_of_words = word.lower().split()
    #     return list_of_words

    def list_of_word(self, name:str):
        full_words = []
        lst_final_word = []
        lst_word = name.lower().split()
        g2p = G2p()
        for text in lst_word:
            out = g2p(text)
            without_digits = [reduce(lambda x, y: x+y, filter(lambda x: not x.isdigit(), s), '') for s in out]
            full_words.append(without_digits)
        for full_word in full_words:
            final_word = ''.join(full_word)
            lst_final_word.append(final_word)
        phonetic_spelling = "-".join(lst_final_word)
        return [phonetic_spelling]



    def split_syllables(self, word) -> list:
        dic = pyphen.Pyphen(lang='en_US')
        syllables = dic.inserted(word).split("-")
        # syllables = dic.inserted(word).split()
        name = " ".join(syllables)
        return name
    
    def seperating_name(self, word):
        syllable_split = self.split_syllables(word=word)
        phonetic_spelling = self.list_of_word(name=syllable_split)
        return list(phonetic_spelling)
         


    def word_split(self,word:str):

        word_with_e = False
        temp_letter = ''
        adj_letter = ""
        full_split_word = []
        
        # Define vowels and diphthongs
        vowels = 'aeiouy'
        diphthongs = ['ai', 'au', 'ay', 'ea', 'ee', 'ei', 'ey', 'oa', 'oe', 'oi', 'ou', 'oy', 'ae']

        # Define digraphs (consonant pairs that make only one sound)
        digraphs = ['ch', 'sh', 'ph', 'th', 'wh', 'gh']

        # Define exceptions for two vowels making one sound
        one_sound_exceptions = ['oa', 'oe', 'oo', 'ou', 'ei', 'ie', 'ay', 'ey']

    #     # Flag to keep track of whether we're in a diphthong
    #     in_diphthong = False

        # Remove trailing silent 'e'
        if word.endswith('e'):
            word = word[:-1]
            word_with_e = True

        length_of_word = len(word)
        index = 0

        while index < length_of_word:
                if word[index].lower() in vowels.lower():
                    try:
                        temp_letter = word[index] + word [index+1]
                        if (temp_letter.lower() in diphthongs) or (temp_letter.lower() in one_sound_exceptions):
                            adj_letter = temp_letter
                            full_split_word.append(adj_letter)
                            index+=2
                        else:
                            full_split_word.append(word[index])
                            index+=1
                    except IndexError:
                        full_split_word.append(word[index])
                        index+=1
                        #   break
                    
                else:
                    try:
                        temp_letter = word[index] + word [index+1]
                        if temp_letter.lower() in digraphs:
                            adj_letter = temp_letter
                            full_split_word.append(adj_letter)
                            index+=2
                        else:
                            full_split_word.append(word[index])
                            index+=1
                    except IndexError:
                        full_split_word.append(word[index])
                        index+=1
                        #   break

        if word_with_e is True:
            full_split_word.append('e')
            word_with_e = False
        return full_split_word

                        # letter_index = word.index(letter)
                        # current_letter = letter
                        # next_letter = word[letter_index + 1]
                        # word_check = current_letter + next_letter
                        # if word_check in diphthongs:
                        #     letter_index+2

                        #         if word_check in digraphs:
    def segmenting_word(self,word) -> list:
        vowels = 'aeiouy'
        diphthongs = ['ay' , 'ea', 'ae', 'ai', 'oi', 'oy', 'ie', 'oe', 'oa', 'ou', 'ow', 'eer', 'ear', 'are', 'ere', 'ea', 'ai', 'igh', 'ey' , 'ough', 'ee', 'oi' , 'ei', 'ue', 'aw', 'au', 'oo', 'augh', 'ui', 'ew' , 'aier', 'auer', 'oier', 'ier', 'uer']
        digraphs = ['ch', 'kn', 'th', 'ck' , 'ph', 'wh', 'gh', 'sh', 'wr', 'ng', 'qu', 'ai' , 'ay' , 'ee', 'ea', 'ie', 'ei', 'oo', 'ow', 'oo']
        one_sound = ["ai", "ea", "ee","oo", "oi","ou", "ie","ei"]
        w_split = self.word_split(word)
        pypen_word =  self.split_syllables(word=word)
        digraphs_check = False
        diphthongs_check = False
        one_sound_check = False
        print(f"w_split: {w_split}")
        print(f"pypen_word: {pypen_word[0]}")
        if pypen_word[0].lower() == word.lower():
            length_word =  len(w_split)
            index = 0
            temp = []
            segment_list = []
            if length_word % 2 == 0:
                for i in w_split:
                    first_pointer = w_split[i]
                    second_pointer = w_split[i+1]
                    consecutive_letters = first_pointer+second_pointer
                    if i in vowels:
                        temp.append(i)
                    if consecutive_letters in digraphs:
                        pass


        else:
            return pypen_word
                

                




                             
                
                   


# print(Splitword().segmenting_word(word='emmanuel'))
# print(Splitword().list_of_word('emmanuel'))