#!/usr/bin/env bash


if [[ -f $1 ]]; then
    curl -X POST -F fileUpload=@$1 127.0.0.1:8080/upld.php
else
    echo "Sorry, file not selected or does not exist"
fi
