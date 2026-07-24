const {createToken, verifyToken, encryptPass, checkUser} = require("../utils/index")
const db = require('../db');

// async function verifyingUser(req, res, next) {
//     const  {email} = req.query
//     console.log(email)
// try {
    
//     const [data, row] = await dbQuery.pool.query(
//              'SELECT * FROM users WHERE email = ?',
//              [email]
//           )

//     console.log(data)

//     const [usersDetail] = data


//     if(data.length > 0 ) {
//      let tokengenerated = await createToken(usersDetail.role_id,usersDetail.username)
//      console.log(usersDetail.role_id)
//      console.log(usersDetail.role_id === null )
//      console.log(usersDetail.role_id === 0 )
//      if(usersDetail.role_id == 1) return next()
//      if(usersDetail.reportBy === 0) return next(
//          res.status(404).json({role_id: usersDetail.role_id, isVerifide: false, message:"No Manager yet" })
//         )
//      if(usersDetail.role_id === null) {
//         next(
//          res.status(404).json({role_id: usersDetail.role_id, isVerifide: false, message:"No role yet" })
//         )
//      } else {
//         req.headers.autorization = `Bearer ${tokengenerated}`
//         next()
//      }
//     }else {
//         return next(res.status(200).json({status: 401, isVerifide: false, isRegisterd: false, message:"You are not registerd"}))
//      }
// } catch (error) {
//     console.log(error)
// }

// }

// async function verifyingManager(req, res, next) {
//    let {        
//         email,
//         managersemail,
//         password } = req.body
//     console.log(email)
// try {
    
//     const [managerdata, row] = await dbQuery.pool.query(
//              'SELECT * FROM users WHERE email = ? and role_id = 3',
//              [managersemail]
//           )
//         console.log(managersemail)
//     const [userdata, row1] = await dbQuery.pool.query(
//              'SELECT * FROM users WHERE email = ?',
//              [email]
//           )

    
//     const [managerDetail] = managerdata

//     console.log(managerdata.length > 0)
//     if(managerdata.length > 0) {
//         let match = checkUser(password, userdata[0].password)
//         if(match) next()
//         if(!match) next(res.status(401).json({isAuthorized: false ,message:"Password mismatch"}))
 
//          } else {
//         next(
//             res.status(404).json({isVerifide: false, message:"Manager not exist contact admin for assistance" })
//         )
//     }
// } catch (error) {
//     console.log(error)
// }

// }

// async function requestlimit (req, res, next) {
// try {
    
//     const [requestdata, row] = await dbQuery.pool.query(
//              'SELECT * FROM request_table WHERE email = ?',
//              [req.body.email]
//           )

//     console.log(req.body)
//     console.log(requestdata.length > 0)
//     if(requestdata.length === 0) return next()
//     if(requestdata.length > 0) {
//         let match = requestdata[0].request_limit > 1;
//         if(!match) next(res.status(429).json({isAuthorized: false ,message:"Already Sent Request Wait For Managers Approval"}))
//          } else {
//         next(
//             res.status(404).json({isVerifide: false, message:"Manager not exist contact admin for assistance" })
//         )
//     }
// } catch (error) {
//     console.log(error)
// }

// }


// async function deleteRequest (req, res, next){
//  console.log(req)
// try {
//     await dbQuery.pool.execute(`DELETE FROM request_table WHERE email = "${req.body.email}" ;`)
//     next()
// } catch (error) {
//     console.log(error)
// }

// }

async function isSamerole(req, res, next) {
      const { targetUserId, action} = req.body;

        const [rows] = await db.pool.execute('SELECT role FROM users WHERE user_id = ?', [targetUserId]);
        if (rows.length === 0) return next(res.status(404).json({ error: 'User not found' }));
        if (rows[0].role !== 'user') return next(res.status(403).json({ error: 'Admins can only manage users' }));
      next()
}

async function protect(req, res, next) {
    try {
    let isStartBearer = req.headers.authorization.startsWith('Bearer')
    let token = req.headers.authorization.split(" ")[1]
    console.log(isStartBearer)
    console.log(token)

    if(isStartBearer === true && token !== undefined || token !== '' && isStartBearer !== undefined) {
        const {userId} = verifyToken(token)
        const [currentUser] = await db.pool.execute('SELECT role FROM users WHERE user_id = ?', [userId]);
        req.performerRole = currentUser[0].role
        req.performBy = currentUser[0].user_id
        next()
        // let { role_id }=  verifyToken(token) 
        // console.log(role_id)
        //  if(role_id === 3 || role_id == 1 || role_id == 2) {
        //      next()
        //  } else (      
        //     res.status(401).send('User not Authorize')
        //  )
      } 
    } catch (error) {
      res.status(401).send('User not Authorize')  
    }
}

module.exports = {protect, isSamerole}