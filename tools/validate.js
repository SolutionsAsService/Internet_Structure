const fs = require("fs");


const data =
JSON.parse(
fs.readFileSync(
"data/internet.json"
)
);



const ids =
new Set(
data.nodes.map(
n=>n.id
)
);



let errors=[];


data.nodes.forEach(node=>{


(node.connections || []).forEach(connection=>{


const target =
typeof connection === "string"
?
connection
:
connection.target;



if(!ids.has(target)){


errors.push({

node:node.id,

missing:target

});


}


});


});



if(errors.length){


console.table(errors);

process.exit(1);


}


console.log(
"Internet database valid"
);
