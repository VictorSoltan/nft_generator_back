const express = require('express'),
    cors = require('cors');    
    app = express(),
    mainFolder = './nft_folders'
    testFolder = './nft_parts/',
    fs = require('fs'),
    os = require('os'),
    multer  = require('multer'),
    upload = multer({ dest: "uploads/" }),
    unzipper = require('unzipper'),
    port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/get_main_folders', function (req, res) {
    fs.readdir(mainFolder, (err, files) => {
        res.send(files)
        console.log(files)
    });
})

app.post('/get_folders', function (req, res) {
    console.log(mainFolder+'/'+req.body.folder)
    fs.readdir(mainFolder+'/'+req.body.folder, (err, files) => {
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

app.post('/upload', upload.single('file'), async function(req, res) {
    try{
        console.log('/upload')
        // const title = req.body.title;
        const file = req.file;
      
        console.log(file.originalname);
        console.log(file);
        // file.pipe(unzipper.Extract({ path: 'files' }));
    
        await fs.createReadStream(file.path).pipe(unzipper.Extract({ path: 'nft_folders' }));
        await fs.unlinkSync(file.path)

        await new Promise(r => setTimeout(r, 1000));

        console.log('show folders')
        fs.readdir(mainFolder, (err, files) => {
            res.send(files)
            console.log(files)
        });
    }catch(e){
        console.log(e)
    }

});

app.post('/deleteFolder', async function(req, res) {
    console.log(req.body.folderName)
    await fs.rmSync(mainFolder+'/'+req.body.folderName, { recursive: true, force: true });

    await new Promise(r => setTimeout(r, 1000));

    fs.readdir(mainFolder, (err, files) => {
        res.send(files)
        console.log(files)
    });
})

 let server = app.listen(port, function () {
    let host = server.address().address
    let port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })