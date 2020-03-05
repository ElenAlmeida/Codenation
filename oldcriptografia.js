const fs = require('fs');
const sha1 = require('js-sha1');
const crypto = require('crypto');

fs.readFile("./resposta.json", 'utf8', function(err, date){
    if(err){
        console.log("erro ao ler arquivo")
    }
    
    let jsonResponse = JSON.parse(date);   
   
    let fraseDecifrada = cipherdecode(jsonResponse.cifrado, jsonResponse.numero_casas);
    jsonResponse.decifrado = fraseDecifrada;

    const frase = crypto.createHash('sha1').update(fraseDecifrada).digest('hex');
    jsonResponse.resumo_criptografico = frase;
    

    fs.writeFile()
    
})


 function cipherdecode(messenger2, move2){ 
  let cod2="";
  let codAsc2=[];
  for(let i=0; i<messenger2.length; i++){
      codAsc2=messenger2[i].charCodeAt();             
    if(codAsc2>=65 && codAsc2<=90){
      cod2+=String.fromCharCode(((codAsc2-65-(move2 %26)+26)%26)+65);
    }
    else if(codAsc2>=97 && codAsc2<=122){
      cod2+=String.fromCharCode(((codAsc2-97-(move2 %26)+26)%26)+97);      
    }else{
      cod2+=String.fromCharCode(codAsc2);
    }
  }
 return cod2;
}

module.exports = cipherdecode;

// http.open('GET', url, false);
// http.onreadystatechange = () => {
//   if(http.status == 200){
//     console.log(http.responseText)
//     let response = JSON.parse(http.responseText);

//     let decifra = cipherdecode(response.cifrado, response.numero_casas);
//     response.decifrado = decifra;

//     let resumo_criptográfico = criptografia(decifra);
//     response.resumo_criptografico = resumo_criptográfico;

//     console.log(response);

//     let newResponse = JSON.stringify(response);


//     fs.writeFile('answer.json', newResponse , () => {
//       console.log('Arquivo Salvo!')
//     })
//   }
// }
// http.send();




