const express = require("express");
const fs = require("fs");

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.get('/',(req,res)=>{})

app.get("/todos", (req, res) => {
  const showPending  = req.query.showpendng;

  fs.readFile("./store/todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Error occoured : ${err}` });
    } else {
      const todos = JSON.parse(data);
      if(showPending === "1"){
        // console.log(todos.filter(item=>item.id !== 1 ))
        return res.status(200).json({ todos: todos.filter(item => {return item['complete'] === false} ) });
      }
      else{ 
        // console.log(todos.filter(item=>item.id !== 1 ))
        return res.status(200).json({ todos: todos });
      }
    }
  });
});

app.put("/todos/:id/complete" , (req,res)=>{
    const id =  req.params.id;

  const findTodoById = (todos, id,)=>{
    for (let i =0; i<todos.length;i++){
      if (todos[i]['id'] === parseInt(id) ){
        return i 
      }
    }
    return -1
  }

    fs.readFile("./store/todos.json", "utf-8", (err, data) => {
        if (err) {
          return res.status(500).json({ message: `Error occoured : ${err}` });
        } else {
          const todos = JSON.parse(data);
          const todoIndex = findTodoById(todos,id)
          if(todoIndex != -1 ){

            todos[todoIndex].complete = true;
            fs.writeFile('./store/todos.json',JSON.stringify(todos)  ,()=>{
              return res.status(200).json({ message: "todos updated" ,todos: todos  }) 
            })
          }

          else return res.status(404).json({ message: "Index not found " })
        }
      });
})

app.post("/todos",(req,res)=>{
  if(!req.body.name){
      return res.status(400).send("Missing name")
  }
  
  fs.readFile("./store/todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Error occoured : ${err}` });
    } else {

      const todos = JSON.parse(data);
      const maxID = Math.max.apply(Math,todos.map(item=>{return item.id}))
      todos.push({
        "id":maxID+1,
        "name":req.body.name,
        "complete":false
      })
      fs.writeFile('./store/todos.json',JSON.stringify(todos)  ,()=>{
        return res.status(200).json({ message: "task added" ,todos: todos  }) 
      })
    }
  });
  


})

app.listen(8000, () => {
  console.log("Working on http://localhost:8000 ");
});