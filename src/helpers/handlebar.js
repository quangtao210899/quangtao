const Handlebars = require('handlebars')
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
    }
}