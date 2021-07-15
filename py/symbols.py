# makes a markov model from group of files

import os
import sys
import re
import pprint
        
DIR = "/home/source3/code/lab/corpus/"

EXCLUSION_LIST = ["-","#",""]

def create_symbol(line, file_name = None):
    sym_map = { "line":line, "symbols":{}}
    if file_name:
        sym_map["file_name"] = file_name

    curly = re.compile("\{.+?\}")
    curvy = re.compile("\(.+?\)")
    ## remove curly
    curlies = curly.findall(line)
    curvies = curvy.findall(line)
    
    count = 0
    for c in curlies:
        line = line.replace(c, "{%d} " % (count),1)
        sym_map["symbols"]["{%d}" % count] = c[1:-1].split("|")
        count += 1

    for c in curvies:
        line = line.replace(c,"{%d}" % count,1)
        sym_map["symbols"]["{%d}" % count] =["", c[1:-1]]
        count += 1

    sym_map["line"] = line.split(" ")

    return sym_map

def get_symbols(folder):
    vocab = {}
    model = {}
    curr_section = ""
    symbols = []
    for file_name,file_text in  get_lines(folder):
        for l in file_text:
            l = l.strip()
            if (l.startswith("/")):
                curr_section = l
                continue
            elif len(l)==0:
                continue
            yield create_symbol(l, file_name = file_name)


def symbol_text(sym, accum,prefix = [], word_len = 0):
    b4 = list()
    b4.extend(prefix)
    words = sym["line"]
    word_len = max(word_len, len(words))

    for i,word in enumerate(words):
        if word.startswith("{"):
            alts = sym["symbols"][word]
            
            for s in alts :
                sym2 = {}
                sym2["line"] = [s] 
                sym2["line"].extend(  sym["line"][i+1:] )
                sym2["symbols"] = sym["symbols"]
                symbol_text(sym2, accum, prefix = b4, word_len= word_len)
        else:
            if word not in EXCLUSION_LIST:
                b4.append(word)

    if len(b4) == word_len:
        accum.append(b4)

def get_lines(folder):
    regex = re.compile("[0-9]+\.txt$")
    fyls = os.listdir(folder)
    for f in fyls:
        if regex.match(f) == None:
            continue
        f = os.path.join(DIR,f)
        yield [f,open(f,encoding="utf8",mode="r").readlines()]

if __name__ == "__main__":
    # tst = "{reports|complains of} (no) associated cough or {night sweats|difficulty in breathing}"
    # sym = create_symbol(tst)
    # accum = list()
    # symbol_text(sym,accum)

    # for line in (accum):
    #     print ( " ".join(line) )
    count = 1
    for i,sym in enumerate( get_symbols(DIR) ):
        if len(sym["symbols"]) > 0:
            #pprint.pprint ([i,sym])
            accum = list()
            symbol_text(sym, accum)
            for line in accum:
                line = [l.strip() for l in line if len(l.strip()) > 0 ]
                print (" ".join(line) )
                count += 1