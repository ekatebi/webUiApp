#!/bin/bash

curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get purge -y nodejs 
sudo apt-get install -y nodejs 
