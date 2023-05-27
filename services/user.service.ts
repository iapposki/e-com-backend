import { PrismaClient, Prisma } from "@prisma/client";
import { Md5 } from "ts-md5";
import * as jwt from 'jsonwebtoken'
import { config } from '../config'
import { getRedis } from "./redis.service";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export const generateToken = async (
	name: string,
	email: string,
	role: string,
	expiry: string | number = 300,
	randomNumber = Math.random()
) => {
	const token = jwt.sign({ name, email, role, randomNumber }, config.authSecret, {
		expiresIn: expiry,
	});
	return token;
};

export const createUser = async (userDetails: any) => {
	await prisma.user.create({
		data: {
			...userDetails,
			role: "USER",
			password: Md5.hashStr(userDetails.password),
		},
	});
	const at = await generateToken(userDetails.name, userDetails.email, "USER");
	const rt = await generateToken(
		userDetails.name,
		userDetails.email,
		"USER",
		"7d"
	);
	const redisClient = await getRedis();
	await redisClient.SET("rt-" + userDetails.email, rt, {
		EX: 604800,
	});
	const tokens = { at, rt };
	return tokens;
};

export const validateUsernamePassword = async (email: string, password: string) => {
	const user: User | null = await prisma.user.findFirst({ where: { email: email } });
	if (user && user.password === Md5.hashStr(password)) {
		const at = await generateToken(user.name, email, user.role);
		const rt = await generateToken(
			user.name,
			email,
			user.role,
			"7d"
		);
		const redisClient = await getRedis();
		await redisClient.set("rt-" + email, rt, {
			EX: 604800,
		});
		const tokens = { at, rt };
		return { pass: true, tokens: tokens };
	}
	return false;
};

export const getUserByEmail = async (email: string) => {
	const record: User | null = await prisma.user.findFirst({ where: { email: email } });
	return record;
};

export const updatePassword = async (email: string, password: string) => {
	await prisma.user.update({
		where: { email: email },
		data: { password: Md5.hashStr(password) },
	});
};

export const toggleVerification = async (email: string, isVerified: boolean) => {
	await prisma.user.update({
		where: { email: email },
		data: { isVerified: !isVerified },
	});
};
