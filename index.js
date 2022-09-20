const express = require('express'),
    cors = require('cors');    
    app = express(),
    testFolder = './nft_parts/',
    fs = require('fs');

app.use(cors())
app.use(express.json())

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/get_folders', function (req, res) {
    fs.readdir(testFolder, (err, files) => {
        res.send(files)
        console.log(files)
        // files.forEach(file => {
            // console.log(file);
        // });
    });
})

app.post('/get_traits', function (req, res) {
    console.log(req.body.trait)
    fs.readdir(testFolder+req.body.trait, (err, files) => {
        console.log(files)
        const newFiles = files.filter(file => file.split('.').pop() === 'svg')
        res.send(newFiles)
    })

})

app.post('/get_trait', function(req, res) {
    res.sendFile(`./nft_parts/${req.body.trait}/${req.body.file}`, { root: __dirname });
})

app.get('/nft', function (req, res) {
    res.sendFile('./nft_parts/head/03-donkey.svg', { root: __dirname });
})

app.get('/nft1', function (req, res) {
    res.sendFile('./nft_parts/body/01-deer.svg', { root: __dirname });
})

app.get('/nft2', function (req, res) {
    res.sendFile('./nft_parts/feet/02-wolf.svg', { root: __dirname });
})

fs.readdir(testFolder, (err, files) => {
    // files.forEach(file => {
        // console.log(file);
    // });
});

 let server = app.listen(8000, function () {
    let host = server.address().address
    let port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })