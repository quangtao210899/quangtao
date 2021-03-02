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
        console.log(sortType);
        
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
        if(chat.idPerson==chat.idUser){
            return `<p style="text-align: right;">${chat.text} </p>`
        }
        else {
            return `<p style="text-align: left;">${chat.text} </p>`
        }
        
    },
}