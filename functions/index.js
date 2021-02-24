const functions = require('firebase-functions');
const admin = require('firebase-admin');

const Sentry = require('@sentry/node');
 Sentry.init({ dsn: 'https://ea59a4c624de44f79e07c8a2001fea40@o362766.ingest.sentry.io/5196753' });

// const express = require('express');
// const app = express();
// const cors = require('cors');
//https://expressjs.com/en/resources/middleware/cors.html


admin.initializeApp();

// app.use(cors({ origin: true }));

const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

const db = admin.firestore();
// const empresaService = require('./services/empresa.service');



let url = "smtps://kleber.santos%40sanepar.com.br:"+encodeURIComponent('') + "@smtp.gmail.com:465";
let transporter = nodemailer.createTransport(url);

// exports.enviarEmail = functions.https.onRequest((req, res) => {
exports.EnviandoEmail = functions.firestore.document('/movimentacao/{pushId}').onCreate((snapshot, context) => {
        // cors(req, res, () => {
           //let remetente = '"Kleber" <dev.kleber@gmail.com>';

            let remetente = snapshot.data().usuario.email;
           let assunto = 'Movimentação de equipamento';
            let destinatarios = snapshot.data().usuario.email+',kleber.santos@sanepar.com.br';
            let corpo = 'corpo teste';
            let corpoHtml =  snapshot.data().informacoes.identificacao + 
                "<br>RETIRADO PARA " + 
                snapshot.data().informacoes.gerencia + " " +
                snapshot.data().informacoes.localidade + " " +
                snapshot.data().informacoes.unidade + " " +
                snapshot.data().informacoes.ponto + 
                " POR " + snapshot.data().informacoes.responsavel +
                " - OBS: " + snapshot.data().informacoes.obs +
                "<br><br>Enviado automáticamente através do sistema https://ssegemsd.web.app";


            let email = {
                from: remetente,
                to: destinatarios,
                subject: assunto,
                text: corpo,
                html: corpoHtml
                //attachments: [{ // Basta incluir esta chave e listar os anexos
               //     filename: 'teste.pdf', // O nome que aparecerá nos anexos
             //       path: 'https://firebasestorage.googleapis.com/v0/b/sse-eletromecanica.appspot.com/o/ASE.pdf?alt=media&token=19c3a7b2-f4ed-4669-97ca-5af9267519d0' // O arquivo será lido neste local ao ser enviado
             //   }]
            };
            console.log('email sendo enviado', email);
            transporter.sendMail(email, (error, info) => {
                if (error) {
                    console.log(error)
                    //return error;
                }
                console.log('Mensagem %s enviada: %s', info.messageId, info.response);
            });
        // });
});


var _ = require('lodash');
  //https://qastack.com.br/programming/31683075/how-to-do-a-deep-comparison-between-2-objects-with-lodash
  //https://www.npmjs.com/package/lodash

