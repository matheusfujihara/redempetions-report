const axios = require("axios");
const qs = require('qs')

async function GetToken() {
    return await axios({
        method: 'post',
        url: 'https://login.microsoftonline.com/grupoltm.com.br/oauth2/token',
        data: qs.stringify({
            grant_type: 'client_credentials',
            client_id: 'e5aa160b-3313-43a4-85aa-00418b9b42ab',
            client_secret: '|msp25-U=^ja+^Y/]BE4QEyv(%n5>?/x{k8N]M|:tY%74Y$cy0&Qk)Q4M6JX&4)'
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
}

async function GetOrderBydDate(dtIni, dtEnd, campaignId) {
    const responseData = await GetToken();
    const url = `https://api.ltm.digital/order-api/v3/orders?campaignid=${campaignId}&begindate=${dtIni}&enddate=${dtEnd}&pagenumber=1&pagesize=99999999`;
    await axios.get(url, { headers: { Accept: "application/json", "Ocp-Apim-Subscription-Key": "9d28b0e5f1d84cfca7013ce277a890e9", "Authorization": "Bearer " + responseData.data.access_token } })
        .then(res => {
            if (url) {
                console.log('RESULTADO ===>', res.data.data[0])
                if (res.data.data.length === 0) {
                    console.log("no orders found :'(");
                } else {
                    console.log(`Pedidos encontrados: ${res.data.data.length},  De ${dtIni}  Até  ${dtEnd}`)
                }
            } else {
                console.log(res.data.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

module.exports = { GetOrderBydDate }