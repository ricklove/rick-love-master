import express from 'express';
import { getPathNormalized } from 'utils/files';
import { createLessonApiServer_localFileServer } from '../lesson-api-local-file-server';

export const runLocalServer = ({
    port = 3042,
}: {
    port?: number;
}) => {
    const app = express();
    const server = createLessonApiServer_localFileServer({
        lessonModuleFileRootPath: getPathNormalized(__dirname, `../../../data/lesson-module-files/`),
        projectStateRootPath: getPathNormalized(__dirname, `../templates/cra-template/src/project/`),
        renderProjectRootPath: getPathNormalized(__dirname, `../templates/cra-template`),
    });
    app.use(`/`, express.static(`../templates/cra-template/build`));
    app.use(express.json());

    const corsHeaders = {
        'Access-Control-Allow-Origin': `*`,
        'Access-Control-Allow-Methods': `*`,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': `Content-Type`,
        'Access-Control-Max-Age': 86400,
    };

    app.get(`/api`, async (req, res) => {
        console.log(`GET`, { body: req.body });
        return res.set(corsHeaders).json({ value: `TEST` });
    });
    app.options(`/api`, (req, res) => {
        console.log(`OPTIONS`, { body: req.body });
        return res.set(corsHeaders).send();
    });
    app.post(`/api`, async (req, res) => {
        console.log(`POST`, { body: req.body });

        const reqJson = req.body as unknown as { endpoint: keyof typeof server, data: unknown };


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resData = await server[reqJson.endpoint](reqJson.data as any);
        return res.set(corsHeaders).json(resData);
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });

};
