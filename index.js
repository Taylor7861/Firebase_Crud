const express = require('express');
const app = express();
const admin = require('firebase-admin')
const credentials = require('./key.json')




admin.initializeApp({
    credential: admin.credential.cert(credentials)
})




app.use(express.json())
app.use(express.urlencoded({extended:true}));


const db = admin.firestore();

app.post('/create', async(req,res)=>{

    try {
        console.log(req.body);
        const id = req.body.email
        const userJson ={
            email: req.body.email,  
            FirstName: req.body.FirstName,
            LastName: req.body.LastName
        }

        const response = await db.collection('users').add(userJson)
        res.send(response).status(200)
    } catch (error) {
        
        console.log(error);
    }
})

app.get('/getAllUser' ,async(req,res)=>{


    try {
        const useRef = db.collection("users");
        const response = await useRef.get();
        const responseArr = []
    response.forEach(doc =>{
        responseArr.push(doc.data());
    })

    res.send(responseArr);
    console.log(responseArr);
    } catch (error) {
        console.error(error)
    }





} )

app.get('/getUserby/:id' ,async(req,res)=>{


    try {
        const useRef = db.collection("users").doc(req.params.id);
        const response = await useRef.get();
    res.send(response.data());
    console.log(response);
    } catch (error) {
        console.error(error)
    }
} )

app.post('/update', async(req,res)=>{
try {
    const id = req.body.id
const updatedName = req.body.updatedName;
const useRef = await db.collection("users").doc(id).update({
    FirstName: updatedName
});

res.send(useRef);
} catch (error) {
    console.log(error)
}


})

app.delete('/delete/:id', async(req,res)=>{
try {
const response = await db.collection("user").doc(req.params.id).delete()
res.send(response)
console.log(`delete response:`, response);  
} catch (error) {
    console.log(error);
}
})




const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})