exports.AtualizaRme = functions.firestore.document('/rme/{pushId}').onUpdate((change, context) => {
  // console.log(change)
  //console.log(change.before)
  var RMEbefore = change.before.data()
  var RMEafter = change.after.data()
  
  //console.log('depois: ', RMEafter)
  //console.log('separando ooooooooooooooo: ', RMEafter.SERVICO)
  //console.log('usuario ', context)
  //console.log('usuario2 ', context.usuario)


  let differences = function (newObj, oldObj) {
        return _.reduce(newObj, function (result, value, key) {
        if (!_.isEqual(value, oldObj[key])) {
            //console.log(value, Array.isArray(value))
            if (_.isArray(value)) {
            result[key] = []
            _.forEach(value, function (innerObjFrom1, index) {
                if (_.isNil(oldObj[key][index])) {
                result[key].push(innerObjFrom1)
                } else {
                let changes = differences(innerObjFrom1, oldObj[key][index])
                if (!_.isEmpty(changes)) {
                    result[key].push(changes)
                }
                }
            })
            } else if (Array.isArray(value)) { //(_.isObject(value)) {
            result[key] = differences(value, oldObj[key])
            } else {
            result[key] = value
            }
        }
        return result
        }, {})
  }

    //  console.log(antes.chave1.prop1_3, depois.chave1.prop1_3)
  var antes = differences(RMEbefore, RMEafter);
  var depois = differences(RMEafter, RMEbefore);
  // console.log('antes', antes);
  //console.log('depois', depois);
  if(depois.log){
    //para não gerar um loop de atualização de log
    console.log(depois.log)
  } else {
      const inicializandoLog = 'Alterado: '

      var log = inicializandoLog

      if(depois.solicitante){
        log = log+antes.solicitante+'->'+depois.solicitante+', '
      }
      if(depois.status){
        log = log+antes.status+'->'+depois.status+', '
      }
      if(depois.OSE){
        if(depois.OSE.localidade){
          log = log+antes.OSE.localidade+'->'+depois.OSE.localidade+', '
        }
        if(depois.OSE.OS_CODIGO){
          log = log+antes.OSE.OS_CODIGO+'->'+depois.OSE.OS_CODIGO+', '
        }
        if(depois.OSE.unidade){
          log = log+antes.OSE.unidade+'->'+depois.OSE.unidade+', '
        }
        if(depois.OSE.ponto){
          log = log+antes.OSE.ponto+'->'+depois.OSE.ponto+', '
        }
      }
      if(depois.EQUIPAMENTO){
        if(depois.EQUIPAMENTO.descricao){
          log = log+antes.EQUIPAMENTO.descricao+'->'+depois.EQUIPAMENTO.descricao+', '
        }
        if(depois.EQUIPAMENTO.identificacao){
          log = log+antes.EQUIPAMENTO.identificacao+'->'+depois.EQUIPAMENTO.identificacao+', '
        }
      }
      if(depois.SERVICO){
        if(depois.SERVICO.justificativa){
          log = log+antes.SERVICO.justificativa+'->'+depois.SERVICO.justificativa+', '
        }
        if(depois.SERVICO.consequencia){
          log = log+antes.SERVICO.consequencia+'->'+depois.SERVICO.consequencia+', '
        }
      }
      if(depois.MATERIAL){
        if(Array.isArray(depois.MATERIAL)){
          log = log+' Materiais: '
          depois.MATERIAL.forEach(v => {
            if(v.cod){
              log= log+v.cod+'-'
            }
            if(v.descricao){
              log= log+v.descricao+'-'
            }
            if(v.categoria){
              log= log+v.categoria+'-'
            }
            if(v.requisitado){
              log= log+v.requisitado+'-'
            }
            if(v.comprado){
              log= log+v.comprado+'-'
            }
            if(v.devolvido){
              log= log+v.aplicado+'-'
            }
            if(v.uf){
              log= log+v.uf+'-'
            }

            log = log+' | '
          })
        }
        if(depois.SERVICO){
          if(depois.SERVICO.justificativa){
            log = log+antes.SERVICO.justificativa+'->'+depois.SERVICO.justificativa+', '
          }
          if(depois.SERVICO.consequencia){
            log = log+antes.SERVICO.consequencia+'->'+depois.SERVICO.consequencia+', '
          }
        }

      }

      if(inicializandoLog !== log){ // para quando acontece o update sem alteração
        if(RMEafter.updatedUser){
          log = log+' Por '+RMEafter.updatedUser
        } 
        //db.collection('rme').doc('amHwmuly3ndW4JHdZ2dH').update({"status" : status, "log_aceito" : date});
      
        db.collection('rme').doc(context.params.pushId).update({
            "log" : admin.firestore.FieldValue.arrayUnion({"createdAt": context.timestamp, "descricao": log})
        });
      }

  }
});







// função chamada para buscar no bd as imagens e baixar como Base64 para utilizar no pdfMaker

const imageToBase64 = require('image-to-base64');
const { Console, timeStamp } = require('console');

exports.solicitacaoImgBase64 = functions.https.onCall(async (data, context) => {
    // console.log('context1111111114:', context.rawRequest.ip);
    // console.log('context1111111333:', context.rawRequest.headers["user-agent"]);
    console.log('dentro do pagamento saddsad ada', context.auth);
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'Você não está autenticado');
    } else {
        try {
        var solicitacao =  await db.collection('solicitacao').doc(data.uid).get()
            .then(doc => {
                if (!doc.exists) {
                console.log('No such document!');
                return null
                } else {
                return doc.data();
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });  
            var imagens = [''];
            
            if(solicitacao.img){
                switch(solicitacao.img.length){
                    case 1: 
                        imagens[0] = await imageToBase64(solicitacao.img[0]);
                        break;
                    case 2:
                        imagens[0] = await imageToBase64(solicitacao.img[0]);
                        imagens.push(await imageToBase64(solicitacao.img[1]));
                        break;
                    case 3:
                        imagens[0] = await imageToBase64(solicitacao.img[0]);
                        imagens.push(await imageToBase64(solicitacao.img[1]));
                        imagens.push(await imageToBase64(solicitacao.img[2]));
                        break;
                    case 4:
                        imagens[0] = await imageToBase64(solicitacao.img[0]);
                        imagens.push(await imageToBase64(solicitacao.img[1]));
                        imagens.push(await imageToBase64(solicitacao.img[2]));
                        imagens.push(await imageToBase64(solicitacao.img[3]));
                        break;
                    case 5:
                        imagens[0] = await imageToBase64(solicitacao.img[0]);
                        imagens.push(await imageToBase64(solicitacao.img[1]));
                        imagens.push(await imageToBase64(solicitacao.img[2]));
                        imagens.push(await imageToBase64(solicitacao.img[3]));
                        imagens.push(await imageToBase64(solicitacao.img[4]));
                        break;
                    default:
                        imagens[0] = await imageToBase64(solicitacao.img[0])
                        imagens.push(await imageToBase64(solicitacao.img[1]));
                        imagens.push(await imageToBase64(solicitacao.img[2]));
                        imagens.push(await imageToBase64(solicitacao.img[3]));
                        imagens.push(await imageToBase64(solicitacao.img[4]));
                        imagens.push(await imageToBase64(solicitacao.img[5]));
                        break;
                }
                    return imagens;
                } else {
                    return imagens;
                }
        } catch (error) {
            return {cod: 'erro', descricao: 'Erro no salvar cach', error};
        }
    }
});





