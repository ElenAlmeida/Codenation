const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
const sha1 = require('js-sha1');
const crypto = require('crypto');
const request = require('request');

const url = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=5f20d8c4d4c692ad3de98c74e3d068e9d2d18454';
const http = new XMLHttpRequest();


// Faz a requisição na Api

const promise = new Promise((resolve) => {
  http.open('GET', url, false);
  http.onreadystatechange = () => {
    if (http.status == 200) {
      resolve(http.responseText);

      // fs.writeFile('answer.json', http.responseText , () => {
      //   console.log('Arquivo Salvo!')
      // })
    }
  }
  http.send();
})


// Cria e atualiza o arquivo answer.json

const createsAndUpdateFile = (string) => {
  fs.writeFile('answer.json', string, () => {
    console.log('Arquivo Salvo!');
  })
}

// Decifra e encripta a frase e atualiza o arquivo answer.json 
const decryptsAndEncodes = () => {


  fs.readFile("./answer.json", "utf8", (err, response) => {
    if (err) {
      console.log("erro ao ler arquivo!")
    };

    let resp = JSON.parse(response);

    resp.decifrado = cipherdecode(resp.cifrado, resp.numero_casas);
    resp.resumo_criptografico = encrypt(resp.decifrado);

    let newResponse = JSON.stringify(resp);

    createsAndUpdateFile(newResponse);
  });
};



// decifra a mensagem
const cipherdecode = (messenger, move) => {
  let cod = "";
  let codAsc = [];
  for (let i = 0; i < messenger.length; i++) {
    codAsc = messenger[i].charCodeAt();
    if (codAsc >= 65 && codAsc <= 90) {
      cod += String.fromCharCode(((codAsc - 65 - (move % 26) + 26) % 26) + 65);
    }
    else if (codAsc >= 97 && codAsc <= 122) {
      cod += String.fromCharCode(((codAsc - 97 - (move % 26) + 26) % 26) + 97);
    } else {
      cod += String.fromCharCode(codAsc);
    }
  }
  return cod;
};

//Encripta a mensagem em sha1
const encrypt = (string) => {
  let frase_criptografada = crypto.createHash('sha1').update(string).digest('hex');

  return frase_criptografada;
}


// ?Função que deveria enviar a resposta para a api?
const sendChallenge = async () => {

  // let formData= new FormData('answer.json');

  const url = "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=5f20d8c4d4c692ad3de98c74e3d068e9d2d18454";

  let headers = { 'Content-Type': 'multipart/form-data' };
  request(
    {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        answer: fs.createReadStream("./answer.json")
      }
    },
    (err, res, body) => {
      if (err) {
        console.log('não foi dessa vez');
      }
      console.log('success', body);
    }
  )
};

// Se tem sucesso na requisição da api executa a função

promise.then(response => {
  console.log(response);

  //cria o arquivo answer.json
  createsAndUpdateFile(response);

  //decifra e codifica a mensagem
  decryptsAndEncodes();

  //envia o desafio

  sendChallenge();

});


