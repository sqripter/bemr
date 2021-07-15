import pprint

import json
import sys

def create_model(lines, n = 2):
    stats = {}
    model = {}
    for line in lines[0:-2]:
        line = line.lower().strip().split()
        num = len(line)
        if num in stats:
            stats[num] += 1
        else:
            stats[num] = 1

        if num > n:
            for i in range (num-n):
                root = " ".join( line[i:i+n] )
                branch = line[i+n]
                if root in model:
                    if branch in model[root]:
                        model[root][branch] += 1
                    else: 
                        model[root][branch] = 1
                else:
                    model[root] = {branch : 1}

        

    return model#pprint.pprint(model)


if __name__ == "__main__":
    fn = ".data/data.txt"
    lines = open(fn,"r",encoding="utf8").readlines()


    m1 = create_model(lines,1)
    m2 = create_model(lines,2)
    m3 = create_model(lines,3)

    m = {}
    m.update(m1)
    m.update(m2)
    m.update(m3)

    l = [k for k in m1.keys()]
    l.sort()
    
    json.dump({"tokens":l ,"model":m}, sys.stdout)
