import request from "supertest"
import { app, BlogsPath } from "../../src/app"
import { basicAothorizer } from "../../src/Authorization/BasicAuthorization/BasicAuthorization"

const _encodedKey = basicAothorizer.Encode("admin:qwerty");

describe("Blogs test", () => {
    it("GET 200", async () => {
        let response = await request(app).get(BlogsPath).expect(200);

        expect(response.body).toEqual([
            {
                "name": "Jamie Oliver",
                "description": "How to cook fast and delicious",
                "websiteUrl": "www.jamoli.com",
                "id": "1"
            },
            {
                "name": "Jacky Chan",
                "description": "Kiya!",
                "websiteUrl": "www.chanchan.cn",
                "id": "2"
            }
        ])
    })

    it("GET ID_1 200", async () => {
        let resp_1 = await request(app).get(`${BlogsPath}/1`).expect(200);
        let resp_2 = await request(app).get(`${BlogsPath}/2`).expect(200);
        expect(resp_1.body).toEqual(
            {
                "name": "Jamie Oliver",
                "description": "How to cook fast and delicious",
                "websiteUrl": "www.jamoli.com",
                "id": "1"
            })
    })

    it("GET ID_2 200", async () => {
        let resp_2 = await request(app).get(`${BlogsPath}/2`).expect(200);
        expect(resp_2.body).toEqual(
            {
                "name": "Jacky Chan",
                "description": "Kiya!",
                "websiteUrl": "www.chanchan.cn",
                "id": "2"
            })
    })
    it("GET 404 STRING ID", async () => {
        let resp_2 = await request(app).get(`${BlogsPath}/sdfs`).expect(404);
    })
    it("GET 404 NOT SUPPORTED ID", async () => {
        let resp_2 = await request(app).get(`${BlogsPath}/10000`).expect(404);
    })


    it("POST 201", async () => {
        let response = await request(app).post(BlogsPath)
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        })
        .set({ Authorization: `Basic ${_encodedKey}`})
        .expect(201);

        expect(response.body).toEqual({
            id: expect.any(String),
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        })
    })

    it("POST 401 NO AUTH", async () => {
        let response = await request(app).post(BlogsPath).send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(401);
    })
    it("POST 401 WRONG AUTH", async () => {
        let response = await request(app)
        .post(BlogsPath)
        .set({ Authorization: `Bosic ${12345}`})
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(401);
    })


    it("POST 400 WRONG FIELD NAME(name)", async () => {
        await request(app).post(BlogsPath)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "nam": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(400);
    })
    it("POST 400 WRONG FIELD NAME(description)", async () => {
        await request(app).post(BlogsPath)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "name": "Elon Mask",
            "descption": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(400);
    })
    it("POST 400 WRONG FIELD NAME(Url)", async () => {
        await request(app).post(BlogsPath)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websitUrl": "www.elonmelon.com"
        }).expect(400);
    })
    it("POST 400 EMPY BODY", async () => {
        await request(app).post(BlogsPath)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send().expect(400);
    })

    it("PUT 204", async () =>{
        let response = await request(app).put(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(204);
    })

    it("PUT 401 NO AUTH", async () =>{
        let response = await request(app)
        .put(`${BlogsPath}/1`)
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(401);
    })
    it("PUT 401 WRONG AUTH", async () =>{
        let response = await request(app)
        .put(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${5678456}`})
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(401);
    })

    it("PUT 400 WRONG FIELD NAME(name)", async () =>{
        let response = await request(app)
        .put(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "ame": "Elon Mask",
            "description": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(400);
    })
    it("PUT 400 WRONG FIELD NAME(description)", async () =>{
        let response = await request(app)
        .put(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "name": "Elon Mask",
            "desiptin": "I did another stupid thing",
            "websiteUrl": "www.elonmelon.com"
        }).expect(400);
    })
    it("PUT 400 WRONG FIELD NAME(Url)", async () =>{
        let response = await request(app)
        .put(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send({
            "name": "Elon Mask",
            "description": "I did another stupid thing",
            "Url": "www.elonmelon.com"
        }).expect(400);
    })
    it("PUT 400 EMPTY BODY", async () =>{
        let response = await request(app)
        .put(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .send()
        .expect(400);
    })

    it("DELETE 204", async () =>{
        let response = await request(app)
        .delete(`${BlogsPath}/1`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .expect(204);
    })

    it("DELETE 404 NOT SUPPORTED ID", async () =>{
        let response = await request(app)
        .delete(`${BlogsPath}/1000`)
        .set({ Authorization: `Basic ${_encodedKey}`})
        .expect(404);
    })
    it("DELETE 401 NO AUTH", async () =>{
        let response = await request(app)
        .delete(`${BlogsPath}/1`)
        .expect(401);
    })
})