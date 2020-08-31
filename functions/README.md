## FUNCTIONS 

CONFIGURANDO:
   firebase login
   
   firebase init
   (tomar cuidado para não sobrescrever o index.js)
   
para submeter
   firebase deploy

## Dependenceias

sempre atualizar com esse código as dependencias
   npm i firebase-functions@latest firebase-admin@latest --save
   (latest: ultima versão)

upgrade node - https://www.npmjs.com/package/node/v/10.18.0
npm --save  i node@10.18.0

## Git

EMPURRAR/COMMIT NO GIT
Para add todas as alterações na lista de commit

    --PRIMEIRO
        git add *
        Montando o pacote de commit com comentário
        git commit -m "Comentário!" - feito pelo vc code

        ou

        confirma via VS code

    --SEGUNDO
        Puch empurrando para o Git
            git push https://github.com/Kleber2018/SSE-functions.git master
        Vai pedir usuário e senha do Git


PARA BAIXAR/CLONAR DO GIT
    git clone https://github.com/Kleber2018/SSE-functions.git



## Exemplos

gravar horario online e offline: https://github.com/firebase/functions-samples/blob/6c284a689c484ac4395fde1a8e8d6c2731705b55/presence-firestore/public/index.js

alterando array
https://medium.com/@thilanka.nuwan89/cloud-firestore-updating-object-arrays-be6ded13e76f