import os
import time
import  pyperclip as pc

s = ""

while True:
	time.sleep(2)
	if s != pc.paste():
		s = pc.paste()
		print(s)
		os.system('echo "' + s + '" >> /home/source3/code/bemr/py/raw-data/copy-paste2.txt') 
