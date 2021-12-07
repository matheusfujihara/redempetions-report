const axios = require('axios');
const authCampaign = require('./authCampaign')

async function getOrders (participant, campaignId, startDate, endDate) {
    var config = {
        method: 'get',
        url: `https://api.ltm.digital/cloudloyalty/v1/purchases/me/orders?orderId=&startDate=${startDate}&endDate=${endDate}&offset=0&limit=100000`,
        headers: {
            'authorization': `Bearer ${await authCampaign.getToken(campaignId)}` , //TOKEN MKP
            'ocp-apim-subscription-key': 'e716f82a6f03484dba8c61bb07151f3a',
            'catalogId': participant.projectConfigurationId,
            'customerId': participant.clientId,
            'participantid': participant.id,
            'username': participant.login
        }
    }
    let result = {}
    try {
       result = (await axios(config)).data
       console.log(`PARTICIPANT: ${participant.login} -----------------`,)
       if (result) {
           let orders = result.orders;
           orders = orders.map(item => {
               return {
                   totalValue: item.totalItems,
                   shippingValue: item.orderTotalShippingValue,
                   paymentCardValue: item.orderPaymentDetailMoneyAndPoints,
                   parentOrderId: item.parentOrderId,
                   email: item.email
               }
           })
           result = {...result, orders}
           delete result.offset
           delete result.total
           delete result.limit
       }
    } catch (err) {
        console.log("DEU EROOO")
       result['error'] = err 
    }
    console.log('DEU CERTO')
    result = {...result, login: participant.login}
    return result
}



module.exports = { getOrders }