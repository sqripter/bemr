class Token:
    token_class_name = "token__container"
    def __init__(self, text,tag = None,pos = None,mtag = None,line_no = None,col = None):
        self.text = text.strip().lower()
        self.tag = tag
        self.pos = pos.lower()
        self.mtag = mtag.lower().strip()
        self.line_no = line_no
        self.col = col
        
    def as_HTML(self):
        out =  f"<div class='{self.token_class_name}'>"
        out += f"<span>{self.text}</span><hr>"
        out += f"<span>{self.tag}</span><hr>"
        out += f"<span>{self.pos}</span><hr>"
        out += f"<span>{self.mtag}&nbsp;</span>"
        out += f"</div>"
        
        return out
    
    def __repr__(self):
        s = self.mtag if self.mtag != "" else "/"+self.pos
        return f"{self.text}{s}"
    
class Word:
    def startWord (): return Word ([   Token( "<start>","start","start","" )   ])

    def stopWord (): return Word ([   Token( "<stop>","stop","stop","" )   ])

    def __init__(self,tokens):
        self.text = " ".join([t.text for t in tokens])
        self.tag = f"/{tokens[0].tag.lower()}" if tokens[0].mtag == "" else tokens[0].mtag
        #self.pos =  f"/{tokens[0].pos}"
        #self.mtag = tokens[0].mtag
        num = len(tokens)
        self.isStop = tokens[num-1].text.endswith(".")
        self.isComma = tokens[num-1].text.endswith(",")
        

        if self.isComma or self.isStop:
            self.text = self.text[:-1]
        elif len(self.text):
            c = self.text[-1]
            if c in "@#$%^&*()_+=-{}\\|][\":;'?/<,./":
                self.text = self.text[:-1]

    def __repr__(self):
        return self.text
    
class FileToTokens:#file to tokens    
    section_types = ["/pc","/hpi","/fsh","/pmh","/labs",
                      "/plan", "/meds", "/ge","/cns","/resp",
                      "/gus","/cvs","/msk","/pa","/heent",
                      "/head","/eyes","/ears","/neck","/throat",
                      "/breast","/la"]
    
    def __init__(self, fname):
        self.fname = fname
        self.refreshTokens()
        
    def refreshTokens(self):
        self.lines = open(self.fname,"r").readlines()
        self.tokens = []
        self.sections = []
        
    def locateTag (self,tag,text = None):
        tag  = tag.lower()

        if text:
            text = text.lower()

        for tok in self.tokens:
            if tok.mtag == tag:
                if text == None:
                    return tok
                if text != None:
                    if tok.text == text:
                        return tok
        
        return None
    
    def exfoli8(self,nlp,show = True):
        
        b_pop_tokens = len(self.tokens) == 0
             
        for index,line in enumerate(self.lines):
            if index == 0:
                continue
                
            if not line.strip().startswith("/"):
                continue
                
            text = self.lines[index-1]
            tags = line.split(" ")
            num_tags = len(tags)
            doc = nlp(text)

            out = ""
            for i,token in enumerate(doc):
                
                if tags[i].lower() in self.section_types:
                    self.sections.append( tags[i].lower() )
                    
                new_token = Token ( text = token.text, tag = token.tag_, pos = token.pos_, mtag = tags[i], line_no = index, col = i,  )

                if show:
                    out += new_token.as_HTML()
                
                
                if b_pop_tokens:
                    self.tokens.append(new_token)

            if show:
                display(HTML( f"<div class='nlp__container'><div>{self.fname}: line:{index-1}</div>{out}</div>"))
                
    def extractSection(self,section):
        section = section.lower().strip()
        
        if section not in self.section_types:
            raise Exception(f"{section} is not a valid section type")

        accum = []
        flag = False
        num = len(self.tokens)
        idx = -1
        while idx < num-1:
            idx+=1

            tok = self.tokens[idx]
            if flag == False and tok.mtag == section :
                flag = True

                while self.tokens[idx+1].mtag == "/i":
                    idx += 1

                continue

            elif flag == True and tok.mtag in FileToTokens.section_types and tok.mtag != section :
                flag = False

            if flag == True:
                accum.append(tok)
                
        return accum
        
        
        


