var axios = require('axios');
var qs = require('qs');
const consulKeys = require('../consul/ConsulKeys.json')

async function getToken(campaignId) {
    const campaignConfig = consulKeys.filter(item => item['campaignId'] === campaignId.toString())[0].configs
    let authuri = '';
    let clientId = '';
    let clientSecret = '';
    for (const config of campaignConfig) {
        if (config.key == `vertem-campaigns/${campaignId}/auth_url`) {
            authuri = Buffer.from(config.value, 'base64').toString('utf-8')
        }
        if (config.key == `vertem-campaigns/${campaignId}/clients_aws/participant/client_id`) {
            clientId = Buffer.from(config.value, 'base64').toString('utf-8')
        }
        if (config.key == `vertem-campaigns/${campaignId}/clients_aws/participant/client_secret`) {
            clientSecret = Buffer.from(config.value, 'base64').toString('utf-8')
        }
    }

    let dataAuth = `${clientId}:${clientSecret}`;
    let buff = new Buffer(dataAuth);
    let base64data = buff.toString('base64');


    var data = qs.stringify({
        'grant_type': 'client_credentials',
        'campaign_id': campaignId
    });
    var config = {
        method: 'post',
        url: authuri,
        headers: {
            'Authorization': `Basic ${base64data}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    try {
        return (await axios(config)).data.access_token
    } catch (error) {
        console.log(222, error)
        return '';
    }
}

module.exports = { getToken }
