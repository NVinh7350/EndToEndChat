// // const md5 = require('md5');
// const convertStringToNum = (str) => {
//   var arr = '';
//   for (var i = 0; i < str.length; i++) {
//     arr= arr + str.charCodeAt(i);
//   }
//   return arr;
// }
// const modBig = (g, a ,p) => {
//     if(a === 0n)
//         return 1n;
//     else if ( a % 2n == 0n) 
//         return (pow(modBig(g, a/(2n), p),2n)) % p;
//     else if (a % 2n == 1n)
//         return (modBig(g, a -1n, p) * g) % p;
// }
// const pow = (a, n) => {
//   var result = 1n;
//   for (var i = 0n ; i<n ; i++) {
//       result = result * a;
//   }
//   return result;
// }


// const p = 5809605995369958062791915965639201402176612226902900533702900882779736177890990861472094774477339581147373410185646378328043729800750470098210924487866935059164371588168047540943981644516632755067501626434556398193186628990071248660819361205119793693985433297036118232914410171876807536457391277857011849897410207519105333355801121109356897459426271845471397952675959440793493071628394122780510124618488232602464649876850458861245784240929258426287699705312584509625419513463605155428017165714465363094021609290561084025893662561222573202082865797821865270991145082200656978177192827024538990239969175546190770645685893438011714430426409338676314743571154537142031573004276428701433036381801705308659830751190352946025482059931306571004727362479688415574702596946457770284148435989129632853918392117997472632693078113129886487399347796982772784615865232621289656944284216824611318709764535152507354116344703769998514148343807n;
// const g = 2n;

// const caculatorPublicKey = (privateKey) => {
  //     privateKey = BigInt(convertStringToNum(privateKey));
  //     return modBig(g,privateKey,p);
  //   }
  
  // // export const caculatorPrivatekey = (privateKey, publicKey) => {
    // //     privateKey = BigInt(privateKey);
    // //     return modBig(publicKey, privateKey, p );
    // // }
    // // const publicKeyA = 4045907893962926753186934643659747022116435950350578114664570288355629751827761558762496875836338493791891893287578334533391120687712679241631943315752964475283116910651186292888452160414651836590466880049932060712182157830153878563662362260502307027493550745273592579976314200212087656831612619624685340621780121393151914213365745032849254591805401022505042502232347373022517308182845087800030668749458775781288587302767765038581754540792694508513576655798072630055660790600671237274348635038859145565403536655594442299086202682304440314119058727257805557533977201819291320606074664706573379697600713410271363635746476495882183147500339286300095452766176953341827260856633105128376002558058387548607973801055663096592064866244394085028795818348225065046086375006031880999797774589872538038138145277986471129011726911349666674367811158879260611168942249039659986914973948407885110033980461167503082070402682270798322017654265n;
    // const privateB = BigInt(convertStringToNum('vanvinhqn7350'));
    // const privateA = BigInt(convertStringToNum('vanvinhqn2310'));
    
    // const publicA = modBig(g,privateA,p);
    // const publicB = modBig(g,privateB,p);
    
    // console.log('privateA: ',privateA);
    // console.log('privateB: ',privateB);
    
    // console.log('publicA: ', publicA);
    // console.log('publicB: ', publicB);
    
    // console.log(modBig(publicA, privateB, p));
    // console.log(modBig(publicB, privateA, p) == modBig(publicA, privateB, p))
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    const getTimeAgo = ( previous) => {
      
      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerMonth = msPerDay * 30;
      var msPerYear = msPerDay * 365;
      var current = Date.now();
      var elapsed = current - previous;
      
      if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' giây trước';   
      }
      
      else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' phút trước';   
      }
      
      else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' giờ trước';   
  }
  
  else if (elapsed < msPerMonth) {
    return Math.round(elapsed/msPerDay) + ' ngày trước';   
  }
  
  else if (elapsed < msPerYear) {
    return Math.round(elapsed/msPerMonth) + ' tháng trước';   
  }
  
  else {
    return Math.round(elapsed/msPerYear ) + ' năm trước';   
  }
}


const getTime = (timeStamp) => {
  var elapsed = Date.now() - timeStamp;
  var date = new Date(timeStamp);
  var hours = date.getHours().toString().padStart(2,'0');
  var minutes = date.getMinutes().toString().padStart(2,'0');
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString().padStart(2,'0');
  
  if(! timeStamp) 
  return ''
  if (elapsed < msPerDay) {
    return `${hours}:${minutes}`
  }
  else if (elapsed < msPerDay * 7) {
    var days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    var dayName = days[date.getDay()];
    return `${dayName}, ${hours}:${minutes}` 
  }
  else if (elapsed < msPerYear) {
    return `${day} th${month}, ${hours}:${minutes}`   
  }
  else {
    return `${day} th${month} ${date.getFullYear()}, ${hours}:${minutes}`     
  }
}

console.log(getTime(1669311056008));
console.log(getTime(1661311056008));
console.log(getTime(1621311056008));
console.log(getTime(1669764056008));