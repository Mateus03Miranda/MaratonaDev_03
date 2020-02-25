// configurando o servidor
const express=require("express");
const server=express();

// configurando o servidor para apresentar arquirvos estáticos
server.use(express.static("public"));

// habilitar o body do formulário
server.use(express.urlencoded({extended:true}));

// configurar a conexão com o banco de dados
const Pool=require('pg').Pool;
const db=new Pool({
    user:'postgres',
    password:'b1admin',
    host:'localhost',
    port:5432,
    database:'doe'
});

// configurando a template engine
const nunjucks=require("nunjucks");
nunjucks.configure("./",{
    express:server,
    noCache:true
});

// configurando a apresentação da página
server.get("/",function(req,res){
    db.query("select name,blood from donors",function(err,result){
        if(err)
            return res.send("Erro no banco de dados");
            const donors=result.rows;
            return res.render("index.html",{donors});
    });
});

server.post("/",function(req,res){
    // Pegar dados do formulário
    const {name}=req.body;
    const {email}=req.body;
    const {blood}=req.body;
    // coloco valores dentro do banco de dados
    db.query(`insert into donors(name,email,blood) values('${name}','${email}','${blood}')`,function(err){
        // Fluxo de erro
        if(err)
            return res.send("Erro no banco de dados");
        //Fluxo ideal    
        return res.redirect("/");
    });
});

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000);