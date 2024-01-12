const mongoose = require('mongoose')
const User = require('../Model/userModel.js')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))



const securePassword = async (pass) => {
    const passworde = await bcrypt.hash(pass, 10)
    return passworde;
}


app.post("/register", async (req, res) => {
    const data = req.body;


    if (data.password != data.confirmpassword) {
        res.status(400).send({ status: "password are differnt" });
    }

    const securePass = await securePassword(req.body.password)

    console.log(data);
    const user = User({
        email: req.body.email,
        password: securePass,
        confirmpassword: securePass
    })

    const useData = await User.findOne({ email: req.body.email });
    if (useData) {
        res.status(400).send({ status: "email already exist" })
    }
    else {

        const result = await user.save();
        console.log(result);
        res.send(result);
    }
})






app.post('/login', async (req, resp) => {

    try {
        const result = await User.findOne({ email: req.body.email });
        console.log(result)
        bcrypt.compare(req.body.password, result.password)
            .then(doMatch => {
                if (doMatch) {

                    resp.send(result)
                } else {
                    return resp.status(422).json({ error: "Invalid Email or Password" })
                }
            });

    } catch (error) {
        resp.status(400).send(error);
    }
})


var transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    logger: true,
    bebug: true,
    service: 'gmail',
    secureConnection: true,
    auth: {
        user: 'yaadavhemant20056@gmail.com',
        pass: 'zxse rpnp pgwx rhzq'
    },
    tls: {
        rejectUnauthorized: true
    }
});


app.post("/forgetpassword", async (req, res) => {

    console.log(req.body.email)

    var mailOptions = {
        from: 'yaadavhemant20056@gmail.com',
        to: req.body.email,
        subject: 'For Changing Password',
        text: 'That was easy! ' +
            "you can change your password by clicking on below link " +
            "http://localhost:4200/resetpassword/" + req.body.email
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(400).send({ status: error + "erreo" });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({ status: "send mail successfully..!" });
        }
    });

})

app.post("/resetpassword", async (req, res) => {

    const data = req.body;

    

    const userData = await User.findOne({ email: data.email });
    
    if (userData) {

        console.log("inner");
        if (data.password != data.confirmpassword) {
            res.status(400).send({ status: "password are differnt" });
        }

        const securePass = await securePassword(req.body.password)

      //  console.log(data);
       
         
        const useData = await User.updateOne(
            {email:userData.email},
            {
                $set:{password:securePass,confirmpassword:securePass}
            }
        );
        console.log(userData)
        if (useData) {
            console.log("good");
            res.status(200).send({ status: "you password updated" })
        }
        else {
            res.status(401).send({status:"internal Error"});
        }

    }
    else{
        res.status(400).send({
            status:'check you email'
        })
    }

})


// app.get("/user",async(req,resp)=>{
//     try {
//         const result = await User.find();
//         resp.send(result)

//     } catch (error) {
//         resp.status(401).send(error)
//     }
// })

// app.get("/",async(req,resp)=>{
//     resp.send("hemnat");
// })
// app.post('/register', async (req, resp) => {


//     const securePass = await securePassword(req.body.password)
//     console.log(securePass)
//     const user = User({
//         email: req.body.email,
//         password: securePass,
//         confirmpassword: securePass
//     })

//     const userdata = await User.findOne({email:req.body.email})
//     console.log(userdata)
//     if(userdata){
//           resp.status(401).send({result:"Email Already Exist"})
//     }
//     else{
//         const result = await user.save();
//         console.log(result)

//         if(result){
//                  resp.status(200).send({
//                     status:"good"
//                  })
//         }
//         else{
//             resp.status(400).send({
//                 status:"bad"
//             })
//         }


//         //console.log(result)
//        // resp.status(200).send({status:"successfully inserted"})
//     }
// })



module.exports = app;