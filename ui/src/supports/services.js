
export const titleConstruct=(string)=>{

    if(string===undefined||string===null){
        return ''
    }

    string=string.split(' ')

    var newstring = string.map((val,index)=>{
        var newcase=val.charAt(0).toUpperCase()+val.slice(1)
        // console.log(newcase)

        return newcase
    })

    newstring=newstring.join(' ')
    // console.log(newstring)
    return newstring
}

// titleConstruct('hello kitty')


export const isJson=(data)=>{
    try{
        if(data===null||data===''||data===""||data==="''"||data===`""`){
            return []
        }
        return JSON.parse(data)
    }catch{
        return []
    }
    
}

export const getDate=(date)=>{

    // PROTECTION, IF DATE IS EMPTY
    if(typeof date == 'undefined'){
        return 'no date found'
    }

    var dateParts = date.split("-");
    // console.log('datepart',dateParts)
    // console.log(dateParts[2])
    var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
    // return jsDate

    var string=dateParts[2]
    // GET MIN
    var hour
    var min
    for(var i=0;i<string.length;i++){
        if(string.charAt(i)==='T'){
            hour=string.slice(i+1,i+3)
            min=string.slice(i+4,i+6)
        }
    }

    
    // GET DATE
    var date=jsDate.getDate()

    // GET MONTH
    var month=''
    // console.log('getmonth',jsDate.getMonth())
    switch(jsDate.getMonth()){
        case 0:
            month='January'
            break;
        case 1:
            month='February'
            break;
        case 2:
            month='March'
            break;
        case 3:
            month='April'
            break;
        case 4:
            month='May'
            break;
        case 5:
            month='June'
            break;
        case 6:
            month='July'
            break;
        case 7:
            month='August'
            break;
        case 8:
            month='September'
            break;
        case 9:
            month='October'
            break;
        case 10:
            month='November'
            break;
        case 11:
            month='December'
            break;
    }

    // GET YEAR
    var year=jsDate.getFullYear()


    var tanggal=date+' '+month+' '+year+' '+hour+':'+min
    // console.log(tanggal)
    
    return tanggal
}


export const date=(date)=>{

    // PROTECTION, IF DATE IS EMPTY
    if(typeof date === 'undefined'){
        return 'no date found'
    }

    var dateParts = date.split("-");
    console.log(dateParts)
    // console.log(dateParts[2])
    console.log(dateParts[2].substr(0,2))
    
    return dateParts[2].substr(0,2)

}

export const idr=(number)=>{

    if(number===undefined||number===null){
        return 'Rp0,00'
    }

    var price='Rp'

    var newnumber=number.toString().split('').reverse()

    // var loopnumber=newnumber

    var count=0
    newnumber.forEach((val,index)=>{
        if(index%3===0&&index>0){
            newnumber.splice(index+count,0,',')
            count++
        }
    })

    var newnumber=newnumber.reverse().join('')

    var price='Rp'+newnumber+'.00'

    return price

}

export const dateLabel=(date)=>{
     console(date)
    // PROTECTION, IF DATE IS EMPTY
    if(typeof date == 'undefined'){
        return 'no date found'
    }

    var dateParts = date.split(" ");
    console.log(dateParts)
    // console.log(dateParts[2])
    console.log(dateParts[2].substr(0,2))
    
    return dateParts[0]

}