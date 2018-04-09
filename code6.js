var bigInt=require('big-integer')
var cipher=require('./otp_data.js')
var ba=require('binascii')
list=[]
while(cipher.length>0){
    list.push(parseInt('0x'+cipher.substring(0,2)))
    cipher=cipher.substring(2,cipher.length)
}
keyLength=13
keyList=[]
for(var i=0;i<13;i++)keyList.push(0)
keyList[11]=119
keyList[1]=109
keyList[3]=15
keyList[2]=201
keyList[0]=169
keyList[5]=226
keyList[12]=148
keyList[7]=144
keyList[8]=212
keyList[6]=255
keyList[4]=92
keyList[9]=123
keyList[10]=115^list[23]
keyList[10]=223
ans=''
for(var i=0;i<list.length;i++){
    ans=ans+String.fromCharCode(list[i]^keyList[i%13])
}
console.log(ans)
        
