############################################################################
# Makefile
# Copyright (C) 2014  Belledonne Communications, Grenoble France
#
############################################################################
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
############################################################################

DEVICE?=169.254.0.1
PASSWORD?=1234
DEBUG_TOKEN?=~/.rim/debugtoken1.bar

WORKING_DIR=$(shell pwd)

all: build

build-arm:
	mkdir -p $(WORKING_DIR)/arm && \
	cd $(WORKING_DIR)/../build/ && \
	make build-bb10-arm
	cp ../build/OUTPUT/liblinphone-bb10-sdk/arm/bin/mediastream $(WORKING_DIR)/arm/

build-i486:
	mkdir -p $(WORKING_DIR)/i486 && \
	cd $(WORKING_DIR)/../build/ && \
	make build-bb10-i486
	cp ../build/OUTPUT/liblinphone-bb10-sdk/i486/bin/mediastream $(WORKING_DIR)/i486/

build: build-arm build-i486

clean-arm:
	rm -f $(WORKING_DIR)/arm/mediastream

clean-i486:
	rm -f $(WORKING_DIR)/i486/mediastream

clean: clean-arm clean-i486

package:
	blackberry-nativepackager -package -devMode -debugToken $(DEBUG_TOKEN) -configuration Device-Debug mediastream.bar bar-descriptor.xml

install: package
	blackberry-nativepackager -installApp -device $(DEVICE) -password $(PASSWORD) mediastream.bar

run: install
	blackberry-nativepackager -launchApp -device $(DEVICE) -password $(PASSWORD) mediastream.bar
	blackberry-deploy -terminateApp -device $(DEVICE) -password $(PASSWORD) mediastream.bar
	ssh bb10 'sh -c "cd /accounts/1000/appdata/com.belledonne_communications.mediastream* && LD_LIBRARY_PATH=app/native/lib app/native/mediastream --help"'

uninstall:
	blackberry-deploy -uninstallApp -device $(DEVICE) -password $(PASSWORD) mediastream.bar
