#!/bin/bash

set -eu

if ! grep -q "PS1='\${debian_chroot:+(\$debian_chroot)}\[\033[01;35m\]\u@\h\[\033[01;34m\] \w \[\033[01;31m\] \[\033[01;35m\]\$ \[\033[00m\] '" /root/.bashrc; then
    echo "export PS1='\${debian_chroot:+(\$debian_chroot)}\[\033[01;35m\]\u@\h\[\033[01;34m\] \w \[\033[01;31m\] \[\033[01;35m\]\$ \[\033[00m\] '" >> /root/.bashrc
fi


function wait_for_service() {
    local host=$1
    local port=$2
    local retries=30
    local wait=2


    echo "Verificando servicio en $host:$port..."

    for i in $(seq 1 $retries); do
        if nc -z "$host" "$port"; then
            echo "Servicio $host:$port está acessible."
            return 0
        else
            echo "Intento $i/$retries: $host:$port no acessible. Esperando $wait segundos..."
            sleep $wait
        fi
    done

    echo "Error: No se pudo conectar a $host:$port después de $retries intentos."
    exit 1
}

cp ./bin/r-backups /bin/r-backups
chmod +x /bin/r-backups

wait_for_service "bbel-postgres" 5432

wait_for_service "bbel-redis" 6379

exec npm run start:prod
