import request from "supertest"
import { PostsPath, TestClearAllPath, app } from "../../src/app"
import { Encode64 } from "../../src/Authorization/BasicAuthorization/BasicAuthorization"


const _encodedKey = Encode64("admin:qwerty");
const postCompleteStructure = {
    title: expect.any(String),
    shortDescription: expect.any(String),
    content: expect.any(String),
    blogId: expect.any(String),
    blogName: expect.any(String),
    id: expect.any(String)
};
const PostRequestData = {
    title: "Default Title",
    shortDescription: "Default Description",
    content: "Default content",
    blogId: "default id"
}
const authData = `Basic ${_encodedKey}`;
const _authorization = { Authorization: authData };


describe("Posts test", () => {
    it("GET 200", async () => {
        let response = await request(app).get(PostsPath).expect(200);

        expect(response.body).toEqual([postCompleteStructure, postCompleteStructure])
    })
    
    it("GET ID_1 200", async () => {
        let resp_1 = await request(app).get(`${PostsPath}/1`).expect(200);
        expect(resp_1.body).toEqual(postCompleteStructure)
    })

    it("GET ID_2 200", async () => {
        let resp_2 = await request(app).get(`${PostsPath}/2`).expect(200);
        expect(resp_2.body).toEqual(postCompleteStructure)
    })
    it("GET 404 STRING ID", async () => {
        let resp_2 = await request(app).get(`${PostsPath}/sdfs`).expect(404);
    })
    it("GET 404 NOT SUPPORTED ID", async () => {
        let resp_2 = await request(app).get(`${PostsPath}/10000`).expect(404);
    })


    it("POST 201", async () => {
        let response = await request(app).post(PostsPath)
            .send(PostRequestData)
            .set(_authorization);

        expect(response.body).toEqual(postCompleteStructure)
    })

    it("POST 401 NO AUTH", async () => {
        let response = await request(app).post(PostsPath).send(PostRequestData).expect(401);
    })
    it("POST 401 WRONG AUTH", async () => {
        let response = await request(app)
            .post(PostsPath)
            .set({ Authorization: `Basic ${5678456}` })
            .send(PostRequestData)
            .expect(401);
    })
    
    it("POST 400 EMPY BODY", async () => {
        await request(app).post(PostsPath)
            .set(_authorization)
            .send().expect(400);
    })

    it("PUT 204", async () => {
        let response = await request(app).put(`${PostsPath}/1`)
            .set(_authorization)
            .send(PostRequestData)
            .expect(204);
    })

    it("PUT 401 NO AUTH", async () => {
        let response = await request(app)
            .put(`${PostsPath}/1`)
            .send(PostRequestData)
            .expect(401);
    })
    it("PUT 401 WRONG AUTH", async () => {
        let response = await request(app)
            .put(`${PostsPath}/1`)
            .set({ Authorization: `Basic ${5678456}` })
            .send(PostRequestData)
            .expect(401);
    })
    it("PUT 400 EMPTY BODY", async () => {
        let response = await request(app)
            .put(`${PostsPath}/1`)
            .set(_authorization)
            .send()
            .expect(400);
    })

    it("DELETE 204", async () => {
        let response = await request(app)
            .delete(`${PostsPath}/1`)
            .set(_authorization)
            .expect(204);
    })

    it("DELETE 404 NOT SUPPORTED ID", async () => {
        let response = await request(app)
            .delete(`${PostsPath}/1000`)
            .set(_authorization)
            .expect(404);
    })
    it("DELETE 401 NO AUTH", async () => {
        let response = await request(app)
            .delete(`${PostsPath}/1`)
            .expect(401);
    })

    it("DELETE ALL 204", async () => {
        await request(app).delete(TestClearAllPath).expect(204);

        let response = await request(app).get(PostsPath);

        await request(app).get(`${PostsPath}/1`).expect(404);


        expect(response.body).toEqual([]);
    })

})