#!/usr/bin/env python3
# Python 3.6.4

from Crypto.Cipher import AES
import binascii
def int2bytes(n):
    return bytes.fromhex('{0:032x}'.format(n))

def aes_encrypt(plain,key):
    return AES.new(key=int2bytes(key), mode=AES.MODE_ECB).encrypt(plain)

def aes_decrypt(cipher,key):
    return AES.new(key=int2bytes(key), mode=AES.MODE_ECB).decrypt(cipher)

class DoubleAES():
    def __init__(self, key0, key1):
        self.aes128_0 = AES.new(key=key0, mode=AES.MODE_ECB)
        self.aes128_1 = AES.new(key=key1, mode=AES.MODE_ECB)

    def encrypt(self, s):
        return self.aes128_1.encrypt(self.aes128_0.encrypt(s))

    def decrypt(self, data):
        return self.aes128_0.decrypt(self.aes128_1.decrypt(data))



plaintext = 'NoOneUses2AES_QQ'
ciphertext =  int2bytes(0x0e46d393fdfae760f9d4c7837f47ce51)

table={}
for k in range(0,2**23):
    table[aes_encrypt(plaintext,k)]=k
    if(k%10000==0):
        print(k)
        print(aes_encrypt(plaintext,k).hex())
k0=0
k1=0
for k in range(0,2**23):
    m=aes_decrypt(ciphertext,k)
    if(k%10000==0):
        print(k)
        print(m.hex())
    if(m in table):
        k0=table[m]
        k1=k
        break
daes=DoubleAES(int2bytes(k0),int2bytes(k1))
flag_enc=int2bytes(0x3e3a9839eb6331aa03f76e1a908d746bfccaf7acb22265b725a9f1fc0644cdda)
flag=binascii.unhexlify(daes.decrypt(flag_enc).hex())
print(flag)
