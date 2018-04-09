var bigInt=require('big-integer')
var Mersenne=require('./mersenne-rsa/mersenne-rsa.js')
var ba=require('binascii')
N=bigInt(Mersenne.N)
i2=bigInt[1];
j2=bigInt[1];
P=bigInt[0]
Q=bigInt[0]
for(let i=1;i<1000;i++){
    i2=bigInt(2).times(i2)
    j2=bigInt[1]
    for(let j=1;j<1000;j++){
        j2=bigInt(2).times(j2)
        p=i2.minus(1)
        q=j2.minus(1)
        pq=p.times(q)
        if(pq.compare(N)==0){
            P=p
            Q=q
        }
    }
}
Phi=P.minus(1).times(Q.minus(1))
console.log((P.times(Q)).toString(2))
console.log(N.toString(2))
E=bigInt(Mersenne.e)
D=E.modInv(Phi)
C=bigInt(Mersenne.flag)
M=C.modPow(D,N)
console.log(ba.unhexlify(M.toString(16)))
