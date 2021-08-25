This requires running chrome with SharedArrayBuffer:

- Close all instances of chrome
- `"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --enable-features=SharedArrayBuffer`
- Open site: `http://localhost:8000/art/circles/?camera=true`