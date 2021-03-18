const Handlebars = require('handlebars');
const { render } = require('node-sass');
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
}