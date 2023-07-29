#start-containers.sh

#!/bin/sh
cd /home/charles/devopspipeline

docker-compose build
docker-compose up -d