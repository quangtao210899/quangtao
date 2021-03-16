const Food = require('../models/food')
const User = require('../models/user')
const Chat = require('../models/chat')

// thư viện xử lý lưu file
const multer = require("multer");

// thư viện xử lý ảnh
const Jimp = require('jimp');


async function resize(linkImage) {
    // Read the image.
    const image = await Jimp.read(linkImage);
    // Resize the image to width 1200 and heigth 800.
    await image.resize(1200, 800);
    // Save and overwrite the image
    await image.writeAsync(linkImage);
}

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      // Định nghĩa nơi file upload sẽ được lưu lại
      callback(null, "src/public/uploads");
    },
    filename: (req, file, callback) => {
      // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
      // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
      let math = ["image/png", "image/jpeg"];
      if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
        return callback(errorMess, null);
      }
   
      // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
      let filename = `${Date.now()}-QuangTao-${file.originalname}`;
      callback(null, filename);
    }
});
   
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({storage: diskStorage}).single("file");

class FoodController {
    // [GET]  /foods/:slug
    showFood(req,res,next){
        const username = req.session.username
        const password = req.session.password
        var user,food;
        Promise.all([
                Food.findOne({slug: req.params.slug}).lean(),
                User.findOne({username: username, password : password}).lean(),
            ])
            .then(([food1, user1]) => {
                user = user1
                food = food1
                if(!food.resize){
                    var image = "./src/public/"+ food.image
                    resize(image)
                    Food.updateOne({_id: food._id}, {resize: '1'}).then()
                }
            })
            .then(()=>{
                Chat.find({
                    $or: [
                        {$and: [{idUserFrom: user._id}, {idUserTo: food.idUser}, {idFood: food._id}]},
                        {$and: [{idUserFrom: food.idUser}, {idUserTo: user._id}, {idFood: food._id}]},
                    ]})
                    .lean()
                    .then((chats)=>{
                        for(var i = 0; i<chats.length;i++){
                            chats[i].idUser = user._id
                        }
                        res.render('./foods/showFood',{food,chats,user})
                    })
                    .catch(next)
            })
            .catch(next)
    }

    // [GET]  /foods/create
    create(req, res, next){
        res.render('foods/create', {hidden: 'hidden'})
    }

    // [POST]  /foods/store
    store(req, res, next){
        uploadFile(req, res, (error) => {
            // Nếu có lỗi thì trả về lỗi cho client.
            // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
            if (error) {
              return res.send(`Error when trying to upload: ${error}`);
            }
            // Không có lỗi thì lại render cái file ảnh về cho client.
            // Đồng thời file đã được lưu vào thư mục uploads
            // res.sendFile(`/uploads/${req.file.filename}`);

            const username = req.session.username
            const password = req.session.password
            User.findOne({username: username, password : password})
                .lean()
                .then(user=>{
                    req.body.idUser = user._id;
                    req.body.image = '/uploads/'+req.file.filename
                    // image = './src/public' +req.body.image
                    const food = new Food(req.body)
                    food.save()
                        .then(()=> res.redirect('/me/stored/foods'))
                        .catch(next)
                })
                .catch(next)
        });

    }

    // [PUT]  /foods/:id/edit
    edit(req,res,next){
        Food.findById(req.params.id)
            .lean()
            .then(food => {    
                res.render('./foods/edit', {food, hidden: 'hidden'})
            })
            .catch(next)
    }

    // [PUT]  /foods/:id
    update(req, res, next){
        console.log(req.body.length)
        if(req.body.foodName){
            Food.updateOne({ _id: req.params.id}, req.body)
                .then(()=> {
                    res.redirect('/me/stored/foods')
                })
                .catch(next) 
        }
        else {
            uploadFile(req, res, (error) => {
                if (error) {
                  return res.send(`Error when trying to upload: ${error}`);
                }
                req.body.image = '/uploads/'+req.file.filename
                Food.updateOne({ _id: req.params.id}, req.body)
                    .then(()=> {
                        res.redirect('/me/stored/foods')
                    })
                    .catch(next) 
            });           
        }
    }
    // [DELETE]  /foods/:id
    destroy(req,res,next){
        Food.delete({ _id: req.params.id})
                .then(()=> {
                    res.redirect('back')
                })
                .catch(next)
    }

    // [DELETE]  /foods/:id/force
    forceDestroy(req,res,next){
        //res.json(req.body);
        Food.deleteOne({ _id: req.params.id})
                .then(()=> {
                    res.redirect('back')
                })
                .catch(next)
    }

    // [PATCH] /foods/:id/restore
    restore(req,res,next){
        Food.restore({_id: req.params.id})
            .then(()=> res.redirect('back'))
            .catch(next)
    }

    // [POST] /foods/handle-form-actions-Store
    handleFormActionsStore(req,res,next){
        switch(req.body.action){
            case 'delete' : 
                Food.delete({ _id: {$in: req.body.foodIds} })
                    .then(()=> {
                        res.redirect('back')
                    })
                    .catch(next)
                break;
            default: 
                res.json({message: 'Action invalid!'});
        }
    }

    // [POST] /foods/handle-form-actions-Trash
    handleFormActionsTrash(req,res,next){
        switch(req.body.action){
            case 'restore' : 
                Food.restore({ _id: {$in: req.body.foodIds} })
                    .then(()=> {
                        res.redirect('back')
                    })
                    .catch(next)
                break;
            case 'deleteForce':
                Food.deleteMany({ _id: {$in: req.body.foodIds} })
                    .then(()=> {
                        res.redirect('back')
                    })
                    .catch(next)
                break;    
            default: 
                res.json({message: 'Action invalid!'});
        }
    }
}

module.exports = new FoodController();
