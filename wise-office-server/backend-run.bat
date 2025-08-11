@echo off


echo backend server initalizing....
docker build -t backoffice .

echo build complete!
echo running container!

docker run -d -p 8080:8080 --name backoffice_app backoffice

echo finish! you can access 'http://localhost:8080'