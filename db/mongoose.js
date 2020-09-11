const mongoose = require('mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/shop", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })

mongoose.connect("mongodb://tahsinalmahi:Mahi1994@cluster0.tgcnd.mongodb.net/shop?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})