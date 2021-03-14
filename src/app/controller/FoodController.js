const Food = require('../models/food')
const User = require('../models/user')
const Chat = require('../models/chat')
const multer = require("multer");


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
        Promise.all([
                Food.findOne({slug: req.params.slug}).lean(),
                User.findOne({username: username, password : password}).lean(),
            ])
            .then(([food, user]) => {
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
        var image='';
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
                        .then(()=> res.redirect('/'))
                        .catch(next)
                })
                .catch(next)
        });

    }
}

module.exports = new FoodController();