exports.mgesAnalise = functions.https.onCall(async (data, context) => {
 // console.log('usuário autenticado', context.auth);
  if (!context.auth) {
      throw new functions.https.HttpsError('failed-precondition', 'Você não está autenticado');
  } else {
    try {
      console.log('chegou', data)
/*
      var mge =  await db.collection('mge').where('OSE.loc', '==', 'VYG1').get().then(doc => {
        if (!doc.exists) {
        console.log('No such documentSSSSSSSSSSSSS!');
        return null
        } else {
          console.log('doccccccc', doc.data())
        return doc.data();
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });  
      console.log('mges RETORNOWWWWWWWWW:',mge)
*/
      var mges =  await db.collection('mge').where('OSE.loc', '==', 'VYG1').where('status', '==', '7-executada').get().then(querySnapshot =>{
        var mgesSnapshot = []
        if(querySnapshot){
          querySnapshot.forEach(function(doc) {
            //console.log(doc.id, " => ", doc.data());
            mgesSnapshot.push(doc.data())
          })
        }
       // console.log( 'retornouuu', mgesSnapshot)
        return mgesSnapshot
      }).catch(err => {
          console.log('Error getting document', err);
      });

/*
      if (mgesSnapshot.empty) {
        console.log('No MGE matching documents.');
      }  
      */
      //console.log('retornouuuu ', mges)
    

      //return {mges: mgesSnapshot}; //precisa corrigir o retorno

      //console.log('mges RETORNO:',mges)
      var correntes = [[],[],[],[],[],[],[],[]];
      var horimetros = [[],[],[],[],[],[],[],[]];
            var horimetros = [[],[],[],[],[],[],[],[]];
      var datas = []
    
  
      var qtdCMBCorrente = 1
      var qtdCMBHorimetro = 1
        console.log('21',)
      mges.forEach(function(element) {

       // console.log('equipamentos element', element.MGE.equipamentos)
       
        
        if(element.MGE){
          if(element.MGE.equipamentos){
            for (let index = 0; index < 6; index++) {     
  
              //corrente    
              if(element.MGE.equipamentos[index]){
  
                if(element.MGE.equipamentos[index].a){
                  const cmbNum = element.MGE.equipamentos[index].ordem.split("-", 2)
                  if(element.MGE.equipamentos[index].a !== null && (parseInt(cmbNum[1]) > qtdCMBCorrente)){
                    qtdCMBCorrente = parseInt(cmbNum[1]); 
                  }
                  correntes[index].push(element.MGE.equipamentos[index].a)
                } else if(element.MGE.equipamentos[index].corrente){
                  const cmbNum = element.MGE.equipamentos[index].ordem.split("-", 2)
                  if(element.MGE.equipamentos[index].corrente !== null && (parseInt(cmbNum[1]) > qtdCMBCorrente)){
                    qtdCMBCorrente = parseInt(cmbNum[1]); 
                  }
                  correntes[index].push(element.MGE.equipamentos[index].corrente)
                } else {
                  correntes[index].push(null)
                }
              } else {
                correntes[index].push(null)
              }
  
  
              //horimetro
              if(element.MGE.equipamentos[index]){
                if(element.MGE.equipamentos[index].horimetro){
                  const cmbHorimetroNum = element.MGE.equipamentos[index].ordem.split("-", 2)
                  if(element.MGE.equipamentos[index].horimetro !== null && (parseInt(cmbHorimetroNum[1]) > qtdCMBHorimetro)){
                    qtdCMBHorimetro = parseInt(cmbHorimetroNum[1]); 
                  }
                  horimetros[index].push(element.MGE.equipamentos[index].horimetro)
                } else {
                  horimetros[index].push(0)
                }
              } else {
                horimetros[index].push(0)
              }
            }
          }
        }
 
 console.log('26')

 // essa parte está funcionando más está repetindo a data várias vezes no final
        var dataLocalInic = new Date(element.OSE.data_execucao.seconds*1000);
        var dia = dataLocalInic.getDate();
        var mes = dataLocalInic.getMonth();
        var ano = dataLocalInic.getFullYear();
        datas.push(dia+'/'+(mes+1)+'/'+ano)
       
      });
  
  
      console.log('27')
  
    //  horimetros.splice(qtdCMBHorimetro, 8-qtdCMBHorimetro)//remover os arrays que não possuem medição
  
    //  correntes.splice(qtdCMBCorrente, 8-qtdCMBCorrente)
      console.log('horimetros', qtdCMBHorimetro, horimetros);
  
      console.log('corrente', qtdCMBCorrente, correntes)
      console.log('linecharts',  datas)
      //return {mges: mges, datas: datas}
      return {
        qtdCMBHorimetro: qtdCMBHorimetro,
        qtdCMBCorrente: qtdCMBCorrente,
        horimetros: horimetros,
        correntes: correntes,
        datas: datas
      } 

    } catch (error) {
      console.log(error)
      return {cod: 'erro2', descricao: error};
    } 

  }
})













