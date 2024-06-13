const express = require("express");
const app = express();
const port = 3000;

//Array com as informações dos PetShops
const data = [
  {
    name: "Meu Canino Feliz",
    distance: 2,
    smallDogPrice: 20,
    bigDogPrice: 40,
    increaseType: "Percentage",
    increasePrice: 20,
  },
  {
    name: "Vai Rex",
    distance: 1.7,
    smallDogPrice: 15,
    bigDogPrice: 50,
    increaseType: "Real",
    increasePrice: 5,
  },
  {
    name: "ChowChawgas",
    distance: 0.8,
    smallDogPrice: 30,
    bigDogPrice: 45,
    increaseType: "Real",
    increasePrice: 0,
  },
];
app.use(express.static(__dirname + "/"));

//Envia o HTML para a tela
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Função que recolhe as informações e realiza a análise
app.get("/bestprice", (req, res) => {
  let totalPrice = Number.MAX_VALUE;
  let namePetShop = "";
  let distanceShop = 0;
  //Constantes para input
  const smallDog = req.query.smallDog;
  const bigDog = req.query.bigDog;
  const date = req.query.date;
  const dateData = new Date(date);
  //Verifica o dia da semana
  const dayOfWeek = dateData.getUTCDay();

  //For para calcular as informações
  for (let i = 0; i < data.length; i++) {
    const smallDogPrice = data[i].smallDogPrice;
    const bigDogPrice = data[i].bigDogPrice;
    const name = data[i].name;
    const increasePrice = data[i].increasePrice;
    let price = 0;
  
    //Verifica se é final de semana
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      //Verifica o tipo de aumento no valor, porcentagem ou real
      if (data[i].increaseType === "Percentage") {
        //Calculo do valor em caso do tipo porcentagem
        price =
          ((smallDogPrice * increasePrice) / 100 + smallDogPrice) * smallDog +
          ((bigDogPrice * increasePrice) / 100 + bigDogPrice) * bigDog;
      } else if (data[i].increaseType === "Real") {
        //Calculo do valor em caso do tipo real
        price =
          (smallDogPrice + increasePrice) * smallDog +
          (bigDogPrice + increasePrice * increasePrice) * bigDog;
      }
    } else {
      //Calculo do valor em caso de não acréscimo ao valor
      price = smallDogPrice * smallDog + bigDogPrice * bigDog;
    }

    //Verifica se é o menor valor
    if (price < totalPrice) {
      totalPrice = price;
      namePetShop = name;
      distanceShop = data[i].distance;
    } else if (price == totalPrice) {
      //Verifica se existem valores iguais
      //Verifica qual PetShop tem a menor distância
      if (data[i].distance < distanceShop) {
        totalPrice = price;
        namePetShop = name;
        distanceShop = data[i].distance;
      }
    }
  }
  //Envia as respostas em formato de objeto
  res.send({ namePetShop, totalPrice, distanceShop });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