class TikTok:
    def __init__(self,fyls):
        self.fyls = fyls
        self.ngrams = 4
        self._model = {}
        self._remaps = {} 

    def locate(self,tag,text = None):
        for f in filter(lambda x : x.locateTag(tag,text), self.fyls):
            yield f.locateTag(tag,text)
            
    
    def itr_tokens(self,fyl_tokens):

        num = len(fyl_tokens)

        if num == 0:
            return []

        pos = 0
        if fyl_tokens[0].text == "/i":
            raise Exception (f"{fyl_tokens[0]} is not a valid first token")
            
        while pos < num:
            token = fyl_tokens[pos]
            
            Mtag = token.mtag
            if Mtag.strip() == "":
                Mtag = token.tag
            accum = [ token ]
            while pos+1 < num:
                token = fyl_tokens[pos+1]
                mtag = token.mtag
                
                if mtag == "/i":
                    accum.append(token)
                    pos+=1
                else:
                    break
            pos += 1
            yield Word(accum)
            
    def model_all(self, section ,  ngrams  = None):
        self._model = {}
        self._remaps = {}
        for fyl in self.fyls:
            self.model(fyl,section,ngrams)

    USE_KEY_ONLY = ["/start",
                    "/date","/cd","/gender","/episode","/drug","/gender","/geog","/imaging",
                    "/lab-num","/lab","/lab-result",
                    "/measure","/med-cadre","/med-device","/med-drug","/med-loc","/med-proc","/med-verb","/no",
                    "/period","/parasite","/per","/pt","/pt-age","/pt-biodata"]
    REMAPS = ["/pt"]

    def augment_keys(self,keys):
        ln = len(keys)

        out = []
        def f2(III,pfx="",accum = []):
            for i in III[0]:
                if len(III)>1:
                    v = i if pfx == "" else f"{pfx}_{i}"
                    f2(III[1:],v,accum)
                else:
                    v = i if pfx == "" else f"{pfx}_{i}"
                    accum.append(f"{v}")

              

        for k1 in keys:
            kversions = []
            pack = [k1.text,k1.tag]
            for i in [True, False]:
                for j in [True, False]:
                    if k1.tag in self.USE_KEY_ONLY:
                        key = f"{k1.tag}"
                    else:
                        key = f"{pack[0] if i else ''}{pack[1] if j else ''}"
                        
                    if len(key)>0 and key not in kversions:
                        kversions.append(key)
                    
            out.append(kversions)
        
        itrs = [[True],
                [True,True],
                [[True,False,True],[True,True,True]]]


        accum = []
        if len(out) == 3:
            for c in itrs[2]:
                pkg = []
                for i,tf in enumerate(c):
                    if tf:
                        pkg.append(out[i])
                    else:
                        pkg.append(["unk"])
                
                f2(pkg,accum =accum)

        else:
            f2(out,accum=accum)

        return accum
                

    def model(self,fyl,section,ngrams = None):
        words = [t for t in self.itr_tokens(  fyl.extractSection(section) )]

        num_words = len(words)

        if num_words == 0:
            return
  
        if ngrams:
            self.ngrams = ngrams


        def apnd(key_words,_next):

            aug_keys = self.augment_keys(key_words)
            
            key_ = self.clean_key(key_words)

            _next_str = f"{_next.text}{_next.tag}"

            for key_ in aug_keys:
                if key_ in self._model:
                    self._model[key_].append(_next_str)
                else:
                    self._model[key_] = [_next_str]
                    
                
        pos = stop = 0
        while pos < num_words:
            while stop < num_words:   
                if words[stop].isStop :
                    stop +=1
                    break
                else:
                    stop += 1

            sentence = [ el for el in words[pos:stop] ]

            # TODO : pad the sentence with <start> and <end> tags 

            sentence.insert(0, Word.startWord() )

            sentence.append( Word.stopWord()  )

            _len = len(sentence)

            if _len <= 2:
                raise Exception( f"Sentence of words too short {  sentence }" )
                
            elif _len>2:
                pos_s = 0
                while pos_s < _len-1:
                    for n in range(1,  min ( self.ngrams,   _len - pos_s  )) :

                        lmt =pos_s+n

                        apnd( sentence [ pos_s:lmt] ,  sentence[lmt]  )


                    pos_s += 1


            
            pos = stop
            stop += 1



    
    def clean_key(self,keys):
        out = []

        for w in keys:
            if w.tag in TikTok.REMAPS:
                self._remaps[w.text] = w.tag

            if w.tag in TikTok.USE_KEY_ONLY:
                out.append(f"{w.tag}")
            else:
                out.append(f"{w.text}{w.tag}")

        return "_".join(out)

    IGNORE_TEXT = ["","/date","/per","/measure","/hyph","/_sp","/lab-num","/cd","/dose",
                "/pt-age","/dose-unit","/dose-unit/measure","/dose-unit/measure/period",
                ]
    def vocab(self,min_wordlength=1):
        out = {}
        for fyl in self.fyls:
            for section in FileToTokens.section_types:
                words = [t for t in self.itr_tokens(  fyl.extractSection(section) )]
                for w in words:

                    if w.tag in self.IGNORE_TEXT:
                        continue

                    text = w.text.strip().lower()

                    if len(text) <= min_wordlength:
                        continue

                    if text not in out:
                        out[text] = w.tag

        return [f"{k}{out[k]}"for k in out.keys()]

if __name__ == "__main__":
    import pickle
    import json
    with open("./files.v2-model","rb") as f:
        fyls = pickle.load(f)

    pass
    tiktok = TikTok( fyls )
    dictionary = tiktok.vocab()
    dictionary.sort()
    with open("./lex.js","w") as lex:
        lex.write("const lex = ")
        json.dump(dictionary,lex)
        lex.write(";\n")
        lex.write("module.exports = lex;")

    tiktok.model_all("/hpi")

    with open ("./model_v2.js","w") as model_file:
        model_file.write("const model_v2 = ")
        json.dump(tiktok._model, model_file)
        model_file.write(";\n")
        model_file.write("module.exports = model_v2;")

    with open ("./remaps_v2.js","w") as remaps_file:
        remaps_file.write("const remaps_v2 = ")
        json.dump(tiktok._remaps, remaps_file)
        remaps_file.write(";\n")
        remaps_file.write("module.exports = remaps_v2;")
    #print ( json.dumps({"model":tiktok._model, "remap":tiktok._remaps} ))
            