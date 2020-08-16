#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

sudo apt-get -y install zlib1g-dev
sudo apt-get -y install libbz2-dev
sudo apt-get -y install libpng-dev
sudo apt-get -y install libxml2-dev
sudo apt-get -y install libxslt1-dev

RELEASE=`cat /etc/lsb-release | grep DISTRIB_RELEASE| cut -d "=" -f 2`

if [ "$RELEASE" = "18.04" ]; then
	sudo apt-get -y install libssl1.0-dev
fi
if [ "$RELEASE" = "20.04" ]; then
	sudo apt-get -y install libssl-dev
fi
