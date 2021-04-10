const Handlebars = require('handlebars');
module.exports = {
    sum: (a,b) => a+b,
    sortable: (field, sort) =>{
        const sortType = field === sort.column && ['asc','desc','default'].includes(sort.type) ? sort.type : 'default';
        const icons ={
            default: 'oi oi-elevator',
            asc: 'oi oi-arrow-thick-top',
            desc: 'oi oi-arrow-thick-bottom'
        }

        const types ={
            default: 'desc',
            asc: 'desc',
            desc: 'asc'
        }
        const icon = icons[sortType]
        const type = types[sortType]
        
        const href = Handlebars.escapeExpression(
            `?_sort&column=${field}&type=${type}`
        )
        const output = `<a href="${href}" style='color: black;'>
                            <span class="${icon}"></span> 
                        </a>`
        return new Handlebars.SafeString(output);
    },
    sender: (chats) =>{
       return chats[chats.length-1].idPerson
    },
    textChat: (chat) =>{
        if(chat.idUserFrom==chat.idUser){
            return `<div class="user-inbox inbox">
                        <div class="msg-header">
                            <p>${chat.text}</p>
                        </div>
                    </div>`
        }
        else {
            return `<div class="bot-inbox inbox">
                        <div class="icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="msg-header">
                            <p>${chat.text}</p>
                        </div>
                     </div>`
        }
        
    },

    discount: (discount) =>{
        if(discount){
            return "Giảm hết " + discount + "%"
        }
        else {
            return "Giảm món"
        }
    },
    countMessages: (notification) =>{
        if(notification==null) return "Không có thông báo nào";
        else {
            var count = notification.content
            count = parseInt(count)
            if(count<=9) return 'Bạn có ' + count + " tin nhắn mới ";
            else return 'Bạn có 9+ tin nhắn mới'
        }
    },
    countNotification: (notification) => {
        if(notification==null) return ''
        else{
            var count = notification.content
            count = parseInt(count)
            if(count<=9) return "+" + count
            else return '+9'
        }
    },
    toLocaleString: (number) => {
        number = parseInt(number)
        return number.toLocaleString()
    },
    btnUpdateFood: (id, idUser)=>{
        if(id==idUser){
            return `<button type="button" class="btn btn-danger" id='update-food'>
                        Sửa thông tin món ăn
                    </button>`
        }
        else {
            return;
        }
    },
    setImageProfile: (image)=>{
        if(image!=null&&image!=''){
            return image;
        }
        else {
            return `https://bootdey.com/img/Content/avatar/avatar7.png`
        }
    },
    displayVote: (userVote)=>{
        if(userVote){
            var vote =  0
            for(var i = 0; i < userVote.length; i++){
                vote += parseInt(userVote[i].vote)
            }
            vote = vote/userVote.length
            vote = Math.round(vote * 100) / 100
            return `<p style="color: #FFC107; margin: 0px 0px 0px 0px; font-size: 18px;" id='pVoteShowFood'>Vote : ${vote} 
                        <span style="color:#666666" id='spanVoteShowFood'>trên ${userVote.length} lượt đánh giá</span>
                    </p>`
                 
        }
        else{
            return `<p style="color: #FFC107; margin: 0px 0px 0px 0px; font-size: 18px;" id='pVoteShowFood'> Vote: 
                        <span style="color:#666666" id='spanVoteShowFood'>Chưa có lượt đánh giá nào</span>
                    </p>`
        }
    }, 
    displayStarVote: (vote)=>{
        var output = ''
        for(i = 0; i < 5; i++){
            if(i>=vote){
                output += '<i class="fas fa-star fa-star-vote" vote='+ (i+1)+'"></i>'
            }
            else{
                output += '<i class="fas fa-star fa-star-vote" style="color: #FD4" vote='+ (i+1)+'"></i>'
            }
        }
        return output
    },
    hiddenVote: (userVote)=>{
        var output = ''
        if(userVote){
            var vote =  0
            for(var i = 0; i < userVote.length; i++){
                vote += parseInt(userVote[i].vote)
            }
            output+= '<input type="hidden" value="'+ vote +'" id="countVote"></input>'
            output+= '<input type="hidden" value="'+ userVote.length +'" id="countUserVote"></input>'
            return output
        }  
        else{
            output+= '<input type="hidden" value="'+ 0 +'" id="countVote"></input>'
            output+= '<input type="hidden" value="'+ 0 +'" id="countUserVote"></input>'
            return output
        }
    },
    returnUser0ID: (user)=>{
        if(user[0])
            return user[0]._id
        else return ''
    },
    imageChat: (image)=>{
        if(image){
            return `<img src="${image}" class="rounded-circle user_img">`
        }
        else{
            return `<img src="https://bootdey.com/img/Content/avatar/avatar7.png" class="rounded-circle user_img">`
        }
    },

    getFirstChat: (chats, user)=>{
        if(chats.length!=0){
            if(chats[0].idUserFrom==user._id){
                return `<div class="bot-inbox inbox">
                            <div class="icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="msg-header">
                                <p>Chào quý khách</p>
                            </div>
                        </div>
                        <div class="bot-inbox inbox">
                            <div class="icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="msg-header">
                                <p>Quý khách đã chọn được món ăn ưa thích nào chưa?</p>
                            </div>
                        </div>`
            }
            else return;
        }
        else{
            return `<p style="text-align:center; font-size: 25px">Bạn chưa nhắn tin với ai</p>`
        }
    },

    getRestaurantName:(fullName, user)=>{
        if(user.restaurant){
            if(user.restaurant.restaurantName)
                return user.restaurant.restaurantName
            else{
                return fullName
            }
        }
        else {
            return fullName
        }
    },
    getButtonShip: (state)=>{
        if(state=='prepare'){
            return `<button type="button" class="btn btn-primary btn-ship"
                        style="padding: 5px 10px 5px 10px; text-transform:none;">Giao hàng
                    </button>`
        }
        else if(state=='shipping'){
            return `<button type="button" class="btn btn-primary btn-sold"
                        style="padding: 5px 10px 5px 10px; text-transform:none;">Hoàn thành
                    </button>`            
        }
        else return;
    },

    getButtonCancelled: (state, id)=>{
        if(state=='prepare'||state=='shipping'){
            return `<button type="button" class="btn btn-danger" 
                        data-toggle="modal" data-target="#delete-order" data-id="${id}"
                        style="margin-right: 5px; padding: 5px 10px 5px 10px; text-transform:none;">Hủy
                    </button>`
        }
        else return;
    },
    getTurnover_sold: (turnover, sold)=>{
        if(turnover==0){
            return 0;
        }
        else {
            var turnover_sold = turnover/sold
            turnover_sold = Math.round(turnover_sold)
            return turnover_sold.toLocaleString()
        }
    },
    getSalesRate: (countOrderSold, countOrderCancelled)=>{
        if(countOrderSold==0){
            return 'Chưa bán được đơn hàng nào'
        }
        else {
            var salesRate = (countOrderSold*100)/(countOrderCancelled+countOrderSold)
            salesRate = Math.round(salesRate * 100) / 100
            return salesRate+'%'
        }
    },

    getNumberVisitRestaurant_countOrder: (numberVisitRestaurant, countOrder)=>{
        if(countOrder==0){
            return 'Chưa có đơn hàng nào'
        }
        else {
            var salesRate = (countOrder*100)/(numberVisitRestaurant)
            salesRate = Math.round(salesRate * 100) / 100
            return salesRate+'%'
        }
    },
}