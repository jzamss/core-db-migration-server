docker rmi ramesesinc/db-migration-server:0.0.1 -f

docker system prune -f

docker build -t ramesesinc/db-migration-server:0.0.1 --rm .
