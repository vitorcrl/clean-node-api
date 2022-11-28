import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
    test('Should Return default Content Type as Json', async () => {
        app.get('/test_content_type', (req, res) => {
            res.send('')
        })
        await request(app)
            .get('/test_content_type')
            .expect('content-type', /json/)
    })
    test('Should Return xml COntent type when forced', async () => {
        app.get('/test_content_type_xml', (req, res) => {
            res.type('xml')
            res.send('')
        })
        await request(app)
            .get('/test_content_type_xml')
            .expect('content-type', /xml/)
    })
})
