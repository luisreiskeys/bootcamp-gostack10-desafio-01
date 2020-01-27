const express = require('express');

const server = express();

server.use(express.json());

server.listen(3333);

const projects = [];
let reqCounter = 0;

server.use((req,res,next)=>{
    reqCounter++
    console.log(`${reqCounter} requests have been made so far`);
    return next()
})

function checkIfProjectExists(req,res,next){
    const {id} = req.params;
    const project = projects.find(item => item.id == id);
    if(!project){
        return res.status(400).json({error:'Project does not exists'})
    }
    req.id = id
    next();
}

server.post('/projects', (req,res)=>{
    const {id,title} = req.body;
    projects.push({id,title,tasks:[]});
    res.json(projects)
});

server.get('/projects',(req,res)=>{
    res.json(projects);
});

server.put('/projects/:id',checkIfProjectExists, (req,res)=>{
    const {title} = req.body;
    const project = projects.find(item => item.id == req.id);
    project.title = title;
    res.json(project);
});

server.delete('/projects/:id',checkIfProjectExists, (req,res)=>{
    const projectIndex = projects.findIndex(item => item.id == req.id);
    projects.splice(projectIndex,1);
    res.send();
});

server.post('/projects/:id/tasks',checkIfProjectExists, (req,res)=>{
    const {title} = req.body;
    const project = projects.find(item => item.id == req.id);
    project.tasks.push(title);
    res.json(project);
});