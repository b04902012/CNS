#!/usr/bin/env python2.7
from pwn import *
import hashlib
from binascii import unhexlify
import sys
import os
import time
import base64
import random
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
import hashlib
import binascii
import hashpumpy

import random
import string
BS = 16
pad = lambda s: s + (BS - len(s) % BS) * chr(BS - len(s) % BS)
unpad = lambda s: s[:-ord(s[-1])]

def sha256(content):
    Sha256 = SHA256.new()
    Sha256.update(content)
    return Sha256.digest()
def sha256_string(content):
    Sha256 = SHA256.new()
    Sha256.update(content.encode('ascii'))
    return Sha256.digest().decode('ascii')
def base64encode(content):
    return base64.b64encode(content)
def base64encode_string(content):
    return base64.b64encode(content.encode('ascii')).decode('ascii')
def getMac(Nc):
    newServer=remote('140.112.31.96',10122)
    time.sleep(5.1)
    ID='admin'
    Message=ID+'||'+Nc
    Digest=base64.b64encode(sha256(Message.encode('ascii'))).decode('ascii')
    newServer.recvuntil('to me: ')
    newServer.sendline(Message+'||'+Digest)
    newMac=newServer.recv().decode('ascii').split('||')[1]
    newServer.close()
    return newMac
    
    

for length in range(21,22):
    server=remote('140.112.31.96',10122)
    time.sleep(6)
    server.recv()
    ID='admin'
    Nc='37'
    Message=ID+'||'+Nc
    Digest=base64.b64encode(sha256(Message.encode('ascii'))).decode('ascii')
    server.sendline(Message+'||'+Digest)

    Ns=server.recv().decode('ascii').split('||')[0]
    print('Ns='+Ns)
    p=server.recv().decode('ascii')
    Mac=getMac(Ns)
    Mac=base64.b64decode(Mac).hex()
    print(Mac)
    action='login'
    Message=ID+'||'+Ns+'||'+action
    newMac,newMessage=hashpumpy.hashpump(Mac,Message,'||printflag',length)
#    newMessage=Message+'||printflag'
    newMac=binascii.unhexlify(newMac)
    print(base64encode(newMessage).decode('ascii')+'||'+base64encode(newMac).decode('ascii'))
    server.sendline(base64encode(newMessage).decode('ascii')+'||'+base64encode(newMac).decode('ascii'))
    p=server.recv()
    print(length)
    print(p)
    p=server.recv()
    print(p)
#Mac=base64encode_string(ID+"||"+Ns+"||"+action)+"||"+base64encode_string(sha256_string(password+"||"+ID+"||"+Ns+"||"+action))
#server.sendline(Mac)
