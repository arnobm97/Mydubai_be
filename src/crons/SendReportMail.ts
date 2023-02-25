

export const SendReportMail = async () => {
    const axios = require('axios').default;
    const sendMail = await axios.get('http://localhost:3001/report-mail');
    console.log(sendMail);
};