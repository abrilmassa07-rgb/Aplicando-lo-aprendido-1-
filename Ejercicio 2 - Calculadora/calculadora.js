const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let a=0;
let b=0;
let key;

function suma(a, b){
    return a+b;
}

function resta(a, b){
    return a-b;
}

function multiplicacion(a, b){
    return a*b;
}

function division(a, b){
    if (b===0){
        return "Operando no valido";
    } else{
        return a/b;
    }
}

rl.question ("Ingrese el primer numero: ", (resultado)=> {
    a=Number(resultado); 


rl.question ("Ingrese el segundo numero: ", (resultado)=> {
    b=Number(resultado);


rl.question ("Que operacion desea realizar?: +, -, *, /", (key)=>{
    switch (key) {
    case "+":   console.log(suma(a, b));
                break;
    case "-":   console.log(resta(a, b));
                break;
    case "*":   console.log(multiplicacion(a, b));
                break;
    case "/":   console.log(division(a, b));
                break;
}
        rl.close();
    });
  });
});