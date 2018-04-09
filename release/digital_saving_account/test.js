var base64=require('base-64')
const Netcat=require('node-netcat')
fs=require('fs');

let options = {
 // define a connection timeout
	timeout: 60000,
 // buffer(default, to receive the original Buffer objects), ascii, hex,utf8, base64
  read_encoding: 'ascii'
 }

// client init connection
function parse(data,pattern){
    idx=data.indexOf(pattern)
    if(idx===-1)return undefined
    startIdx=1000000
    ans=''
    for(i=idx;i<data.length;i++){
        if(data[i]==':')startIdx=i+2
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
function login(username,password){
    var loginPromise = new Promise((resolve,reject)=>{
        let client = new Netcat.client(10123,'140.112.31.96', [options])
        client.start()
        var count=0
        var logined=false
        client.on('data',data=>{
            count++
            data=data.toString()
            if(logined){
                resolve(parse(data.toString(),'token'))
            }
            if(count==2){
                client.send('0\n')
            }
            if(contain(data,'user name')){
                client.send(username+'\n')
            }
            if(contain(data,'password')){
                client.send(password+'\n')
                logined=true
            }
        })
    })
    return loginPromise
}
function register(token,username,password){
    var registerPromise = new Promise((resolve,reject)=>{
        let client = new Netcat.client(10123,'140.112.31.96', [options])
        client.start()
        var count=0
        var registered=false
        client.on('data',data=>{
            count++
            data=data.toString()
            console.log(data)
            if(registered){
                resolve(data)
            }
            if(count==2){
                client.send('1\n')
            }
            if(contain(data,'token')){
                client.send(token+'\n')
            }
            if(contain(data,'username')){
                client.send(username+'\n')
            }
            if(contain(data,'password')){
                client.send(password+'\n')
                reigstered=true
            }
        })
    })
    return registerPromise 
}
function createPad(num){
    s=''
    while(num--)s=s+'_'
    return s
}

let client = new Netcat.client(10123,'140.112.31.96', [options])
client.start()
var count=0
var d1,d2
D1=login(createPad(4),'_').then(data=>{
    data=base64.decode(data)
    d1=data.substr(0,16)
    return d1
})
D2=login(createPad(10)+'admin','_').then(data=>{
    data=base64.decode(data)
    d2=data.substr(16)
    return d2
})
Promise.all([D1,D2]).then(()=>{
    var token=base64.encode(d1+d2)
    console.log(token)
    register(token,createPad(4),'_')
})
