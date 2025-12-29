# windows cmd - convert wav to ogg

- `FOR /F "tokens=*" %G IN ('dir /b *.wav') DO ffmpeg -i "%G" -acodec libvorbis "%~nG.ogg"`
- `FOR /F "tokens=*" %G IN ('dir /b *.aiff') DO ffmpeg -i "%G" -acodec libvorbis "%~nG.ogg"`
