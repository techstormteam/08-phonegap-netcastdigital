############################################################################
# ortp.cmake
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

set(EP_ortp_GIT_REPOSITORY "git://git.linphone.org/ortp.git")
if(${LINPHONE_BUILDER_LATEST})
	set(EP_ortp_GIT_TAG "master")
else()
	set(EP_ortp_GIT_TAG "459dd69b898f4d7e2eb74b7ccfa2e0e1093b2376")
endif()

if(MSVC)
	# Use temporary CMake build scripts for Windows. TODO: Port fully to CMake.
	set(EP_ortp_DEPENDENCIES EP_srtp)
	set(EP_ortp_EXTRA_LDFLAGS "/SAFESEH:NO")
else()
	set(EP_ortp_BUILD_METHOD "autotools")
	set(EP_ortp_USE_AUTOGEN "yes")
	set(EP_ortp_CONFIG_H_FILE ortp-config.h)
	set(EP_ortp_CROSS_COMPILATION_OPTIONS
		"--prefix=${CMAKE_INSTALL_PREFIX}"
		"--host=${LINPHONE_BUILDER_HOST}"
	)
	set(EP_ortp_CONFIGURE_OPTIONS
		"--disable-strict"
	)
	set(EP_ortp_LINKING_TYPE "--disable-static" "--enable-shared")
	set(EP_ortp_DEPENDENCIES )

	if(${ENABLE_SRTP})
		list(APPEND EP_ortp_CONFIGURE_OPTIONS "--with-srtp=${CMAKE_INSTALL_PREFIX}")
		list(APPEND EP_ortp_DEPENDENCIES EP_srtp)
	else()
		list(APPEND EP_ortp_CONFIGURE_OPTIONS "--with-srtp=none")
	endif()

	if(${ENABLE_ZRTP})
		list(APPEND EP_ortp_DEPENDENCIES EP_bzrtp)
		list(APPEND EP_ortp_CONFIGURE_OPTIONS "--enable-zrtp")
	else()
		list(APPEND EP_ortp_CONFIGURE_OPTIONS "--disable-zrtp")
	endif()
endif()
