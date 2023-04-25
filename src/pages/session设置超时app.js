

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

app.use(cookieParser());

app.use(session({
    secret: config.sessionCfg.secret, 
    cookie: {
        httpOnly: true,
        secure: false,  // true 只在 https 模式下支持
        maxAge: 1000 * 60*10,//10分钟
        // domain: 'test.com',
        // path: '/'
    },

    //rolling: true,
    resave:false,//true
    saveUninitialized: true,
    name: 'logtoken',
    
    //store: config.RedisCfg.en ? new RedisStore(config.RedisCfg) : null,
}));



//app.use(express.static(path.join(__dirname, config.static_path)));
app.use(express.static(path.join(__dirname, 'public')));
//定义一个session中间件
const sessionChecker=(req,res,next)=>{
        //logFile.debug('session:',req.session);
        let cookie = {} 
        const cookieStr=req.headers['cookie']||'';
         cookieStr.split(';').forEach(item => { 
            if (!item) { return } ;
        const arr = item.split('=') ;
        const key = arr[0].trim(); 
        const val = arr[1].trim();
         cookie[key] = val;
        });
        //if(req.path==='/login' || req.path.startsWith('/'+config.static_path)){
			//首次登陆和静态文件不拦截
		if(req.path==='/login' || req.path.startsWith('/public')){
           return next();
        }
        if(cookie['logtoken'] === undefined){
           const tempObj= {
                data: [],
                detail: "success!",
                result: 301,
               } 
			   //返回301状态码，前端接口判断回到登录页
              return res.send(tempObj);                     
        }
        next();
}
//拦截所有请求如果session不存在就回到登录页
app.use(sessionChecker);