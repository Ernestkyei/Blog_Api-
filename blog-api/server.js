const express = require('express');
const userRoute = require('./routes/user/userRoute');
const postRouter = require('./routes/post/postRoute');
const categoryRoute = require('./routes/category/categoryRoute');
const commentRoute = require('./routes/comment/commentRoute');
const globalErrorHandle = require('./middlewares/globalErrorHandle');
const isAdmin = require('./middlewares/isAdmin');
require('dotenv').config();
constdbConnect = require('./config/dbConnect');





const app = express();
app.use(express.json()); //pass incoming payload

//middlewares
const userAuth = {
    isLogin: true,
    isAdmin: false,
};

app.use((req, res, next) =>{  
    if(userAuth.isLogin){
        next();
        
    }else{
        return res.json({
            message: "Invalid login credentials"
        })
    }

   
})

// app.use(isAdmin);

// user route
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/comment', commentRoute);



// error handling after the route



//Error handles middleware
app.use(globalErrorHandle);



//404 Error
app.use("*", (req, res) =>{    
    res.status(404).json({
        message:`${req.originalUrl} - Route not Found`
    })
    
})


//Listen to server
const PORT = process.env.PORT || 7000;
app.listen(PORT, console.log(`server is up and runing on ${PORT}`))