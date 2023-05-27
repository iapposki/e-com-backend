import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from '../config'
import { getRedis } from "../services/redis.service";
import { generateToken } from "../services/user.service";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

	var { at = "", rt = "" } = req.query;
	var tempAt: any = at;
	var tempRt: any = rt;
	if (!at) {
		const atAuthHeader = req.headers["at"];
		// authHeader will look like : Bearer <token>
		// var token = authHeader && authHeader.split(' ')[1];
		tempAt = atAuthHeader && (atAuthHeader as string).split(" ")[1];
	}
	if (!rt) {
		const rtAuthHeader = req.headers["rt"];
		tempRt = rtAuthHeader && (rtAuthHeader as string).split(" ")[1];
	}
	// console.log(token)
	if (!at || !rt) {
		return res
			.status(401)
			.json({
				msg: `${!at ? "Access token not provided" : "Refresh token not provided"
					}`,
			});
	}
	try {
		const { name, email, role } = jwt.verify(tempAt, config.authSecret) as jwt.JwtPayload;
		// console.log(resp)
		if (req.userDetails) {
			throw new Error("Someone tried to hack.")
		}
		req.userDetails = { name, email, role };
		console.log("ok");
		next();
	} catch (error: any) {
		if (error.name === "TokenExpiredError") {
			// console.log('access token has expired.')
			try {
				const { name, email, role } = jwt.verify(tempRt, config.authSecret) as jwt.JwtPayload;
				const redisClient = await getRedis();
				var rtRedis = await redisClient.GET("rt-" + email);
				if (rtRedis !== tempRt) {
					throw new Error("Refresh token is invalid");
				}
				// console.log('ooof')
				try {
					req.userDetails = { name, email, role };
					const rt = await generateToken(name, email, role, "7d");
					await redisClient.set("rt-" + email, rt, {
						EX: 604800,
					});
					const at = await generateToken(name, email, role);
					const oldResJson = res.json;
					res.json = function (data) {
						data.at = at;
						data.rt = rt;
						res.json = oldResJson;
						return res.json(data);
					};
					// res.rt = token
					next();
				} catch (error1) {
					console.log(error1);
					res.status(401).json({ msg: "Unauthorized." });
				}
			} catch (error2: any) {
				if (error2.name === "TokenExpiredError") {
					res
						.status(401)
						.json({
							msg: "Unauthorized, refresh token has expired. Please login again",
						});
				} else {
					res
						.status(401)
						.json({ msg: "Unauthorized, refresh token is invalid." });
				}
			}
		} else {
			console.log(error.stack);
			res.status(401).json({ msg: "Unauthorized" });
		}
	}
};

