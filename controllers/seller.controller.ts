import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { logger } from "../log";
import { Request, Response } from "express";
import { Seller } from "@prisma/client";

export const createSeller = async (req: Request, res: Response) => {
    try {
        const { name, email, gstNumber, phoneNumber } = req.body;
        await prisma.seller.create({
            data: {
                name, email, gstNumber, phoneNumber
            }
        });
        res.status(200).json({ msg: 'Seller added successfully' });
        console.log("Seller created successfully");
    } catch (err) {
        // logger.error(err.stack)
        console.log(err);
        res.status(400).json({ msg: 'Error while adding Seller' });
    }
}

export const getSellers = async (req: Request, res: Response) => {
    try {
        const response: Array<Seller> = await prisma.seller.findMany({})
        res.status(200).json({ msg: 'Success', data: response });
    } catch (err) {
        res.status(400).json({ msg: 'Error while fetching sellers' });
    }
}

export const deleteSellerById = async (req: Request, res: Response) => {
    try {
        const { id, email } = req.body;
        if (id) {
            await prisma.seller.delete({
                where: {
                    id: id
                }
            });
        } else {
            await prisma.seller.delete({
                where: {
                    email: email
                }
            })
        }
        if (id) {
            res.status(200).json({ msg: 'Successfully deleted seller with id ' + id });
        } else {
            res.status(200).json({ msg: "Successfully deleted seller with email : " + email })
        }
    } catch (err) {
        res.status(400).json({ msg: 'Error while deleting seller' });
    }
}

export const updateSellerById = async (req: Request, res: Response) => {
    try {
        const { id, newId, name, email, gstNumber, phoneNumber } = req.body;
        await prisma.seller.update({
            where: {
                id: id,
            },
            data: {
                name, email, gstNumber, phoneNumber
            }
        });
        res.status(200).json({ msg: 'Successfully updated seller with id ' + id });
    } catch (err) {
        res.status(400).json({ msg: 'Error while updating seller' });
    }
}

