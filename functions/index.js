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



let url = "smtps://deliverysamasapp%40gmail.com:"+encodeURIComponent('csztmuznaqymzyis') + "@smtp.gmail.com:465";
let transporter = nodemailer.createTransport(url);

// exports.enviarEmail = functions.https.onRequest((req, res) => {
exports.EnviandoEmail = functions.firestore.document('/movimentacao/{pushId}').onUpdate((snapshot, context) => {
        // cors(req, res, () => {
           //let remetente = '"Kleber" <dev.kleber@gmail.com>';
            let remetente = snapshot.data().usuario.email;
           let assunto = 'Movimentação de equipamento';
            let destinatarios = snapshot.data().usuario.email+',dev.kleber@sanepar.com.br';
            let corpo = 'corpo teste';
            let corpoHtml =  snapshot.data().informacoes.identificação + 
                "<br>Retirado para " + 
                snapshot.data().informacoes.gerencia + " " +
                snapshot.data().informacoes.localidade + " " +
                snapshot.data().informacoes.unidade + 
                " por " + snapshot.data().informacoes.resposavel
                "<br>\n" +
                "<br>Enviado automáticamente através do sistema https://ssegemsd.web.app";


            let email = {
                from: remetente,
                to: destinatarios,
                subject: assunto,
                text: corpo,
                html: corpoHtml,
                //attachments: [{ // Basta incluir esta chave e listar os anexos
               //     filename: 'teste.pdf', // O nome que aparecerá nos anexos
             //       path: 'https://firebasestorage.googleapis.com/v0/b/sse-eletromecanica.appspot.com/o/ASE.pdf?alt=media&token=19c3a7b2-f4ed-4669-97ca-5af9267519d0' // O arquivo será lido neste local ao ser enviado
             //   }]
            };

            transporter.sendMail(email, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Mensagem %s enviada: %s', info.messageId, info.response);
            });
        // });
});







// função chamada para buscar no bd as imagens e baixar como Base64 para utilizar no pdfMaker

const imageToBase64 = require('image-to-base64');

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
