const { Router } = require("express");
const webpush = require('web-push');
const router = Router();
const nodemailer = require("nodemailer");
const userEmail = "empresa@sastrerialospajaritos.proyectowebuni.com";

const vapidKeys = {
  "publicKey": "BAN5l7dvIHSrQfUEhwYeFeTUPc5mZ8tR2Xv3H2y7-ytI1vXh2hoGlj19PCVS06-1n4SJ8JW2_RTuMovcm6FO2Q8",
  "privateKey": "A6Ojd2EiMF5xuUErqNY_yD-jo6t153Za5GhH4d5Jcpc"
}

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: userEmail , // generated ethereal user
    pass: "LosPajaritos/3", // generated ethereal password
    // user: "sastreria.pajaritos@gmail.com", // generated ethereal user
    // pass: "nwuamuhuccitmlol", // generated ethereal password
  },
});

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

transporter.verify().then(() => {
  console.log("listo para enviar emails");
});

router.post("/send-push-notification", async (req, res) => {
  const { token, type } = req.body;

    const payloads = [
      {
        "name": "abandono_carrito",
        "notification": {
          "notification": {
            "title": "¡Completa tu compra!",
            "body": "Tu carrito espera",
            "vibrate": [100, 50, 100],
            "image":
              "https://sportstore.proyectowebuni.com/resources/cart.png",
            "actions": [
              {
                "action": "explore",
                "title": "Ir a mi carrito",
              },
            ],
          },
        },
      },
    ];

    const pushSubscription = token;

    const payload = payloads.find(payload => payload.name === type);
    if(!payload) return;

    console.log(payload)

    webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload.notification))
        .then(res => {
            console.log('Enviado !!');
        }).catch(err => {
            console.log('Error', err);
        })

    res.send({ data: 'Se envio subscribete!!' })
})

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/send-validate-email", async (req, res) => {
  const { email, id } = req.body;
  try {
    await transporter.sendMail({
      from: `Sastrería los Pajaritos ${userEmail }`,
      to: email,
      subject: "Comfirma tu cuenta",
      html: getCadenaValidateEmail(id),
    });
  } catch (error) {
    return res.status(400).json({ message: "Error al enviar email validator" });
  }
  res.status(200).json({});
});

router.post("/send-forgot-password", async (req, res) => {
  const { email, id } = req.body;
  try {
    await transporter.sendMail({
      from: `Sastrería los Pajaritos ${userEmail }`,
      to: email,
      subject: "Recuperación de contraseña",
      html: getCadenaForgotMail(id),
    });
  } catch (error) {
    return res.status(400).json({ message: "Error al enviar email", err : error });
  }
  res.status(200).json({});
});

function getCadenaForgotMail(id) {
  return `
<html>

<head>
  <style>
    table,
    td,
    div,
    h1,
    p {
      font-family: Arial, sans-serif;
    }
  </style>
</head>

<body style="margin: 0; padding: 0">
  <table role="presentation" style="
        width: 100%;
        border-collapse: collapse;
        border: 0;
        border-spacing: 0;
        background: #ffffff;
      ">
    <tr>
      <td align="center" style="padding: 0">
        <table role="presentation" style="
              width: 602px;
              border-collapse: collapse;
              border: 1px solid #cccccc;
              border-spacing: 0;
              text-align: left;
            ">
          <tr>
            <td
              style="padding: 30px 0 20px 0; background: #f89d9b; font-size: 24px; margin: 0 0 20px 0;font-family: Arial, sans-serif; color: #FFF; text-align: center;">
              <h1>
                <b>Los pajaritos</b><br>

              </h1>
              <h3>Sastrería</h3>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 30px 20px 30px">
              <table role="presentation" style="
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                  ">
                <tr>
                  <td style="padding: 0 0 36px 0; color: #153643">
                    <h1 style="
                          font-size: 24px;
                          margin: 0 0 20px 0;
                          font-family: Arial, sans-serif;
                        ">
                      <b>Recupera tu contraseña</b>
                    </h1>
                    <p style="
                          margin: 0 0 12px 0;
                          font-size: 16px;
                          line-height: 24px;
                          font-family: Arial, sans-serif;
                        ">
                      Hemos recibido una petición para la restauración de
                      contraseña de tu cuenta en
                      <b>Los pajaritos Satrería</b>, para continuar solo
                      tienes que hacer click en el enlace inferior.
                    </p>
                    <p style="
                          margin: 0;
                          font-size: 16px;
                          line-height: 24px;
                          font-family: Arial, sans-serif;
                        ">
                      <a href="http://sastrerialospajaritos.proyectowebuni.com/#/home/reset-password?id=${id}" style="color: #ee4c50; text-decoration: underline">Recuperar mi
                        contraseña</a>
                    </p>
                    <p style="
                          margin: 30px 0 0 0;
                          font-size: 16px;
                          font-family: Arial, sans-serif;
                        ">
                      Si usted no solicitó un restablecimiento de contraseña,
                      mo se requiere ninguna otra acción.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0">
                    <table role="presentation" style="
                          width: 100%;
                          border-collapse: collapse;
                          border: 0;
                          border-spacing: 0;
                        "></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background: #eeeff0">
              <table role="presentation" style="
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                    font-size: 9px;
                    font-family: Arial, sans-serif;
                  ">
                <tr>
                  <td style="padding: 0; width: 50%" align="left">
                    <p style="
                          margin: 0;
                          font-size: 14px;
                          line-height: 16px;
                          font-family: Arial, sans-serif;
                          color: #0000009e;
                        ">
                      &reg; Copyright, Los pajaritos Satrería 2023<br />
                    </p>
                  </td>
                  <td style="padding: 0; width: 50%" align="right">
                    <table role="presentation" style="
                          border-collapse: collapse;
                          border: 0;
                          border-spacing: 0;
                        ">
                      <tr>
                        <td style="padding: 0 0 0 10px; width: 38px">
                          <a href="#" style="color: #ffffff"><img src="https://assets.codepen.io/210284/tw_1.png"
                              alt="Twitter" width="38" style="height: auto; display: block; border: 0" /></a>
                        </td>
                        <td style="padding: 0 0 0 10px; width: 38px">
                          <a href="#" style="color: #ffffff"><img src="https://assets.codepen.io/210284/fb_1.png"
                              alt="Facebook" width="38" style="height: auto; display: block; border: 0" /></a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`;
}

