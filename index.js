const premmiarApi = require('./services/premmiar-api')
const serviceApiMan = require('./services/apiMan')
const testService = require('./services/test')
const fileHelper = require('./util/file')
const participants1 = require('./participante/70941.json')

main()
// test()

async function main () {
    let reports = []
    let campaignId = 70750;
    let startDate ='2021-10-01'
    let endDate ='2021-10-30'
    // let participants = await premmiarApi.getParticipants(campaignId)
    console.log(` TOTAL DE PARTICIPANTS: ---- ${participants1.length}`)
    let i = 0;
    for (const participant of participants1) {
        let result = await serviceApiMan.getOrders(participant, campaignId, startDate, endDate)
        reports.push(result)
        i++
        console.log(i)
    }

    fileHelper.createFile('reports', campaignId, reports)

}


async function test () {
    // let result = await testService.GetOrderBydDate('2020-10-01', '2020-10-07', 70750)
    let campaignId = 70750;
    let startDate ='2021-10-01'
    let endDate ='2021-10-30'

    let participant = {
        "id": 35819725,
        "name": "Matheus S Fujihara",
        "login": "36451115819",
        "cpf": "36451115819",
        "cnpj": null,
        "clientId": 40570,
        "projectId": 70750,
        "projectConfigurationId": 70862,
        "participantStatus": {
            "id": 1,
            "description": "Ativo"
        },
        "birthDate": "1996-09-16T03:00:00Z",
        "insertDate": "2021-03-08T16:05:29Z",
        "accountHolderId": 2040299280,
        "emails": [
            {
                "id": 272890552,
                "emailAddress": "matheus.fujihara@premmiar.com.br",
                "active": true,
                "emailTypeId": 1
            }
        ]
    }
    let reports = await serviceApiMan.getOrders(participant, campaignId, startDate, endDate)
    fileHelper.createFile('reports', campaignId, reports)
    console.log(reports)
}