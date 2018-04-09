const Netcat=require('node-netcat')
var fs=require('fs');
var sha1=require('sha1')
var ba=require('binascii')
var bigInt=require('big-integer')

let options = {
 // define a connection timeout
	timeout: 60000,
 // buffer(default, to receive the original Buffer objects), ascii, hex,utf8, base64
  read_encoding: 'ascii'
 }

pdf1=fs.readFileSync('shattered-1.pdf').slice(0,320).toString('hex')
pdf2=fs.readFileSync('shattered-2.pdf').slice(0,320).toString('hex')
pdf1=bigInt(pdf1,16)
pdf2=bigInt(pdf2,16)

let client = new Netcat.client(10121,'140.112.31.96', [options])
// client init connection
function parse(data,pattern){
    idx=data.indexOf(pattern)
    if(idx===-1)return undefined
    startIdx=1000000
    ans=''
    for(i=idx;i<data.length;i++){
        if(data[i]=='=')startIdx=i+2
        if(i>=startIdx)ans+=data[i]
        if(data[i]=='\n')break;
    }
    if(ans)
        return ans
}
function contain(array,element){
    idx=array.indexOf(element)
    if(idx>=0)return true
    return false
}
client.start()
client.on('data',data=>{
    data=data.toString()
    console.log(data)
    if(data.indexOf('??????????????????????????????????')>=0){
        l=data.indexOf('??????????????????????????????????')
        pattern=data.substr(l+34,6)
    }
})
