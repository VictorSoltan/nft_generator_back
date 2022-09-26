const express = require('express'),
    cors = require('cors');    
    app = express(),
    bodyParser = require('body-parser'); 
    mainFolder = './nft_folders'
    testFolder = './nft_parts/',
    fs = require('fs'),
    mongoose = require('mongoose'),
    multer  = require('multer'),
    upload = multer({ dest: "uploads/" }),
    unzipper = require('unzipper'),
    port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://VictorSoltan:Password1!@cluster0.dc7dp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (err) => {
  if(!err) console.log('db connected')
  else console.log(err)
})

const Stat = new mongoose.Schema({
  elemLinks: Array
  
})

const Favorites = new mongoose.Schema({
    traits: Object, 
    colorPreset: Number
    
  })

const NewModel = new mongoose.model("nftSchemes", Stat),
    NftFavorites = new mongoose.model("nftFavorites", Favorites)

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
    try{
        if(req.body.folder){
            console.log(mainFolder+'/'+req.body.folder)
            console.log('new build')
            fs.readdir(mainFolder+'/'+req.body.folder, (err, files) => {
                if(files.length){
                    const newFolders = files.filter(file => fs.lstatSync(mainFolder+'/'+req.body.folder+'/'+file).isDirectory())
                    res.send(newFolders)
                    console.log(newFolders)
                }
            });
        }
    }catch(err){
        console.log(err)
    }

})

app.post('/get_colors', function(req, res) {
    res.sendFile(`./${mainFolder}/${req.body.folder}/colors.json`, { root: __dirname });
})

app.post('/get_traits', function (req, res) {
    console.log(req.body.trait)
    fs.readdir(`./${mainFolder}/${req.body.folder}/${req.body.trait}`, (err, files) => {
        console.log(files)
        const newFiles = files.filter(file => file.split('.').pop() === 'svg')
        res.send(newFiles)
    })

})

app.post('/get_trait', function(req, res) {
    console.log(`./${mainFolder}/${req.body.folder}/${req.body.trait}/${req.body.file}`)
    res.sendFile(`./${mainFolder}/${req.body.folder}/${req.body.trait}/${req.body.file}`, { root: __dirname });
})

app.post('/upload', upload.single('file'), async function(req, res) {
    try{
        console.log('/upload')
        // const title = req.body.title;
        const file = req.file;
      
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
    try{
        console.log(req.body.folderName)
        await fs.rmSync(mainFolder+'/'+req.body.folderName, { recursive: true, force: true });

        await new Promise(r => setTimeout(r, 1000));

        fs.readdir(mainFolder, (err, files) => {
            res.send(files)
            console.log(files)
        });
    }catch(e){
        console.log(e)
    }
})

app.get('/elemLinks', async function(req, res){
    try{
        let currentFavorites = await NewModel.findOne({id: '632cf170a74e6d8e56cca145'})
        res.send(currentFavorites.elemLinks)
    }catch(e){
        console.log(e)
    }
})

app.get('/favorites', async function(req, res){
    try{
        let currentFavorites = await NftFavorites.find({})
        console.log('currentFavorites2 ', currentFavorites)
        res.send(currentFavorites)
    }catch(e){
        console.log(e)
    }
})

app.post('/save_elemLinks', async function(req, res){
    try{
        let currentElemLink = await NewModel.findOne({id: '632cf170a74e6d8e56cca145'})

        console.log('currentElemLink123 ', currentElemLink)
        if(currentElemLink){
            console.log('if')
            currentElemLink.elemLinks = req.body.elemLinks
            await currentElemLink.save()
        }else{
            console.log('else')
            const elemLink = NewModel({
                elemLinks: req.body.elemLinks,
            })
            elemLink.save()
        }
    }catch(e){
        console.log(e)
    }
})

app.post('/save_favorites', async function(req, res){
    try{
        const favorite = NftFavorites({
            traits: req.body.traits, 
            colorPreset: req.body.colorPreset
        })
        await favorite.save(function(err,elem) {
            res.send(elem);
         });
    }catch(e){
        console.log(e)
    }        
})

app.post('/delete_favorite', async function(req, res){
    console.log('delete_favorite ', req.body._id)
    try{
        await NftFavorites.findOneAndDelete({ _id: req.body._id });
    }catch(e){
        console.log(e)
    }        
})

 let server = app.listen(port, function () {
    let host = server.address().address
    let port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })