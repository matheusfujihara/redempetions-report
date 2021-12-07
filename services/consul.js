var axios = require('axios');

async function tokenAcess() {
    let data;
    await axios.post(`http://api.premmiar.com.br/v1/login`, {}, {
        auth: {
            username: 'matheus.fujihara',
            password: 'Matheus@1302'
        }
    })
        .then(res => {
            data = res.data.data.idToken.jwtToken;
        });

    return data;
}
module.exports = { tokenAcess }