function getCadenaValidateEmail(id) {
  return `
  <html>

  <head>
    <style>
      table,
      td,
      div,
      h1,
      p {
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  
  <body style="margin: 0; padding: 0">
    <table role="presentation" style="
          width: 100%;
          border-collapse: collapse;
          border: 0;
          border-spacing: 0;
          background: #ffffff;
        ">
      <tr>
        <td align="center" style="padding: 0">
          <table role="presentation" style="
                width: 602px;
                border-collapse: collapse;
                border: 1px solid #cccccc;
                border-spacing: 0;
                text-align: left;
              ">
            <tr>
              <td
                style="padding: 30px 0 20px 0; background: #f89d9b; font-size: 24px; margin: 0 0 20px 0;font-family: Arial, sans-serif; color: #FFF; text-align: center;">
                <h1>
                  <b>Los pajaritos</b><br>
  
                </h1>
                <h3>Sastrería</h3>
              </td>
            </tr>
            <tr>
              <td style="padding: 36px 30px 20px 30px">
                <table role="presentation" style="
                      width: 100%;
                      border-collapse: collapse;
                      border: 0;
                      border-spacing: 0;
                    ">
                  <tr>
                    <td style="padding: 0 0 36px 0; color: #153643">
                      <h1 style="
                            font-size: 24px;
                            margin: 0 0 20px 0;
                            font-family: Arial, sans-serif;
                          ">
                        Confirma tu email
                      </h1>
                      <p style="
                            margin: 0 0 12px 0;
                            font-size: 16px;
                            line-height: 24px;
                            font-family: Arial, sans-serif;
                          ">
                        Por favor tómate un segundo para asegurarte de que
                        tenemos tu dirección de correo electrónico correcta.
                        Solo tienes que hacer clic en el enlace inferior.
                      </p>
                      <p style="
                            margin: 0;
                            font-size: 16px;
                            line-height: 24px;
                            font-family: Arial, sans-serif;
                          ">
                        <a href="http://sastrerialospajaritos.proyectowebuni.com/#/home/singup-process?id=${id}"  style="color: #ee4c50; text-decoration: underline">Confirmar
                          email</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0">
                      <table role="presentation" style="
                            width: 100%;
                            border-collapse: collapse;
                            border: 0;
                            border-spacing: 0;
                          "></table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; background: #eeeff0">
                <table role="presentation" style="
                      width: 100%;
                      border-collapse: collapse;
                      border: 0;
                      border-spacing: 0;
                      font-size: 9px;
                      font-family: Arial, sans-serif;
                    ">
                  <tr>
                    <td style="padding: 0; width: 50%" align="left">
                      <p style="
                            margin: 0;
                            font-size: 14px;
                            line-height: 16px;
                            font-family: Arial, sans-serif;
                            color: #0000009e;
                          ">
                        &reg; Copyright, Los pajaritos Satrería 2023<br />
                      </p>
                    </td>
                    <td style="padding: 0; width: 50%" align="right">
                      <table role="presentation" style="
                            border-collapse: collapse;
                            border: 0;
                            border-spacing: 0;
                          ">
                        <tr>
                          <td style="padding: 0 0 0 10px; width: 38px">
                            <a href="http://www.twitter.com/" style="color: #ffffff"><img
                                src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38"
                                style="height: auto; display: block; border: 0" /></a>
                          </td>
                          <td style="padding: 0 0 0 10px; width: 38px">
                            <a href="http://www.facebook.com/" style="color: #ffffff"><img
                                src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38"
                                style="height: auto; display: block; border: 0" /></a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  
  </html>
  `;
}
module.exports = router;
