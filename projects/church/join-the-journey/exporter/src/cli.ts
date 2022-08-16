import { SecureToken } from '@ricklove/utils-core';
import { exportArticles } from './export-articles';

// eslint-disable-next-line no-void
void exportArticles({
  // TEMP: Hardcode config
  uploadApiUrl: `https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/upload-api`,
  // TEMP
  fileSystemIndexUrl: {
    putUrl: `https://rick-love-blog-user-data.s3.amazonaws.com/join-the-journey/fileSystem/bf7a0bb5-0e75-4748-9e7f-365ecbee50a4?Content-Type=application%2Fjson&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAW5EVKEN4DXHMHWFW%2F20220816%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220816T023745Z&X-Amz-Expires=604800&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJHMEUCIGCBc78vazsaGdgISEEzMwSW%2B8if19nI6ZtrKqojtAyeAiEA9AsVELklN%2BNX42J4wiUFmPDvf7nI81Bz9GMn6plktekqogMIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAEGgw0NzQ5MDcwMjYyOTYiDIPK3Aqh7EiSb%2FIpNir2ArlDdWgXDMyQZ2plKz%2Fw77Xh7kh0PY1t0hZ49mHQYv7MZRYh7PnKGan7BodWldIha0EJDg3xW4JQdax%2B45FR%2Bt%2BMqemhMcIMXNco0KGBXWPZH8l7KAu48vuWv5xE2B%2FNcxM6Bxp%2F%2Fumj7mPCPGSpC9v1GDwrpSE4OBWlPrkAMfwdepCs0ygz8HRJokxyFlhgevD28Oq7EZ22vmNaiaxrRauo3%2BN4VOxzX8JD8sSDRJY%2B8OXDecgicWUp7hWPtQdG0xRsGcejvLHjlUo72INvAxNutHSI7jJNKhuLQy0%2Bzi%2BixIU%2BUuB042AlJ9e0WyjjIBhzoRKV9OlSbmDdTQONcH99812k9YSVEZ%2BnU5JalIcdcwFG5eopHA%2FfEMD9eroHJshGHQZtQCkO1GX22V5HpNqfrKyrsFhh46syssEk3dxfbOplyeShZaUSXAnx%2BvJn8gQEvqOxBz5HsBxGA8B%2BrX9%2F96Qvu1SwAr99QiTlEfeuX1We%2BiaZMNeD7JcGOp0BPYe5gKzz9XNdOZtXY7paF3FJYhQI5CCQFyDBPyWPN%2BM4HxFRSVBbzDVKd%2FiB2QzYc7iZuNK4mv5oleAgbyLz1WW1tcZKLva2r22oBqICcuNuApIpSPkcA%2BNvQ9zm7od6x%2FlLXrWboNVL5RU%2FGkuRQXyMuFsBK6OcTBNHn0uKqJ3xPLVgYeRktQ6VU9VVfr8J26YaSUO6Slw%2Brkem1A%3D%3D&X-Amz-Signature=cc3ec121fc1b611ee443ec373e49e2cbee786a922adf5426758d1b74ce1a38db&X-Amz-SignedHeaders=host`,
    getUrl: `https://rick-love-blog-user-data.s3.amazonaws.com/join-the-journey/fileSystem/bf7a0bb5-0e75-4748-9e7f-365ecbee50a4`,
    relativePath: `join-the-journey/fileSystem/bf7a0bb5-0e75-4748-9e7f-365ecbee50a4`,
    expirationTimestamp: 1661222265746,
    contentType: `application/json`,
    secretKey: `D0uWcQKXNpD6ZTscfisGfP3Yooq8qPXXCqYk_LPGcRY=` as SecureToken,
    isTemporaryObject: false,
  },
});
