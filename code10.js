var base64=require('base-64')
const Netcat=require('node-netcat')
fs=require('fs');
var bigInt=require('big-integer')
var sha1=require('sha1')

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
        if(data[i]==':'||data[i]=='=')startIdx=i+2
        if(i>=startIdx)ans+=data[i]
        if(data[i]=='\n')break;
    }
    if(ans)
        return ans.substring(0,ans.length-1)
}
function contain(array,element){
    idx=array.indexOf(element)
    if(idx>=0)return true
    return false
}
function login(username,password){
    let loginPromise = new Promise((resolve,reject)=>{
        let client = new Netcat.client(10123,'140.112.31.96', [options])
        client.start()
        var count=0
        var logined=false
        client.on('data',data=>{
            count++
            data=data.toString()
            console.log(data)
            if(logined){
                resolve(data.substr(16))
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
/*function register(token,username,password){
    var registerPromise = new Promise((resolve,reject)=>{
        let client = new Netcat.client(10123,'140.112.31.96', [options])
        client.start()
        var count=0
        var registered=false
        client.on('data',data=>{
            count++
/bin/bash: l: command not found
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
}*/
function createPad(num){
    s=''
    while(num--)s=s+'_'
    return s
}
var count=0
var d1,d2
D1=login(createPad(4),'_').then(data=>{
    data=base64.decode(data)
    d1=data.substr(0,16)
    return d1
})
D2=D1.then(()=>{
    P2=new Promise((res,rej)=>{
        login(createPad(10)+'admin','_').then(data=>{
            data=base64.decode(data)
            d2=data.substr(16)
            res(d2)
        })
    })
    return P2
})
D2.then(()=>{
    console.log(d1.length)
    console.log(d2.length)
    var token=base64.encode(d1+d2)
    console.log(token)
    let client = new Netcat.client(10123,'140.112.31.96', [options])
    client.start()
    var username=createPad(4)
    var password=createPad(1)
    var count=0
    var registered=false
    var b0=false
    var b1=false
    var b2=false
    var T1,T2, r1, r2, s1, s2, r, s
    var p,q,g,y
    var MAC
    client.on('data',data=>{
        count++
        data=data.toString()
        console.log(count)
        console.log(data)
        if(registered){
            resolve(data)
        }
        if(contain(data,'Welcome to Digital Saving Account')){
            client.send('1\n')
        }
        if(contain(data,'token')){
            console.log(token)
            client.send(token+'\n')
        }
        if(contain(data,'username')){
            console.log(username)
            client.send(username+'\n')
        }
        if(contain(data,'password')){
            console.log(password)
            client.send(password+'\n')
        }
        if(contain(data,'Welcome admin')&&!b0){
            client.send('0\n')
            b0=true
        }
        if(contain(data,'Welcome admin')&&!b1){
            client.send('1\n')
            b1=true
        }
        if(contain(data,'Transaction1')){
            t1=parse(data,'n1')
            sig1=parse(data,t1+'"')
            r1=sig1.split(' ')[0]
            s1=sig1.split(' ')[1]
            t2=parse(data,'n2')
            sig2=parse(data,t2+'"')
            r2=sig2.split(' ')[0]
            s2=sig2.split(' ')[1]
            r1=bigInt(r1)
            s1=bigInt(s1)
            r2=bigInt(r2)
            s2=bigInt(s2)
        }
        if(contain(data,'p = ')){
            p=bigInt(parse(data,'p '))
            q=bigInt(parse(data,'q '))
            g=bigInt(parse(data,'g '))
            y=bigInt(parse(data,'y '))
            var H1=bigInt(sha1(t1),16)
            var H2=bigInt(sha1(t2),16)
            k=((H1.minus(H2)).times((s1.minus(s2)).modInv(q))).mod(q).add(q).mod(q)
            r=(g.modPow(k,p)).mod(q)
            var H=bigInt(sha1('FLAG'),16)
            s=(s1.times(k).minus(H1).add(H)).times(k.modInv(q)).mod(q).add(q).mod(q)
        }
        if(contain(data,'Welcome admin')&&!b2){
            client.send('2\n')
            b2=true
        }
        if(contain(data,'r =')){
            r=r.toString()
            console.log(r)
            client.send(r+'\n')
        }
        if(contain(data,'s =')){
            s=s.toString()
            console.log(s)
            client.send(s+'\n')
        }
    })
})
