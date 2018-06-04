#!/bin/bash

docker stop `docker ps | grep 'stevebrownlee/yak' | awk '{ print $1 }'`

