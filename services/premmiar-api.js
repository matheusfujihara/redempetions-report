var axios = require('axios');
var fileHelper = require('../util/file');
var consul = require('./Consul');

let allData = [];

async function getParticipants(projectId) {
    (await internalGetParticipants(projectId, 1, allData));
    fileHelper.createFile('participante', projectId, allData)
    return allData;
}

async function internalGetParticipants(projectId, pageNumber = 1, participantArray = []) {
    console.log(`[${projectId}] -Iniciou Busca de participantes da campanha pagina ${pageNumber}`)
    let quantity = 1000

    var config = {
        method: 'get',
        url: `https://api.premmiar.com.br/v1/participant/live/campaignLive/${projectId}?catalogId=&sortBy=Name&sortOrder=asc&pageNumber=${pageNumber}&pageSize=${quantity}&filter=`,
        headers: {
            'authority': 'api.premmiar.com.br',
            'p-oid': '096bd8cd-7141-4837-b3ed-9f7ba8686858',
            'authorization': 'Bearer ' + (await consul.tokenAcess())
        }
    };
    let returnData = []
    try {
        returnData = (await axios(config)).data.data.data
    } catch (error) {
        console.log('ERRO GET PARTICIPANT ==> ', error)
        await internalGetParticipants(projectId, (pageNumber + 1), allData)
    }
    count = JSON.parse(JSON.stringify(returnData.length));
    console.log(`[${projectId}] -Retornou ${count} na pagina ${pageNumber} `)
    if (returnData.length == 0) {
        allData = JSON.parse(JSON.stringify(participantArray))
    }

    if (returnData.length > 0) {
        const newarr = participantArray.concat(returnData)
        allData = JSON.parse(JSON.stringify(newarr))
        fileHelper.createFile('participante', projectId, allData)
        console.log(`[${projectId}] -Participantes encontrados ${newarr.length}`)
        await internalGetParticipants(projectId, (pageNumber + 1), newarr)
    }
}


async function getProjectConfiguration(projectId) {

    var config = {
        method: 'get',
        url: 'https://api.premmiar.com.br/v1/campaign/live/' + projectId,
        headers: {
            'authorization': 'bearer ' + (await consul.tokenAcess())
        }
    };

    return (await axios(config)).data.data
}


module.exports = { getParticipants, getProjectConfiguration }
