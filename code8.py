#!/usr/bin/env python2.7
from pwn import *
import hashlib
from binascii import unhexlify
import random
def sha1(content):
    Hash = hashlib.sha1()
    Hash.update(content)
    return Hash.digest()
server=remote('140.112.31.96',10121)
server.recvuntil('??????????????????????????????????')
pdf1='255044462d312e330a25e2e3cfd30a0a0a312030206f626a0a3c3c2f57696474682032203020522f4865696768742033203020522f547970652034203020522f537562747970652035203020522f46696c7465722036203020522f436f6c6f7253706163652037203020522f4c656e6774682038203020522f42697473506572436f6d706f6e656e7420383e3e0a73747265616d0affd8fffe00245348412d3120697320646561642121212121852fec092339759c39b1a1c63c4c97e1fffe017346dc9166b67e118f029ab621b2560ff9ca67cca8c7f85ba84c79030c2b3de218f86db3a90901d5df45c14f26fedfb3dc38e96ac22fe7bd728f0e45bce046d23c570feb141398bb552ef5a0a82be331fea48037b8b5d71f0e332edf93ac3500eb4ddc0decc1a864790c782c76215660dd309791d06bd0af3f98cda4bc4629b1'
pdf2='255044462d312e330a25e2e3cfd30a0a0a312030206f626a0a3c3c2f57696474682032203020522f4865696768742033203020522f547970652034203020522f537562747970652035203020522f46696c7465722036203020522f436f6c6f7253706163652037203020522f4c656e6774682038203020522f42697473506572436f6d706f6e656e7420383e3e0a73747265616d0affd8fffe00245348412d3120697320646561642121212121852fec092339759c39b1a1c63c4c97e1fffe017f46dc93a6b67e013b029aaa1db2560b45ca67d688c7f84b8c4c791fe02b3df614f86db1690901c56b45c1530afedfb76038e972722fe7ad728f0e4904e046c230570fe9d41398abe12ef5bc942be33542a4802d98b5d70f2a332ec37fac3514e74ddc0f2cc1a874cd0c78305a21566461309789606bd0bf3f98cda8044629a1'
pattern=server.recv().decode('ascii')[:-1]
print(hex(int.from_bytes(sha1(unhexlify(pdf1)),'big')))
count=0
k=''
while(count<2**32):
    k=hex(random.randint(2**47,2**48))[2:]
    pdf=pdf1+k
    pattern1=hex(int.from_bytes(sha1(unhexlify(pdf)),'big'))[-6:]
    if(pattern==pattern1):
        break;
server.sendline(pdf1+k)
server.sendline(pdf2+k)
print(server.recvall().decode('ascii'))

'''
import hashlib
import os
import random
import signal
import sys
import time

def alarm(time):
    def handler(signum, frame):
        print 'You need to be faster. Are you from the future?'
        exit()
    signal.signal(signal.SIGALRM, handler)
    signal.alarm(time)

def sha1(content):
    Hash = hashlib.sha1()
    Hash.update(content)
    return Hash.digest()

def POW():
    randomstring = hex(random.randint(0, 16777216))[2:]
    alarm(120)
    print "This is Time Machine PoR System."
    print "Finish the challenge in two minutes."
    print "Your input size should be smaller than 400 bytes."
    Input = raw_input("Give me the X such that sha1(X)=??????????????????????????????????{:0>6}:".format(randomstring)).decode("hex")
    UserX = Input
    if len(UserX) > 400:
        print "Input size too big!"
        exit()
    UserHash = sha1(UserX).encode("hex")
    if sha1(UserX).encode("hex")[-6:] != "{:0>6}".format(randomstring):
        print "Wrong!"
        exit()
    print "Great!"
    return UserHash, UserX

def collision(UserHash, UserX):
    Input = raw_input("Now Give me the Y such that sha1(X) == sha1(Y):").decode("hex")
    if Input == UserX:
        print "Y can not be the same as X!"
        exit()
    UserHash2 = sha1(Input).encode("hex")
    if UserHash2 != UserHash :
        print "Wrong!"
        exit()

def flag():
    flag = open("flag.txt").read()
    print flag

if __name__ == '__main__':
    sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 0)
    sys.stdin = os.fdopen(sys.stdin.fileno(), 'r', 0)
    UserHash,UserX = POW()
    collision(UserHash,UserX)
    flag()
    exit()'''
