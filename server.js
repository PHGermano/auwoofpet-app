const express = require('express')
const app = express()
const port = 3000

const data = [
    {
        "name": "Meu Canino Feliz",
        "distance": 2,
        "smallDogPrice": 20,
        "bigDogPrice": 40,
        "increaseType": "Percentage",
        "increasePrice": 20,
    },
    {
        "name": "Vai Rex",
        "distance": 1.7,
        "smallDogPrice": 15,
        "bigDogPrice": 50,
        "increaseType": "Real",
        "increasePrice": 5,
    },
    {
        "name": "ChowChawgas",
        "distance": 0.8,
        "smallDogPrice": 30,
        "bigDogPrice": 45,
        "increaseType": "Real",
        "increasePrice": 0,
    }
];
app.use(express.static(__dirname + "/"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/bestprice', (req, res) => {
    let totalPrice = Number.MAX_VALUE;
    let namePetShop = "";
    let distanceShop = 0;
    const smallDog = req.query.smallDog;
    const bigDog = req.query.bigDog;
    const date = req.query.date;
    const dateData = new Date(date);
    const dayOfWeek = dateData.getUTCDay();


    for (let i = 0; i < data.length; i++) {
        const smallDogPrice = data[i].smallDogPrice;
        const bigDogPrice = data[i].bigDogPrice;
        const name = data[i].name;
        const increasePrice = data[i].increasePrice;
        let price = 0;

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            if (data[i].increaseType === "Percentage") {
                price = ((smallDogPrice * increasePrice / 100) + smallDogPrice) * smallDog + ((bigDogPrice * increasePrice / 100) + bigDogPrice) * bigDog;
    
            } else if (data[i].increaseType === "Real") {
                price = (smallDogPrice + increasePrice) * smallDog + (bigDogPrice + increasePrice * increasePrice) * bigDog; 
            }
        } else {
            price = smallDogPrice * smallDog + bigDogPrice * bigDog;
        }
        
        if (price < totalPrice) {
            totalPrice = price;
            namePetShop = name;
            distanceShop = data[i].distance;
        } else if (price == totalPrice) {
            if (data[i].distance < distanceShop) {
                totalPrice = price;
                namePetShop = name;
                distanceShop = data[i].distance;  
            }
        }
    }

  res.send({namePetShop, totalPrice, distanceShop});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})