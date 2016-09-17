#!/usr/bin/env bash


if [[ -f $1 ]]; then
    #fileUpload is the argument that PHP uses for $FILES
    #I currently don't know if there's a standard for this.
    curl -X POST -F fileUpload=@$1 127.0.0.1:8080/upld.php
else
    echo "Sorry, file not selected or does not exist"
fi
