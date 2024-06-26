const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendPasswordReset = async (email, username, resetPasswordCode) => {
  try {
    const info = await transport.sendMail({
      from: `HOPE'S E-COMMERCE WEB-SERVICE <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<div>
            <div style="display: flex; align-items: center;">
                <img alt="Hope" style="height: 30px; margin-right: 8px;" src="https://res.cloudinary.com/dsyfkys0u/image/upload/v1712929359/nvrcuh4zvq7onpy1y7sw.png">
            </div>
            <br/>
            <p style="line-height: 1.2;">Hi ${username},</p>
            <p style="line-height: 1.2;">We've received a request to reset your password.</p>
            <p style="line-height: 1.5;">If you didn't make the request, just ignore this message. Otherwise, you can reset your password.</p>        
            <a href="localhost:5000/profile/change_password${resetPasswordCode}">
                <button style="font-weight: 500;font-size: 14px;cursor: pointer; background-color: blue; border: none; border-radius: 4px; padding: 12px 18px 12px 18px; color: white;">
                    Reset your password
                </button>
            </a>
            <br/>
            <br/>
            <p  style="line-height: 0.2;">Thanks!</p>
            <br/>
            <br/> 
            <hr style="border: 0.5px solid rgb(186, 185, 185); width: 100%;"></hr>
            <br/> 
            <p style="font-size: 14px; color: grey">Find, Connect & Share with the best Creators, Developers & Designers.</p>
        </div>`,
      headers: {
        "Content-Type": "text/html",
      },
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    return { msg: "Error sending email", error };
  }
};
const sendOTP = async (email, otp) => {
  try{
    const info = await transport
      .sendMail({
        from: `HOPE'S E-COMMERCE WEB-SERVICE <${process.env.MAIL_USER}>`,
        to: email,
        subject: "One Time Password",
        html: `<p style="line-height: 1.5">
        Your OTP verification code is: <br /> <br />
        <font size="3">${otp}</font> <br />
        Best regards,<br />
        E-COMMERCE WEBSITE.
        </p>
        </div>`,
      });

      console.log("Email sent:", info.response);
  } catch(error) {
    console.error("Error sending email:", error);
    return { msg: "Error sending email", error };
  }
};

// const sendAccountVerification = async (email, fullname, password) => {
//   try{
//     const info = await transport
//       .sendMail({
//         from: `medstock.dev@gmail.com <${process.env.MAIL_USER}>`,
//         to: email,
//         subject: "Account Verification",
//         html: `<p style="line-height: 1.5">
//         Congratulations ${fullname}, you account has been approved.
//         You can now log in and gain access to your account with the password ${password}. 
//         Best regards,<br />
//         Team MedStock.
//         </p>
//         </div>`,
//       });

//       console.log("Email sent:", info.response);
//   } catch(error) {
//     console.error("Error sending email:", error);
//     return { msg: "Error sending email", error };
//   }
// }

// const sendAccountVerificationDenial = async (email, fullname) => {
//   try{
//     const info = await transport
//       .sendMail({
//         from: `medstock.dev@gmail.com <${process.env.MAIL_USER}>`,
//         to: email,
//         subject: "Account Verification",
//         html: `<p style="line-height: 1.5">
//         We are sorry to inform you that your account verification
//         request has been denied.
//         Be sure to send in correct details of your medical facility for 
//         it to be verified.
//         Best regards,<br />
//         Team MedStock.
//         </p>
//         </div>`,
//       });

//       console.log("Email sent:", info.response);
//   } catch(error) {
//     console.error("Error sending email:", error);
//     return { msg: "Error sending email", error };
//   }
// }

// const sendContactUs = async (fullname, subject, message, email) => {
//   try{
//     const info = await transport
//       .sendMail({
//         from: email,
//         to: "medstock.dev@gmail.com",
//         subject: subject,
//         html: `<p style="line-height: 1.5">
//         ${fullname}
//         ${message}
//         </p>
//         </div>`,
//       });

//       console.log("Email sent:", info.response);
//   } catch(error) {
//     console.error("Error sending email:", error);
//     return { msg: "Error sending email", error };
//   }
// }

module.exports = {
  sendPasswordReset,
  sendOTP
  // sendAccountVerification,
  // sendAccountVerificationDenial,
  // sendContactUs
};