class SiteController {

    // [GET] /home
    home (req,res){
        res.render('home');
    }

    // [GET] /Search
    search (req, res){
        res.render('search');
    }
    
    // [POST] /search
    searchPost (req, res){
        console.log(req.body)
        res.send("Đã gửi thành công!")       
    }    

}


module.exports = new SiteController;