//para fazer upload de grandes planilhas, em teste
var XLSX = require('xlsx')

var xlsx = require('node-xlsx').default;
// Or var xlsx = require('node-xlsx').default;

exports.exportaEquipamentos = functions.https.onCall(async (data, context) => {
    // console.log('context1111111114:', context.rawRequest.ip);
    // console.log('context1111111333:', context.rawRequest.headers["user-agent"]);
    console.log('dentro do pagamento saddsad ada', context.auth);
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'Você não está autenticado');
    } else {
        try {
            console.log('chegou', data)


            var buf = fs.readFileSync('https://firebasestorage.googleapis.com/v0/b/sse-eletromecanica.appspot.com/o/equipamentos%2FEQUIPAMENTOS%20ALMOXARIFADO%20COM%20DATA%20DA%20ULTIMA%20MOVIMENTA%C3%87%C3%83O.xlsx?alt=media&token=26f3f9fb-4d3a-4fee-a2cf-80b431fe9fb6');
            
            var wb = XLSX.read(buf, {type:'buffer'});

            console.log('wb teste', wb)


            
            // Parse a buffer
            const workSheetsFromBuffer = xlsx.parse(fs.readFileSync('https://firebasestorage.googleapis.com/v0/b/sse-eletromecanica.appspot.com/o/equipamentos%2FEQUIPAMENTOS%20ALMOXARIFADO%20COM%20DATA%20DA%20ULTIMA%20MOVIMENTA%C3%87%C3%83O.xlsx?alt=media&token=26f3f9fb-4d3a-4fee-a2cf-80b431fe9fb6'));
            console.log('workSheetsFromBuffer', workSheetsFromBuffer)
            // Parse a file
            const workSheetsFromFile = xlsx.parse( 'https://firebasestorage.googleapis.com/v0/b/sse-eletromecanica.appspot.com/o/equipamentos%2FEQUIPAMENTOS%20ALMOXARIFADO%20COM%20DATA%20DA%20ULTIMA%20MOVIMENTA%C3%87%C3%83O.xlsx?alt=media&token=26f3f9fb-4d3a-4fee-a2cf-80b431fe9fb6');
            console.log('workSheetsFromFile', workSheetsFromFile)
               /*  let workBook = null;
                let jsonData = null;
                const reader = new FileReader();
                const file = ev.target.files[0];
                reader.onload = (event) => {
                  const data = reader.result;
                  workBook = XLSX.read(data, { type: 'binary' });
                  jsonData = workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    initial[name] = XLSX.utils.sheet_to_json(sheet);
                    return initial;
                  }, {});
                  console.log(jsonData);
                  if(jsonData.Plan1){
                    console.log(jsonData.Plan1);
            
                    this.mgeService.addMges(jsonData.Plan1, this.usuario, this.formMge.value.periodo);
                    this.planilha = jsonData.RO01;
                    const dataString = JSON.stringify(jsonData);
                    // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
                  } else {
                    alert('Nome da planilha precisa ser Plan1')
                  }
             */
   
              

            return data
                     
        } catch (error) {
            return {cod: 'erro', descricao: 'Erro no salvar cach', error};
        }
    }
});

