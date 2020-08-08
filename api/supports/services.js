
const titleConstruct=(string)=>{
    string=string.split(' ')

    var newstring = string.map((val,index)=>{
        var newcase=val.charAt(0).toUpperCase()+val.slice(1)
        // console.log(newcase)

        return newcase
    })

    newstring=newstring.join(' ')
    console.log(newstring)
    return newstring
}

// titleConstruct('hello kitty')


// const number=Math.ceil(2.4)

// console.log(number)


// Date.prototype.addHours = function(h) {
//     this.setTime(this.getTime() + (h*60*60*1000));
//     return this;
// }

// var time=new Date().addHours(4)


// console.log(new Date())
// console.log(time)



const idr=(number)=>{

    if(number==undefined||number==null){
        return 'Rp0,00'
    }

    var price='Rp'

    var newnumber=number.toString().split('').reverse()

    // newnumber.splice(3,0,',')
    // console.log(newnumber)

    var loopnumber=newnumber

    var count=0
    newnumber.forEach((val,index)=>{
        // console.log('val',val,' index',index)
        if(index%3==0&&index>0){
            // console.log(index)
            newnumber.splice(index+count,0,',')
            count++
        }
    })

    var newnumber=newnumber.reverse().join('')

    var price='Rp'+newnumber+'.00'

    return price

}

console.log(idr(200))


// var abc=['5',',','4','0','0',',','3','0','0']
// console.log(abc.join(''))