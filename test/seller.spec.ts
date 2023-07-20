import chai from "chai";
// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const {createSeller, getSellers, deleteSellerById, updateSellerById} = require("../../controllers/seller")
import chaiHttp from "chai-http";
import { createSeller, getSellers, deleteSellerById, updateSellerById } from '../controllers/seller.controller'
import 'mocha';
import app from '../index'

const assert = chai.assert
chai.use(chaiHttp)

describe("Seller controller", () => {
    it("should create seller", (done) => {
        let testSeller = {
            "name": "testseller",
            "email": "testseller@gmail.com",
            "gstNumber": "9349389823984098",
            "phoneNumber": "9548741544"
        }
        chai.request(app).post('/seller').send(testSeller).end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.msg, "Seller added successfully")
            done()
        })
    })
    it("should get all sellers", (done) => {
        chai.request(app).get('/seller').end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.msg, "Success")
            assert.typeOf(res.body.data, 'Array')
            done()
        })
    })
    it("should delete seller", (done) => {
        var data = {
            "email": "testseller@gmail.com"
        }
        chai.request(app).delete('/seller').send(data).end((err, res) => {
            assert.equal(res.status, 200)
            done()
            // console.log(res.body)
        })
    })
})