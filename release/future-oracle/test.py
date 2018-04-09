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
password='12345678'
length=10

def sha256(content):
    Sha256 = SHA256.new()
    Sha256.update(content)
    return Sha256.digest()
def sha256_string(content):
    Sha256 = SHA256.new()
    Sha256.update(content.encode('ascii'))
    return binascii.hexlify(Sha256.digest())
def base64encode(content):
    return base64.b64encode(content)
def base64encode_string(content):
    return base64.b64encode(content.encode('ascii')).decode('ascii')

ID='admin'
Ns='3737'
action='login'
Message=ID+'||'+Ns+'||'+action
Mac=sha256_string('passwost||admin||3737||login')
newMac,newMessage=hashpumpy.hashpump(Mac,Message,'||printflag',length)
#    newMessage=Message+'||printflag'
print(base64encode(binascii.unhexlify(newMac)).decode('ascii'))
print(base64encode(sha256((b"".join(['passwost||'.encode('ascii'),newMessage])))).decode('ascii'))
#Mac=base64encode_string(ID+"||"+Ns+"||"+action)+"||"+base64encode_string(sha256_string(password+"||"+ID+"||"+Ns+"||"+action))
#server.sendline(Mac)
