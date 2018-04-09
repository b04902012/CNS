var text=require('./text.js')
var base64ToImage=require('base64-to-image')
console.log(text)
const Netcat=require('node-netcat')
numeric=[]
for(let i=0;i<10;i++)numeric.push(i.toString())
smallLetter=[]
for(let i=1;i<=26;i++)smallLetter.push(String.fromCharCode(i+96))
console.log(smallLetter)
capitalLetter=[]
for(let i=1;i<=26;i++)capitalLetter.push(String.fromCharCode(i+64))
console.log(capitalLetter)
fs=require('fs');

let options = {
 // define a connection timeout
	timeout: 60000,
 // buffer(default, to receive the original Buffer objects), ascii, hex,utf8, base64
  read_encoding: 'ascii'
 }

let client = new Netcat.client(10120,'140.112.31.96', [options])
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
function shift(string,offset){
    ans=''
    for(let i=0;i<string.length;i++){
        if(contain(smallLetter,string[i])){
            idx=smallLetter.indexOf(string[i])+offset
            if(idx>=26)idx-=26
            ans+=smallLetter[idx]
        }
        else if(contain(capitalLetter,string[i])){
            idx=capitalLetter.indexOf(string[i])+offset
            if(idx>=26)idx-=26
            ans+=capitalLetter[idx]
        }
        else{
            ans+=string[i]
        }
    }
    return ans
}
String.prototype.replaceAt=function(index, replacement){
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length)
}
client.start()
flag=''
client.on('data',data=>{
    data=data.toString()
    console.log(data)
    if(data.indexOf('FLAG_PIECES')>=0){
        idx=data.indexOf('FLAG_PIECES')+13
        while(data[idx]!='\n'&&idx<data.length){
            flag+=data[idx]
            idx++
        }
    }
    if(data.indexOf('Congratulation!')>=0){
        flag='data:image/png;base64,'+flag
        console.log(flag)
        base64ToImage(flag,'./',{'fileName':'4.png','type':'png'})
    }

    if(data.indexOf('Warmup')!==-1){
        console.log('Warmup round start!')
        let m1=parse(data,'m1')
        console.log(m1)
        client.send(m1)

    }
    if(data.indexOf('Round 1')!==-1){
        console.log('Round 1 start!')
        let c1=parse(data,'c1')
        let m1=''
        let idx=0
        while(idx<c1.length){
            if(c1[idx] in numeric){
                num=parseInt(c1.substr(idx,2))
                m1+=String.fromCharCode(num+96)
                idx+=2
            }
            else{
                m1+=c1[idx]
                idx+=1
            }
        }
        console.log(m1)
        client.send(m1)
    }
    if(data.indexOf('Round 2')!==-1){
        console.log('Round 2 start!')
        let c1=parse(data,'c1')
        let m1=parse(data,'m1')
        let c2=parse(data,'c2')
        let m2=''
        let offset=0
        if(contain(smallLetter,c1[0])){
            offset=smallLetter.indexOf(m1[0])-smallLetter.indexOf(c1[0])
        }
        else{
            offset=capitalLetter.indexOf(m1[0])-capitalLetter.indexOf(c1[0])
        }
        if(offset<0)offset+=26
        console.log(offset)
        m2=shift(c2,offset)
        console.log(m2)
        client.send(m2)
    }
    if(data.indexOf('Round 3')!==-1){
        console.log('Round 3 start!')
        let c1=parse(data,'c1')
        c1=c1.substr(0,c1.length-1)
        for(let offset=0;offset<26;offset++)
            if(text.indexOf(shift(c1,offset))>=0)m1=shift(c1,offset)
        console.log(m1)
        client.send(m1)
        client.send('\n')
    }
    if(data.indexOf('Round 4')!==-1){
        console.log('Round 4 start!')
        let c1=parse(data,'c1')
        let m1=parse(data,'m1')
        c2=parse(data,'c2')
        m2=''
        table=[]
        for(let i=0;i<26;i++)table.push('.')
        for(let i=0;i<c1.length;i++){
            idx=smallLetter.indexOf(c1[i])
            table[idx]=m1[i]
        }
        for(let i=0;i<c2.length;i++){
            idx=smallLetter.indexOf(c2[i])
            if(idx>=0)
                m2+=table[idx]
            else if(c2[i]==' ')
                m2+=c2[i]
            else
                m2+='.'
        }
        var m2Re=new RegExp(m2.substr(0,m2.length-1))
        m2=text.match(m2Re)[0]
        /*key=fs.readFileSync('/dev/stdin').toString()
        k=0
        for(let i=0;i<m2.length;i++){
            console.log(m2[i])
            if(m2[i]=='_'){
                console.log('_'+key[k])
                m2=m2.replaceAt(i,key[k])
                console.log(m2[i])
                k++
            }
        }*/
        console.log(m2)
        client.send(m2)
        client.send('\n')
    }
    if(data.indexOf('Round 5')!==-1){
        console.log('Round 5 start!')
        let c1=parse(data,'c1')
        let m1=parse(data,'m1')
        c2=parse(data,'c2')
        sortedC2=Array.from(c2.substr(0,c2.length-1)).sort().toString()
        console.log(sortedC2)
        m2=''
        for(let left=0;left<text.length;left++){
            for(let l=c2.length-10;l<c2.length+10;l++){
                string=text.substr(left,l)
                sortedCur=Array.from(string).sort().toString()
                if(sortedC2==sortedCur)
                    m2=string
            }
        }
        console.log(m2)
        client.send(m2)
        client.send('\n')
    }
    if(data.indexOf('Round 6')!==-1){
        console.log('Round 6 start!')
        let c1=parse(data,'c1')
        let m1=parse(data,'m1')
        c2=parse(data,'c2')
        sortedC2=Array.from(c2.substr(0,c2.length-1)).sort().toString()
        console.log(sortedC2)
        m2=''
        for(let left=0;left<text.length;left++){
            for(let l=c2.length-10;l<c2.length+10;l++){
                string=text.substr(left,l)
                sortedCur=Array.from(string).sort().toString()
                if(sortedC2==sortedCur)
                    m2=string
            }
        }
        console.log(m2)
        client.send(m2)
        client.send('\n')
    }
})
