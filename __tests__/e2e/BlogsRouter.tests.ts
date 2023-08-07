import request from "supertest"
import { BlogsPath, TestClearAllPath, app } from "../../src/app"

import { Encode64 } from "../../src/Authorization/BasicAuthorization/BasicAuthorization"


const _encodedKey = Encode64("admin:qwerty");
const blogCompleteStructure = {
    name: expect.any(String),
    description: expect.any(String),
    websiteUrl: expect.any(String),
    id: expect.any(String),
    createdAt: expect.any(String),
    isMembership: false
};

describe("Blogs test", () => {

    it("DELETE ALL 204", async () => {
        await request(app).delete(TestClearAllPath).expect(204);

        let response = await request(app).get(BlogsPath).expect(200);

        await request(app).get(`${BlogsPath}/1`).expect(404);


        expect(response.body).toEqual([]);
    })

    it("POST 201", async () => {
        let response = await request(app).post(BlogsPath)
            .send({
                "name": "Elon Mask",
                "description": "I did another stupid thing",
                "websiteUrl": "www.elonmelon.com"
            })
            .set({ Authorization: `Basic ${_encodedKey}` })
            .expect(201);

        expect(response.body).toEqual({
            id: expect.any(String),
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com",
            createdAt: expect.any(String),
            isMembership: false
        })
    })

    it("GET 200", async () => {
        let response = await request(app).get(BlogsPath).expect(200);

        expect(response.body).toEqual(
            [blogCompleteStructure]
        )
    })

    // it("GET ID_1 200", async () => {
    //     let resp_1 = await request(app).get(`${BlogsPath}/1`).expect(200);
    //     expect(resp_1.body).toEqual(
    //         postCompleteStructure)
    // })

    // it("GET ID_2 200", async () => {
    //     let resp_2 = await request(app).get(`${BlogsPath}/2`).expect(200);
    //     expect(resp_2.body).toEqual(
    //         postCompleteStructure)
    // })
    // it("GET 404 STRING ID", async () => {
    //     let resp_2 = await request(app).get(`${BlogsPath}/sdfs`).expect(404);
    // })
    // it("GET 404 NOT SUPPORTED ID", async () => {
    //     let resp_2 = await request(app).get(`${BlogsPath}/10000`).expect(404);
    // })


    

    // it("POST 401 NO AUTH", async () => {
    //     let response = await request(app).post(BlogsPath).send({
    //         "name": "Elon Mask",
    //         "description": "I did another stupid thing",
    //         "websiteUrl": "www.elonmelon.com"
    //     }).expect(401);
    // })
    // it("POST 401 WRONG AUTH", async () => {
    //     let response = await request(app)
    //         .post(BlogsPath)
    //         .set({ Authorization: `Bosic ${12345}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(401);
    // })


    // it("POST 400 WRONG FIELD NAME(name)", async () => {
    //     let response = await request(app).post(BlogsPath)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "nam": "somename",
    //             "websiteUrl": "invalid-url",
    //             "description": "description"
    //         })
    //         .expect(400);
    //     expect(response.body).toEqual({
    //         errorsMessages: [{
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         },
    //         {
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         }]

    //     })
    // });

    // it("POST 400 WRONG FIELD NAME(description)", async () => {
    //     let response = await request(app).post(BlogsPath)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "descption": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(400);
    //     expect(response.body).toEqual({
    //         errorsMessages: [{
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         }]

    //     })
    // })
    // it("POST 400 WRONG FIELD NAME(Url)", async () => {
    //     let response = await request(app).post(BlogsPath)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "websitUrl": "www.elonmelon.com"
    //         }).expect(400);

    //     expect(response.body).toEqual({
    //         errorsMessages: [{
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         }]

    //     })
    // })
    // it("POST 400 EMPY BODY", async () => {
    //     let response = await request(app).post(BlogsPath)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send().expect(400);

    //     expect(response.body).toEqual({
    //         errorsMessages: [{
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         },
    //         {
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         },
    //         {
    //             field: expect.any(String),
    //             message: expect.any(String)
    //         }]

    //     })
    // })

    // it("PUT 204", async () => {
    //     let response = await request(app).put(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(204);
    // })

    // it("PUT 401 NO AUTH", async () => {
    //     let response = await request(app)
    //         .put(`${BlogsPath}/1`)
    //         .send({
    //             "name": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(401);
    // })
    // it("PUT 401 WRONG AUTH", async () => {
    //     let response = await request(app)
    //         .put(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${5678456}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(401);
    // })

    // it("PUT 400 WRONG FIELD NAME(name)", async () => {
    //     let response = await request(app)
    //         .put(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "ame": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(400);
    // })
    // it("PUT 400 WRONG FIELD NAME(description)", async () => {
    //     let response = await request(app)
    //         .put(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "desiptin": "I did another stupid thing",
    //             "websiteUrl": "www.elonmelon.com"
    //         }).expect(400);
    // })
    // it("PUT 400 WRONG FIELD NAME(Url)", async () => {
    //     let response = await request(app)
    //         .put(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send({
    //             "name": "Elon Mask",
    //             "description": "I did another stupid thing",
    //             "Url": "www.elonmelon.com"
    //         }).expect(400);
    // })
    // it("PUT 400 EMPTY BODY", async () => {
    //     let response = await request(app)
    //         .put(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .send()
    //         .expect(400);
    // })

    // it("DELETE 204", async () => {
    //     let response = await request(app)
    //         .delete(`${BlogsPath}/1`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .expect(204);
    // })

    // it("DELETE 404 NOT SUPPORTED ID", async () => {
    //     let response = await request(app)
    //         .delete(`${BlogsPath}/1000`)
    //         .set({ Authorization: `Basic ${_encodedKey}` })
    //         .expect(404);
    // })
    // it("DELETE 401 NO AUTH", async () => {
    //     let response = await request(app)
    //         .delete(`${BlogsPath}/1`)
    //         .expect(401);
    // })

    

})