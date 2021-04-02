const Food = require('../models/food')
const User = require('../models/user')
const Chat = require('../models/chat')
const Order = require('../models/order')


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
        var user,food,Foods,pos, users=[];
            Promise.all([
                User.findOne({username: username, password : password}).lean(),
                Food.findOne({slug: req.params.slug}),
                User.find({}).lean(),
            ])
                .then(([user1, oldFood, users1]) => {
                    user = user1
                    // tìm những user đã nhắn tin vs người dùng
                    if(user1.idUserChats){
                        for(var i = 0; i < user1.idUserChats.length; i++){
                            for(var j = 0; j < users1.length; j++){
                                if(user1.idUserChats[i].idUser==users1[j]._id){
                                    users1[j].lastChat = user1.idUserChats[i].lastChat
                                    users.push(users1[j])
                                    break;
                                }
                            }
                        }
                    }
                    // tìm món ăn muốn xem
                    Food.find({idUser: oldFood.idUser})
                        .lean()
                        .then(foods=>{
                            Foods = foods
                            for(var i = 0; i < foods.length; i++){
                                if(!foods[i].resize){
                                    var image = "./src/public/"+ foods[i].image
                                    resize(image)
                                    Food.updateOne({_id: foods[i]._id}, {resize: '1'}).then()
                                }
                                if(foods[i].slug == req.params.slug){
                                    food = foods[i]
                                    pos = i
                                }
                            }
                        })
                        .then(()=>{
                            delete Foods[pos];
                        })
                        .then(()=>{
                            // tìm đoạn tin nhắn đầu tiên
                            if(users[0]){
                                Chat.find({
                                    $or: [
                                        {$and: [{idUserFrom: user._id}, {idUserTo: users[0]._id},]},
                                        {$and: [{idUserFrom: users[0]._id}, {idUserTo: user._id},]},
                                    ]})
                                    .lean()
                                    .then((chats)=>{
                                        var vote = 0;
                                        for(var i = 0; i<chats.length;i++){
                                            chats[i].idUser = user._id
                                        }
                                        if(food.userVote){
                                            for(var i = 0; i<food.userVote.length; i++){
                                                if(food.userVote[i].userId==user._id){
                                                    vote = food.userVote[i].vote
                                                    break
                                                }
                                            }
                                        }
                                        res.render('./foods/showFood',{Foods,food,chats,user, vote, users})
                                    })
                                    .catch(next)
                            }
                            else{
                                var chats = []
                                var vote = 0
                                if(food.userVote){
                                    for(var i = 0; i<food.userVote.length; i++){
                                        if(food.userVote[i].userId==user._id){
                                            vote = food.userVote[i].vote
                                            break
                                        }
                                    }
                                }
                                res.render('./foods/showFood',{Foods,food,chats,user, vote, users})
                            }
                        })
                        .catch(next)
                })
                .catch(next)
    }

    // [GET]  /foods/create
    create(req, res, next){
        res.render('foods/create', {hidden: 'none'})
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
                res.render('./foods/edit', {food, hidden: 'none'})
            })
            .catch(next)
    }

    // [PUT]  /foods/:id
    update(req, res, next){
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
                req.body.resize = ''
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

    // [POST] /foods/:ID/order   (thanh toán thực đơn)
    order(req,res,next){
        const username = req.session.username
        const password = req.session.password
        Promise.all([   
                Food.findOne({_id: req.params.id}).lean(),
                User.findOne({username: username, password : password}).lean()
            ])
            .then(([food,user])=>{
                var foods = [];
                if(req.body.foodname){
                    var foodname = req.body.foodname
                    var price = req.body.price
                    var quantity1 = req.body.quantity1
                    var id = req.body.id
                    var image = req.body.image
                    for(var i = 0; i < foodname.length; i++){
                        var newFood = {
                            _id: id[i],
                            foodName: foodname[i],
                            image: image[i],
                            price: price[i],
                            quantity: quantity1[i], 
                        }
                        foods.push(newFood)
                    }
                }
                User.findById(food.idUser).lean()
                    .then(userAuthorFood=>{
                        var AuthorFood = {
                            id: userAuthorFood._id,
                            fullname: `${userAuthorFood.firstname} ${userAuthorFood.lastname}`,
                            image: userAuthorFood.image,
                        }
                        const order = new Order({
                            idUser: user._id, imageMainFood: food.image,
                            idMainFood: food._id, foodName: food.foodName, 
                            price: food.price, quantity: req.body.quantity,
                            cost: req.body.cost, foods: foods,
                            authorFood: AuthorFood,
                        })
                        order.save()
                            .then(()=>{
                                req.session.userOrder = 'yes'
                                res.redirect('back')
                            })
                    })

            })
            .catch(next)
    }

    // [GET] /food?param
    food(req, res, next) {
        const username = req.session.username
        const password = req.session.password
        var user,foods;
        var query = req.query.type
        var textH2=''
        var activeFood=''
        var activeDrink =''
        var activeDessert=''
        if(query=='food') {
            textH2 = 'Danh sách đồ ăn'
            activeFood='active'
        }
        else if(query=='drink') {
            textH2 = 'Danh sách đồ uống'
            activeDrink='active'
            
        }
        else{
            textH2='Danh sách món tráng miệng'
            activeDessert='active'
        } 
        Promise.all([
                User.findOne({username: username, password : password}).lean(), 
                Food.find({type: query}).lean(),
            ])
            .then(([user1, foods1]) =>{
                user = user1
                foods = foods1
                for(var i = 0; i < foods.length; i++){
                    if(!foods[i].resize){
                        var image = "./src/public/"+ foods[i].image
                        resize(image)
                        Food.updateOne({_id: foods[i]._id}, {resize: '1'}).then()
                    }
                }

            })
            .then(()=>{
                res.render('./foods/typeFood',{user, foods, textH2,activeFood, activeDrink, activeDessert, home: 'fasle' })
            })
            .catch(next)
    }

}

module.exports = new FoodController();
