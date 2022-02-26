const User = require('../models/userModel')
const jwt=require('jsonwebtoken');
const config = require('../config');

const userCtrl={
    find: (req, res, next) => {
        // If a query string ?publicAddress=... is given, then filter results
        // console.log(req)
        const whereClause =
            req.query && req.query.publicAddress
                ? {
                          publicAddress: req.query.publicAddress ,
                  }
                : undefined;
    
        return User.find(whereClause)
            .then((users) => res.json(users))
            .catch(next);
    },
    get:(req, res, next) => {
        // AccessToken payload is in req.user.payload, especially its `id` field
        // UserId is the param in /users/:userId
        // We only allow user accessing herself, i.e. require payload.id==userId
         const token = req.header("Authorization")
         console.log(token)
         const decode= jwt.verify(token,config.secret)
        //  console.log(decode)

        if (decode.payload.id !== req.params.userId) {
            return res
                .status(401)
                .send({ error: 'You can can only access yourself' });
        }
        return User.findById({_id:req.params.userId})
            .then((user) => res.json(user))
            .catch(next);
    },
    create:(req, res, next) =>{
        const today = new Date();
        const month = today.getMonth();     // 10 (Month is 0-based, so 10 means 11th Month)
        const year = today.getFullYear();

        req.body.joined=`${year}`


        return User.create(req.body)
		.then((user) => res.json(user))
		.catch(next)

    },
	
    patch:(req, res, next) => {
        // Only allow to fetch current user
        const token = req.header("Authorization")
        //  console.log(token)
         const decode= jwt.verify(token,config.secret)
         console.log(decode)
         console.log(req.params)
        if (decode.payload.id !== req.params.userId) {
            return res
                .status(401)
                .send({ error: 'You can can only access yourself' });
        }
        User.findById({_id:req.params.userId})
            .then(async(user) => {
                console.log(req.body)
                
                let update={
                    name: req.body.username,
                    profile: req.body.profile
                }
                 user = await User.findOneAndUpdate({_id:req.params.userId}, update, {
                    new: true,
                    upsert: true // Make this update into an upsert
                  });
                if (!user) {
                    return user;
                }
    
                // Object.assign(user, req.body);
                
                // console.log(doc)

                return user;
            })
            .then((user) => {
                return user
                    ? res.json(user)
                    : res.status(401).send({
                            error: `User with publicAddress ${req.params.userId} is not found in database`,
                      });
            })
            .catch(next);
    }

}


module.exports = userCtrl
